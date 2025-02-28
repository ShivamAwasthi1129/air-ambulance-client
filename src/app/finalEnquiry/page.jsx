"use client"; // Next.js App Router

import React, { useEffect, useState } from "react";
import { IoIosAirplane } from "react-icons/io";
import { BsExclamationTriangle } from "react-icons/bs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast, ToastContainer } from "react-toastify";  // <-- react-toastify
import "react-toastify/dist/ReactToastify.css";          // <-- react-toastify CSS
import FlightCard from "../components/FleetCard";
import { Banner } from "../components/SearchBanner";
import { Bottom } from "../components/Bottom";
<<<<<<< HEAD
import { useRouter } from "next/navigation";
import { decrypt } from "@/lib/ccavenueEncryption";
=======
import PaymentModal from "../components/PaymentModal";
>>>>>>> da577d0fa0fa14f0e1475e1a55c5be405b65656a

// Remove parentheses from airport name
function cleanAirportName(str) {
  return str.replace(/\s*\(.*?\)\s*/, "").trim();
}

// Helper: format to US dollars, e.g. `$ 650,000`
function formatUSD(amount) {
  return `$ ${amount.toLocaleString("en-US")}`;
}

const FinalEnquiryPage = () => {
  const [searchData, setSearchData] = useState(null);
  const [fetchedSegmentsData, setFetchedSegmentsData] = useState([]);
  const [userData, setUserData] = useState({});
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Track WhatsApp "Sending..." state
  const [isWhatsAppSending, setIsWhatsAppSending] = useState(false);
  // Track Email "Sending..." state
  const [isEmailSending, setIsEmailSending] = useState(false);

  const router = useRouter();

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
      if (!foundName || !foundPhone) {
        const storedLoginData = sessionStorage.getItem("loginData");
        if (storedLoginData) {
          const parsedLoginData = JSON.parse(storedLoginData);
          foundName = foundName || parsedLoginData.name || "";
          foundPhone = foundPhone || parsedLoginData.phone || "";
          foundEmail = foundEmail || parsedLoginData.email || "";
        }
      }

      // Finally set userData in state
      setUserData({
        name: foundName,
        phone: foundPhone,
        email: foundEmail,
      });
    }

    // Generate a fresh orderId
    setOrderId(`ORD-${Date.now()}`);
  }, []);

  // 2) Fetch flights for each segment, filter by selected registrationNo
  useEffect(() => {
    const fetchAllSegments = async () => {
      if (!searchData || !searchData.segments) return;

      const resultsArr = [];
      for (let i = 0; i < searchData.segments.length; i++) {
        const segment = searchData.segments[i];
        const cleanedFrom = cleanAirportName(segment.from);
        const cleanedTo = cleanAirportName(segment.to);

        const url = `/api/search-flights?from=${encodeURIComponent(
          cleanedFrom
        )}&to=${encodeURIComponent(cleanedTo)}&departureDate=${
          `${segment.departureDate}T${segment.departureTime}:00Z`
        }&travelerCount=${segment.passengers}`;

        try {
          const res = await fetch(url);
          const data = await res.json();
          const finalFleetArray = data?.finalFleet || [];

          // Filter to match chosen registrationNo
          let filtered = [];
          if (segment.selectedFleet?.registrationNo) {
            filtered = finalFleetArray.filter(
              (flight) =>
                flight?.fleetDetails?.registrationNo ===
                segment.selectedFleet.registrationNo
            );
          }
          resultsArr.push(filtered);
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

  const handlePayment = async (amount) => {
    setLoading(true);
    try {
      const response = await fetch("/api/ccavenue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          amount, // Use the amount from the modal
        }),
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        setLoading(false);
        return;
      }

      // Create and submit a form dynamically
      const form = document.createElement("form");
      form.method = "post";
      form.action = process.env.NEXT_PUBLIC_CCAVENUE_REDIRECT_URL;
      form.target = "_self";

      // Hidden input fields
      const encInput = document.createElement("input");
      encInput.type = "hidden";
      encInput.name = "encRequest";
      encInput.value = data.encRequest;
      form.appendChild(encInput);

      const accessInput = document.createElement("input");
      accessInput.type = "hidden";
      accessInput.name = "access_code";
      accessInput.value = data.accessCode;
      form.appendChild(accessInput);

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.log("eror", error);
      alert("Payment initiation failed!");
    }
    setLoading(false);
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

  const totalFlyingHours = `${Math.floor(totalFlyingTimeMinutes / 60)} Hrs ${
    totalFlyingTimeMinutes % 60
  } Min`;

  // Summation for cost details
  const allSelectedFlights = fetchedSegmentsData.flat();
  // Parse flight.totalPrice, e.g. "$ 650,000"
  const totalFlightCost = allSelectedFlights.reduce((acc, flight) => {
    if (!flight.totalPrice) return acc;
    const numericPrice = parseInt(flight.totalPrice.replace(/\D+/g, ""), 10) || 0;
    return acc + numericPrice;
  }, 0);

  // Example: airport handling = 700 * number of segments
  const airportHandling = 700 * searchData.segments.length;
  const subTotal = totalFlightCost + airportHandling;
  const gstAmount = Math.round(subTotal * 0.18); // 18% tax
  const estimatedCost = subTotal + gstAmount;

  // Updated: POST to /api/booking-request, using react-toastify
  const sendWhatsAppMessage = async () => {
    const phoneNumber = "+919958241284"; // The number to which we say we sent
    setIsWhatsAppSending(true);

    // 1. Show an "info" toast with no autoClose
    const toastId = toast.info("Sending your enquiry...", {
      position: "top-center",
      autoClose: true, // Keep it open until we dismiss or update
      closeOnClick: true,
      draggable: false,
    });

    try {
      // Check if 'loginData' session exists in sessionStorage
      const loginDataStr = sessionStorage.getItem("loginData");
      if (loginDataStr) {
        // Parse the stored session data and update searchData.userInfo with login details
        const loginData = JSON.parse(loginDataStr);
        searchData.userInfo = {
          name: loginData.name,
          email: loginData.email,
          phone: loginData.phone,
        };
      }

      // Log the payload before sending
      console.log("Sending payload:", searchData);

      // 2. POST request to /api/booking-request with searchData payload
      const response = await fetch("/api/booking-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchData),
      });

      if (!response.ok) {
        // Force an error for the catch block below
        throw new Error(`Server error: ${response.statusText}`);
      }

      // 3. Dismiss the loading toast
      toast.dismiss(toastId);

      // 4. Show success toast
      toast.success(`Enquiry sent successfully to ${phoneNumber}`, {
        position: "top-center",
        autoClose: 5000,
      });
    } catch (err) {
      // 5. Dismiss the loading toast
      toast.dismiss(toastId);

      // 6. Show error toast
      toast.error(`Something went wrong: ${err.message}`, {
        position: "top-center",
      });
    } finally {
      setIsWhatsAppSending(false);
    }
  };

  // Email logic
  const sendEmailMessage = async () => {
    setIsEmailSending(true); // Show "Sending..." on the button

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
          airportHandling,
          subTotal,
          gstAmount,
          estimatedCost,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      // If everything goes well, show success toast
      toast.success(`Mail sent to: ${userData.email}`, {
        position: "top-center",
      });
    } catch (e) {
      toast.error("Something went wrong", { position: "top-center" });
      console.error("Error sending enquiry:", e);
    } finally {
      setIsEmailSending(false); // Revert back to normal text
    }
  };

  // Grab dynamic details from the first and last segments
  const firstSegment = searchData.segments[0];
  const lastSegment = searchData.segments[searchData.segments.length - 1];

  const fromOfFirstSegment = firstSegment.from;
  const toOfLastSegment = lastSegment.to;
  const departureTime = firstSegment.departureTime;
  const passengerCount = firstSegment.passengers;
  const departureDate = firstSegment.departureDate;

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
    doc.text("Phone: +91-11-40845858 | Email: info@charterflightaviations.in", 14, 36);

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
        ["Total Flying Cost", totalFlightCost.toLocaleString()],
        ["Total Handling Cost", airportHandling.toLocaleString()],
        ["Subtotal", subTotal.toLocaleString()],
        ["GST @ 18%", gstAmount.toLocaleString()],
        [
          "All Inclusive Charter Package (with GST)",
          estimatedCost.toLocaleString(),
        ],
      ],
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

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

  const handlePaymentButtonClick = () => {
    setIsPaymentModalOpen(true); // Open the modal when the payment button is clicked
  };

  const handlePaymentConfirm = (amount) => {
    setIsPaymentModalOpen(false); // Close the modal
    handlePayment(amount); // Proceed with the payment
  };

  return (
    <div className="flex flex-col items-center">
      <Banner />

      <div className="flex flex-col md:flex-row justify-center gap-6 p-4">
        {/* LEFT COLUMN: Flights */}
        <div className="w-[60%] md:w-[65rem] flex flex-col space-y-4">
          {searchData.segments.map((segment, segmentIndex) => {
            const flightsForSegment = fetchedSegmentsData[segmentIndex] || [];
            return (
              <div
                key={segmentIndex}
                className="w-full bg-white flex flex-col items-start px-4 border border-blue-100 rounded-xl"
              >
                <h3 className="text-lg font-bold flex items-center mt-4">
                  Trip {segmentIndex + 1}: {segment.from}
                  <span className="mx-2">
                    <IoIosAirplane size={24} />
                  </span>
                  {segment.to}
                </h3>

                {flightsForSegment.length === 0 ? (
                  <div className="flex flex-col items-center justify-center mt-6">
                    <BsExclamationTriangle className="text-5xl text-gray-400 mb-2" />
                    <p className="text-lg text-gray-600">No fleets available</p>
                  </div>
                ) : (
                  flightsForSegment.map((flight) => (
                    <div className="w-full my-1" key={flight.serialNumber}>
                      <FlightCard filteredData={[flight]} readOnly />
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: JetSteals + Cost Details + Buttons */}
        <div className="w-[28%] hidden md:block">
          <div className="bg-white border-2 border-dashed border-gray-400 rounded-lg p-4 shadow-sm">
            {/* Dynamic trip info */}
            <h2 className="text-xl font-semibold mb-1">
              {fromOfFirstSegment} to {toOfLastSegment}
            </h2>
            <p className="text-sm text-gray-600">
              Departure Time: {departureTime || "—"}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              {passengerCount} Passenger{passengerCount > 1 ? "s" : ""} |{" "}
              {departureDate}
            </p>

            {/* Cost breakdown */}
            <div className="flex justify-between mb-2">
              <span>Flying Cost</span>
              <span>{formatUSD(totalFlightCost)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Airport Handling Charges</span>
              <span>{formatUSD(airportHandling)}</span>
            </div>
            <div className="flex justify-between font-medium mb-2">
              <span>Sub total</span>
              <span>{formatUSD(subTotal)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>GST (18%)</span>
              <span>{formatUSD(gstAmount)}</span>
            </div>
            <div className="flex justify-between items-center font-bold text-lg mb-6 bg-yellow-100 px-3 py-2 rounded-md text-yellow-800 shadow-inner">
              <span>Estimated Cost</span>
              <span>{formatUSD(estimatedCost)}</span>
            </div>

            <div className="text-gray-600 text-sm border border-gray-100 rounded p-3 mb-4 bg-gray-50">
              JetSteals grants you the opportunity to enjoy the luxury
              and convenience of flying private at commercial prices.
            </div>

            {/* Buttons */}
            <div className="flex justify-between space-2 mb-4">
              {/* <button onClick={handlePayment} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors text-sm font-semibold">
                {loading ? "Processing..." : "BOOK Now"}
                <div className="text-xs font-normal">With Partial Payment</div>
              </button> */}
              <button
                onClick={handlePaymentButtonClick} // Open the modal instead of directly handling payment
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors text-sm font-semibold"
              >
                {loading ? "Processing..." : "BOOK Now"}
                <div className="text-xs font-normal">With Partial Payment</div>
              </button>

              {/* WHATSAPP ENQUIRY Button */}
              <button
                onClick={sendWhatsAppMessage}
                disabled={isWhatsAppSending}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded transition-colors text-sm font-semibold"
              >
                {isWhatsAppSending ? "Sending..." : "SEND Enquiry"}
                <div className="text-xs font-normal">via Whatsapp</div>
              </button>

              {/* EMAIL ENQUIRY Button */}
              <button
                onClick={sendEmailMessage}
                disabled={isEmailSending}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-white px-3 py-2 rounded transition-colors text-sm font-semibold"
              >
                {isEmailSending ? "Sending..." : "SEND Enquiry"}
                <div className="text-xs font-normal">via Email</div>
              </button>
            </div>

            {/* Download PDF Button */}
            <button
              className="border border-orange-400 text-orange-500 px-4 py-2 rounded-md hover:bg-orange-100 transition-colors w-full text-center"
              onClick={generatePDF}
            >
              Download Proforma Invoice
            </button>
          </div>
        </div>
      </div>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirm={handlePaymentConfirm}
        loading={loading}
      />

      <Bottom />

      <ToastContainer
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
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
