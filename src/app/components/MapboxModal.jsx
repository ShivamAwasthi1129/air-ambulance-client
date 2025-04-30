"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import CloseIcon from "@mui/icons-material/Close";

/* ─────────────── config ─────────────── */
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN; // set in .env.local
const mapStyle = { width: "100%", height: 380, borderRadius: "0.75rem" };

/* helper – [lng,lat] array → {lng,lat} object */
const toLngLat = (c) => ({ lng: c[0], lat: c[1] });

export default function MapboxModal({ open, onClose, onSave }) {
  /* state */
  const [viewState, setViewState] = useState(null); // {lng,lat,zoom}
  const [markerPos, setMarkerPos] = useState(null);

  /* refs */
  const mapRef = useRef(null);
  const geocoderWrapper = useRef(null);
  const geocoderRef = useRef(null);

  /* 1 — initial position */
  useEffect(() => {
    if (!open || viewState) return;
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => {
        const pos = { lng: coords.longitude, lat: coords.latitude, zoom: 14 };
        setViewState(pos);
        setMarkerPos({ lng: pos.lng, lat: pos.lat });
      },
      () => setViewState({ lng: 0, lat: 20, zoom: 2 }),
      { enableHighAccuracy: true, timeout: 10_000 }
    );
  }, [open, viewState]);

  /* 2 — add MapboxGeocoder once */
  useEffect(() => {
    if (!mapRef.current || !geocoderWrapper.current || geocoderRef.current)
      return;

    const geocoder = new MapboxGeocoder({
      accessToken: MAPBOX_TOKEN,
      mapboxgl,
      placeholder: "Search an address…",
      marker: false,
      proximity: viewState ? [viewState.lng, viewState.lat] : undefined,
    });
    geocoderRef.current = geocoder;

    /* append control to our wrapper */
    geocoderWrapper.current.appendChild(geocoder.onAdd(mapRef.current));
    /* full-width bar */
    geocoder.container.style.width = "100%";

    /* when user picks a suggestion */
    geocoder.on("result", (e) => {
      const pos = toLngLat(e.result.center);
      console.info("Autocomplete chosen coords:", pos);
      setViewState((v) => ({ ...v, ...pos, zoom: 16 }));
      setMarkerPos(pos);
    });
  }, [viewState]);

  /* 3 — click / drag */
  const handleMapClick = useCallback((evt) => {
    const { lngLat } = evt;
    if (!lngLat) return;
    const pos = { lng: lngLat.lng, lat: lngLat.lat };
    console.info("Clicked/dragged coords:", pos);
    setViewState((v) => ({ ...v, ...pos }));
    setMarkerPos(pos);
  }, []);

  const save = () => {
    if (markerPos) onSave(markerPos);
    onClose();
  };

  /* early exits */
  if (!open) return null;
  if (!viewState) {
    return (
      <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center">
        <p className="bg-white rounded-lg px-8 py-6 shadow">Loading map…</p>
      </div>
    );
  }

  /* ─────────────── UI ─────────────── */
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
          {/* centred, full-width geocoder bar */}
          <div ref={geocoderWrapper} className="w-full flex justify-center" />

          {/* map */}
          <Map
            {...viewState}
            ref={mapRef}
            mapboxAccessToken={MAPBOX_TOKEN}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            style={mapStyle}
            onMove={(e) => setViewState(e.viewState)}
            onClick={handleMapClick}
          >
            <NavigationControl position="bottom-right" />
            {markerPos && (
              <Marker
                longitude={markerPos.lng}
                latitude={markerPos.lat}
                draggable
                onDragEnd={handleMapClick}
              />
            )}
          </Map>

          {/* actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-1 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100"
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
