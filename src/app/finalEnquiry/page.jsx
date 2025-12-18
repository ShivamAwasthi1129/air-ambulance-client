"use client";
import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Banner } from "../components/Banner";
import PaymentModal from "../components/PaymentModal";
import BankingPartnersModal from "../components/BankingPartnerModal";
import SelectedFleetCard from "../components/SelectedFleetCard";
// Helper: format to US dollars, e.g. `$ 650,000`
function formatUSD(amount) {
  return `$ ${amount.toLocaleString("en-US")}`;
}
function buildRapidoUrls(seg) {
  /* helpers */
  const stripCode = (s) => s.replace(/\s*\(.*?\)\s*/, "").trim();
  const toRapidoParam = (p) =>
    typeof p === "string"
      ? encodeURIComponent(stripCode(p))
      : encodeURIComponent(JSON.stringify(p));

  const coordOnly = (loc) =>
    `${loc.lat.toFixed(2)},${loc.lng.toFixed(2)}`;

  // 11.93,79.81-(Some Address)
  const fmtPoint = (loc, addr) =>
    addr ? `${coordOnly(loc)}-(${addr})` : coordOnly(loc);

  /* shared query tail */
  const common =
    `departureDate=${seg.departureDate}T${seg.departureTime}:00Z` +
    `&travelerCount=${seg.passengers}`;

  /* assemble one {url,label} object */
  const make = ({ fromArg, toArg, label, heliOnly }) => {
    const fltParam = heliOnly
      ? "&flightType=Helicopter"
      : seg.flightTypes?.length
        ? `&flightType=${encodeURIComponent(seg.flightTypes.join(","))}`
        : "";

    return {
      url: `/api/rapido?from=${fromArg}&to=${toArg}&${common}${fltParam}`,
      label,
    };
  };

  const list = [];

  /* 1️⃣ Airport ➜ Airport */
  if (seg.from && seg.to) {
    list.push(
      make({
        fromArg: toRapidoParam(seg.from),
        toArg: toRapidoParam(seg.to),
        label: `${stripCode(seg.from)} ➜ ${stripCode(seg.to)}`,
        heliOnly: false,
      })
    );
  }

  /* 2️⃣ Coord ➜ Coord */
  if (seg.fromLoc && seg.toLoc) {
    list.push(
      make({
        fromArg: toRapidoParam(seg.fromLoc),
        toArg: toRapidoParam(seg.toLoc),
        label: `${fmtPoint(seg.fromLoc, seg.fromAddress)} ➜ ${fmtPoint(
          seg.toLoc,
          seg.toAddress
        )}`,
        heliOnly: true,
      })
    );
  }

  /* 3️⃣ Airport ➜ Coord */
  if (seg.from && seg.toLoc) {
    list.push(
      make({
        fromArg: toRapidoParam(seg.from),
        toArg: toRapidoParam(seg.toLoc),
        label: `${stripCode(seg.from)} ➜ ${fmtPoint(
          seg.toLoc,
          seg.toAddress
        )}`,
        heliOnly: true,
      })
    );
  }

  /* 4️⃣ Coord ➜ Airport */
  if (seg.fromLoc && seg.to) {
    list.push(
      make({
        fromArg: toRapidoParam(seg.fromLoc),
        toArg: toRapidoParam(seg.to),
        label: `${fmtPoint(seg.fromLoc, seg.fromAddress)} ➜ ${stripCode(seg.to)}`,
        heliOnly: true,
      })
    );
  }

  return list;
}
const FinalEnquiryPage = () => {
  const [searchData, setSearchData] = useState(null);
  const [fetchedSegmentsData, setFetchedSegmentsData] = useState([]);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isWhatsAppSending, setIsWhatsAppSending] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const storedData = sessionStorage.getItem("searchData");
    if (storedData) {
      const parsedSearchData = JSON.parse(storedData);
      // Iterate through each segment and update fields if fromLoc and toLoc are filled
      const updatedSegments = parsedSearchData.segments.map((segment) => {
        if (segment.fromLoc && segment.toLoc) {
          return {
            ...segment,
            from: "custom",
            fromCity: "custom",
            fromIATA: "custom",
            fromICAO: "custom",
            to: "custom",
            toCity: "custom",
            toIATA: "custom",
            toICAO: "custom",
          };
        }
        return segment;
      });
  
      // Update the searchData object with modified segments
      const updatedSearchData = {
        ...parsedSearchData,
        segments: updatedSegments,
      };
  
      // Save the updated searchData back to sessionStorage
      sessionStorage.setItem("searchData", JSON.stringify(updatedSearchData));
  
      // Update the state with the modified searchData
      setSearchData(updatedSearchData);
    }
  }, []);

  // 1) Read searchData from sessionStorage & fallback to loginData for user details
  useEffect(() => {
    const storedData = sessionStorage.getItem("searchData");
    if (storedData) {
      const parsedSearchData = JSON.parse(storedData);
      setSearchData(parsedSearchData);

      // Extract user info from searchData.userInfo
      const userInfo = parsedSearchData.userInfo || {};
      let foundName = userInfo.name || "";
      let foundPhone = userInfo.phone || "";
      let foundEmail = userInfo.email || "";

      // If name/phone is missing, try to get from loginData
      if (!foundName || !foundPhone || !foundEmail) {
        const storedLoginData = sessionStorage.getItem("loginData");
        if (storedLoginData) {
          const parsedLoginData = JSON.parse(storedLoginData);
          foundName = foundName || parsedLoginData.name || "";
          foundPhone = foundPhone || parsedLoginData.phone || "";
          foundEmail = foundEmail || parsedLoginData.email || "";
        }
      }

      setUserData({
        name: foundName,
        phone: foundPhone,
        email: foundEmail,
      });
    }
  }, []);

  // 2) Fetch flights for each segment using the Rapido API
  useEffect(() => {
    const fetchAllSegments = async () => {
      if (!searchData || !searchData.segments) return;
      const resultsArr = [];

      for (let i = 0; i < searchData.segments.length; i++) {
        const segment = searchData.segments[i];

        // Build Rapido URLs for this segment
        const urlObjs = buildRapidoUrls(segment);

        try {
          // Fetch all possible routes in parallel
          const responses = await Promise.all(
            urlObjs.map(obj =>
              fetch(obj.url)
                .then(res => res.ok ? res.json() : null)
                .catch(() => null)
            )
          );

          // Combine all fleets from different route options
          let allFleets = [];

          responses.forEach((res, idx) => {
            if (res?.finalFleet?.length) {
              const label = urlObjs[idx].label;
              res.finalFleet.forEach(fleet => {
                allFleets.push({
                  ...fleet,
                  _numericPrice: parseInt(fleet.totalPrice?.replace(/\\D/g, ""), 10) || 0,
                  _sourceLabel: label
                });
              });
            }
          });

          // Filter to match chosen registrationNo if specified
          if (segment.selectedFleet?.registrationNo) {
            allFleets = allFleets.filter(
              flight => flight?.fleetDetails?.registrationNo === segment.selectedFleet.registrationNo
            );
          }

          resultsArr.push(allFleets);
        } catch (error) {
          console.error("Error fetching flights for segment", i, error);
          resultsArr.push([]);
        }
      }

      setFetchedSegmentsData(resultsArr);
    };

    if (searchData) {
      fetchAllSegments();
    }
  }, [searchData]);

  if (!searchData) {
    return (
      <div className="p-4 text-center">
        No Search Data found, or still loading...
      </div>
    );
  }

  /**
   * Merge user info from loginData into searchData.userInfo if needed
   * before sending the final data to /api/ccavenue
   */
  const mergeUserInfoIfNeeded = (dataObj) => {
    const finalData = { ...dataObj };

    // If userInfo is missing or incomplete, fill from loginData
    if (
      !finalData.userInfo ||
      !finalData.userInfo.name ||
      !finalData.userInfo.email ||
      !finalData.userInfo.phone
    ) {
      const loginDataStr = sessionStorage.getItem("loginData");
      if (loginDataStr) {
        const loginData = JSON.parse(loginDataStr);

        finalData.userInfo = {
          // Keep anything we already have
          ...finalData.userInfo,
          // Fill from loginData if missing
          name: finalData.userInfo?.name || loginData.name,
          email: finalData.userInfo?.email || loginData.email,
          phone: finalData.userInfo?.phone || loginData.phone,
          // Include token if present
          token: loginData.token,
        };
      }
    }
    return finalData;
  };

  // Payment API call - now ensures userInfo is present
  const handlePayment = async (amount, currency, totalAmount) => {
    setLoading(true);
    try {
      // Merge user info from loginData if searchData is missing it
      const finalSearchData = mergeUserInfoIfNeeded(searchData);

      const response = await fetch("/api/ccavenue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...finalSearchData,
          amount,
          totalAmount,
          currency,
        }),
      });

      const { paymentUrl } = await response.json();
      window.location.href = paymentUrl;
    } catch (error) {
      console.log("Error", error);
      alert("Payment initiation failed!");
    }
    setLoading(false);
  };

  // Called by PaymentModal onConfirm
  const handlePaymentConfirm = (amount, currency, totalAmount) => {
    setIsPaymentModalOpen(false);
    handlePayment(amount, currency, totalAmount);
  };

  // Compute total flying time
  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [hrs, mins] = timeStr
      .split("h ")
      .map((t) => parseInt(t.replace("m", "")) || 0);
    return hrs * 60 + mins;
  };

  const totalFlyingTimeMinutes = searchData.segments.reduce((total, segment) => {
    return (
      total +
      (segment.selectedFleet?.time ? parseTimeToMinutes(segment.selectedFleet.time) : 0)
    );
  }, 0);

  const totalFlyingHours = `${Math.floor(totalFlyingTimeMinutes / 60)} Hrs ${totalFlyingTimeMinutes % 60
    } Min`;

  // Summation for cost details
  const allSelectedFlights = fetchedSegmentsData.flat();
  // Parse flight.totalPrice => numeric
  const estimatedCost = searchData.segments.reduce((total, segment) => { if (segment.selectedFleet && segment.selectedFleet.price) { const price = parseInt(segment.selectedFleet.price.replace(/\D+/g, ""), 10) || 0; return total + price; } return total; }, 0);

  // WhatsApp Enquiry
  const sendWhatsAppMessage = async () => {
    const phoneNumber = userData?.phone;
    setIsWhatsAppSending(true);

    // Show an "info" toast quickly
    const toastId = toast.info("Sending your enquiry...", {
      position: "top-center",
      autoClose: false,
      closeOnClick: true,
      draggable: false,
    });

    try {
      // Merge any missing user info from loginData
      const finalSearchData = mergeUserInfoIfNeeded(searchData);

      const response = await fetch("/api/booking-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalSearchData),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      toast.dismiss(toastId);
      toast.success(`Enquiry sent successfully to ${phoneNumber}`, {
        position: "top-center",
        autoClose: 5000,
      });
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(`Something went wrong: ${err.message}`, {
        position: "top-center",
      });
    } finally {
      setIsWhatsAppSending(false);
    }
  };

  // Email enquiry
  const sendEmailMessage = async () => {
    setIsEmailSending(true);

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          segments: searchData.segments,
          user: userData, // includes name, phone, email
          tripType: searchData.tripType,
          estimatedCost,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      toast.success(`Mail sent to: ${userData.email}`, {
        position: "top-center",
        autoClose: 5000,
      });
    } catch (e) {
      toast.error(`Something went wrong: ${e.message}`, {
        position: "top-center",
      });
      console.error("Error sending enquiry:", e);
    } finally {
      setIsEmailSending(false);
    }
  };

  // Extract details from first/last segments
  const firstSegment = searchData.segments[0];
  const lastSegment = searchData.segments[searchData.segments.length - 1];

  const fromOfFirstSegment = firstSegment.from;
  const toOfLastSegment = searchData.segments[searchData.segments.length - 1]?.selectedFleet?.label.split(" ➜ ")[1] || "N/A";
  const departureTime = firstSegment.departureTime;
  const passengerCount = firstSegment.passengers;
  const departureDate = firstSegment.departureDate;
  const totalPassengers = searchData.segments.reduce((total, segment) => {
    return total + (parseInt(segment.passengers, 10) || 0);
  }, 0);

  // PDF Download Function (Proforma Invoice)
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica");

    // === Title Section ===
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Charter Flight Aviations", 14, 20);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(
      "S-3 LEVEL, BLOCK E, INTERNATIONAL TRADE TOWER, NEHRU PLACE, South Delhi, Delhi, 110019",
      14,
      28
    );
    doc.text(
      "Phone: +91-11-40845858 | Email: info@charterflightaviations.in",
      14,
      36
    );

    doc.text("Dear Sir/Madam,", 14, 44);
    doc.text(
      "We are Pleased to offer to you the Aircraft. The commercials for the same will be as follows:",
      14,
      49
    );

    // === Flight Details ===
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Flight Details", 14, 55);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.autoTable({
      startY: 60,
      head: [["Date", "From", "To", "ETD", "Approx. Fly Time", "Pax", "Fleet Type"]],
      body: searchData.segments.map((segment) => [
        segment.departureDate,
        segment.from,
        segment.to,
        segment.departureTime,
        segment.selectedFleet?.time || "N/A",
        segment.passengers,
        segment.selectedFleet?.model || "Unknown",
      ]),
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Total Flying Hours: ${totalFlyingHours}`,
      14,
      doc.lastAutoTable.finalY + 10
    );

    // === Cost Breakdown ===
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Cost Breakdown", 14, doc.lastAutoTable.finalY + 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 25,
      head: [["Description", "Amount (₹)"]],
      body: [
        ["Total Flying Cost", estimatedCost.toLocaleString()],
        ["All Inclusive Charter Package", estimatedCost.toLocaleString()],
      ],
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Note text
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    const notesText =
      "Note: Please Note :1. All quotations/options provided above are subject to all necessary permission and aircraft availability at the time of charter confirmation & as per the COVID protocol 2. Any miscellaneous charges including watch hour extensions (if required) will be charged on actuals 3. Timings to be confirmed on the basis of NOTAM and watch hours at respective Airports.4. If at Day/Night Halt Parking Is Unavailable Due to any reason, The Aircraft/Helicopter Shall Be Positioned And Parked To Nearest Airport and all associated charges will be charged Extra";
    const splitNotes = doc.splitTextToSize(notesText, 180);
    doc.text(splitNotes, 14, doc.lastAutoTable.finalY + 15);

    // === Terms & Conditions Page ===
    doc.addPage();
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Terms & Conditions", 14, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const termsText = `1. This is only a Quotation. The Charter will be confirmed only after receipt of 100% payment in advance.
2. Additional sectors required after start of the flight itinerary will be on the sole discretion of Charter Flight Aviations Pvt. Ltd.
3. The flight duty time and flight time will be governed by DGCA – CAR – 7 – J III & IV dated 23.03.2021 effective from 30.09.2022.
4. Minimum booking value for a charter would be 2 Hrs of flying per booking per day.
5. The Flying Hrs. mentioned in the quotation is only indicative since...`;

    const termsLines = doc.splitTextToSize(termsText, 180);
    doc.autoTable({
      startY: 30,
      body: termsLines.map((line) => [line]),
      theme: "plain",
      styles: {
        fontSize: 9,
        cellPadding: 2,
        lineColor: [255, 255, 255],
      },
      columnStyles: {
        0: { cellWidth: 180 },
      },
      margin: { left: 14 },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.text("For Charter Flight Aviations Pvt. Ltd.", 14, finalY);
    doc.text("For Client", 14, finalY + 10);

    // Save final PDF
    doc.save("Proforma_Invoice.pdf");
  };
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-full bg-cover"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-photo/airplane-runway-airport-sunset-travel-concept_587448-8154.jpg?w=1380')",
        }}
      >
        {/* <NavBar /> */}
      </div>
      <Banner />
      {/* trips and price calculation section */}
      <div className="flex flex-col md:flex-row justify-center gap-2 p-4">
        {/* LEFT COLUMN: Flights */}
        <div className="xl:w-[70rem] md: w-[90rem] flex flex-col space-y-4 ">
          <div className="flex flex-col md:flex-row justify-center gap-2 p-4">
            {searchData.segments.map((segment, segmentIndex) => {
              const selectedFleet = segment.selectedFleet;
              if (!selectedFleet) return null;
              return (
                <div
                  key={segmentIndex}
                >
                  <SelectedFleetCard
                    tripNumber={`Trip ${segmentIndex + 1}`}
                    label={selectedFleet.label}
                  />
                </div>
              );
            })}
          </div>
        </div>
        {/* RIGHT COLUMN: JetSteals + Cost Details + Buttons */}
        <div className="xl: w-[28%] hidden md:block">
          <div className="bg-white border-2 border-dashed border-gray-400 rounded-lg p-4 shadow-sm">
            {/* Dynamic trip info */}
            <h2 className="text-xl font-semibold mb-1">
              {fromOfFirstSegment} to {toOfLastSegment}
            </h2>
            <p className="text-sm text-gray-600">
              Departure Time: {departureTime || "—"}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Total <span className="text-lg">{totalPassengers}</span> Passenger{totalPassengers > 1 ? "s" : ""} | {departureDate}
            </p>

            {/* Cost breakdown */}
            <div className="flex justify-between mb-2">
              <span>Flying Cost</span>
              <span>{formatUSD(estimatedCost)}</span>
            </div>
            <div className="flex justify-between items-center font-bold text-lg mb-6 bg-yellow-100 px-3 py-2 rounded-md text-yellow-800 shadow-inner">
              <span>Approx cost ~</span>
              <span>{formatUSD(estimatedCost)}</span>
            </div>
            <div className="text-gray-600 text-sm border border-gray-100 rounded p-3 mb-4 bg-gray-50">
              JetSteals grants you the opportunity to enjoy the luxury
              and convenience of flying private at commercial prices.
            </div>

            {/* Buttons */}
            <div className="flex justify-between space-2 mb-4">
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors text-sm font-semibold"
              >
                {loading ? "Processing..." : "BOOK Now"}
                <div className="text-xs font-normal">With Partial Payment</div>
              </button>

              {/* WHATSAPP ENQUIRY Button */}
              <button
                onClick={sendWhatsAppMessage}
                disabled={isWhatsAppSending}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded transition-colors text-sm font-semibold"
              >
                {isWhatsAppSending ? "Sending..." : "SEND Enquiry"}
                <div className="text-xs font-normal">via Whatsapp</div>
              </button>

              {/* EMAIL ENQUIRY Button */}
              <button
                onClick={sendEmailMessage}
                disabled={isEmailSending}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-white p-2 rounded transition-colors text-sm font-semibold"
              >
                {isEmailSending ? "Sending..." : "SEND Enquiry"}
                <div className="text-xs font-normal">via Email</div>
              </button>
            </div>
            <div className="flex justify-between items-center space-x-4">
              <button
                onClick={() => setOpen(true)}
                className="rounded-lg bg-sky-600 px-6 py-3 font-semibold text-white"
              >
                Offline Payment
              </button>
              <button
                className="border border-orange-400 text-orange-500 px-4 py-2 rounded-md hover:bg-orange-100 transition-colors text-center"
                onClick={generatePDF}
              >
                Download Proforma Invoice
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PaymentModal with currency dropdown */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirm={handlePaymentConfirm}
        loading={loading}
        estimatedCost={estimatedCost}
      />
      <BankingPartnersModal open={open} height="90vh" onClose={() => setOpen(false)} />
      {/* <Bottom /> */}
      {/* React-Toastify container */}
      <ToastContainer
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        draggable={false}
        style={{
          position: "fixed",
          top: "12%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 100,
        }}
      />
    </div>
  );
};

export default FinalEnquiryPage;