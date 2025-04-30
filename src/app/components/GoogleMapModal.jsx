"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import "@googlemaps/extended-component-library/place_picker.js";
import CloseIcon from "@mui/icons-material/Close";
/* ─────────────────── constants ──────────────────── */
// one static array → no more “LoadScript reloaded” warning
const MAP_LIBRARIES = ["places"];
const mapStyle = { width: "100%", height: 380, borderRadius: "0.75rem" };
/* ─────────────────── helper ─────────────────────── */
function getLatLng(place) {
  // new SDK
  if (place?.location && typeof place.location.lat === "number") {
    return place.location;
  }
  // legacy
  if (place?.geometry?.location) {
    return {
      lat:
        typeof place.geometry.location.lat === "function"
          ? place.geometry.location.lat()
          : place.geometry.location.lat,
      lng:
        typeof place.geometry.location.lng === "function"
          ? place.geometry.location.lng()
          : place.geometry.location.lng,
    };
  }
  return null;
}

/* ────────────────── component ───────────────────── */
export default function GoogleMapModal({ open, onClose, onSave }) {
  const [center, setCenter] = useState(null);
  const [markerPos, setMarkerPos] = useState(null);

  const pickerRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
    version: "beta",
    libraries: MAP_LIBRARIES, // static reference
  });

  /* (1) locate the user once */
  useEffect(() => {
    if (!isLoaded || center) return;

    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => {
        const pos = { lat: coords.latitude, lng: coords.longitude };
        setCenter(pos);
        setMarkerPos(pos);
      },
      () => setCenter({ lat: 20, lng: 0 }),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [isLoaded, center]);

  /* (2) place-picker → map */
  useEffect(() => {
    if (!isLoaded || !pickerRef.current) return;

    const picker = pickerRef.current;

    const handlePlaceChange = () => {
      const pos = getLatLng(picker.value);
      if (!pos) return;
      console.info("Chosen coords:", pos);
      setCenter(pos);      // recenter map
      setMarkerPos(pos);   // move marker
    };

    picker.addEventListener("gmpx-placechange", handlePlaceChange);
    return () =>
      picker.removeEventListener("gmpx-placechange", handlePlaceChange);
  }, [isLoaded]);

  /* (3) clicks / drags */
  const handleMapClick = useCallback((e) => {
    if (!e.latLng) return;
    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    console.info("Clicked/dragged coords:", pos);
    setCenter(pos);
    setMarkerPos(pos);
  }, []);

  const save = () => {
    if (markerPos) onSave(markerPos);
    onClose();
  };

  /* early exits */
  if (!open) return null;
  if (!isLoaded || !center) {
    return (
      <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center">
        <p className="bg-white rounded-lg px-8 py-6 shadow">Loading map…</p>
      </div>
    );
  }

  /* ─────────────────── UI ────────────────────────── */
  return (
    <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl">
        {/* header */}
        <div className="flex items-center justify-between bg-gray-100 px-4 py-2">
          <h3 className="text-sm font-semibold tracking-wide text-gray-700">
            Select location
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 text-gray-600"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* place picker */}
          <gmpx-place-picker
            ref={pickerRef}
            style={{ display: "block" }}
            className="w-full"
          >
            <input
              slot="input"
              type="text"
              placeholder="Search an address…"
              className="w-full border border-gray-300 rounded-md p-2
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </gmpx-place-picker>

          {/* map */}
          <GoogleMap
            mapContainerStyle={mapStyle}
            center={center}
            zoom={16}
            onClick={handleMapClick}
            options={{ clickableIcons: false, streetViewControl: false }}
          >
            {markerPos && (
              <Marker
                position={markerPos}
                draggable
                onDragEnd={handleMapClick}
              />
            )}
          </GoogleMap>

          {/* actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-1 rounded-md border border-gray-400
                         text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              disabled={!markerPos}
              onClick={save}
              className={`px-4 py-1 rounded-md text-white ${
                markerPos
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-300 cursor-not-allowed"
              }`}
            >
              Use this point
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
