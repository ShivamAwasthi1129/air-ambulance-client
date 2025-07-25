"use client";
import React, { useEffect, useState } from "react";
import NavBar from "../components/Navbar";
import {
  AiOutlineCheckCircle,
  AiOutlineEdit,
  AiOutlineClose,
  AiOutlineSend,
  AiOutlineUser,
  AiOutlinePlus,
  AiOutlineDelete
} from "react-icons/ai";

const TITLES = ["Mr.", "Miss", "Ms.", "Mrs.", "Mx.", "Master", "Baby", "Child", "Senior Citizen"];
const DESIGNATIONS = ["Dr.", "Prof.", "Minister", "MLA", "President", "VIP", "None"];
const DOCUMENT_TYPES = ["Passport", "Driving License", "Resident Card", "Other"];
const GENDERS = ["Male", "Female", "Other"];
const NATIONALITIES = ["Indian", "American", "British", "Canadian", "Australian", "German", "French", "Other"];
const MEAL_PREFERENCES = ["Veg", "Non-Veg", "Vegan", "Hindu", "Koshe", "Muslim", "Jain", "Diabetic", "None"];
const SEAT_PREFERENCES = ["Window", "Aisle", "Middle", "Bed", "Sofa", "Recliner", "No Preference"];

const TravelHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [passengerData, setPassengerData] = useState({});
  const [loading, setLoading] = useState(true);
  const [modificationRequests, setModificationRequests] = useState({});
  const [emailLoading, setEmailLoading] = useState({});
  const [showPassengerForm, setShowPassengerForm] = useState({});
  const [passengerFormData, setPassengerFormData] = useState({});
  const [passengerLoading, setPassengerLoading] = useState({});
  const [showPassengerDropdown, setShowPassengerDropdown] = useState({});

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("loginData"));
    if (user && user.email) {
      // Fetch bookings
      fetch(`/api/booking?email=${user.email}`)
        .then((response) => response.json())
        .then((data) => {
          setBookings(data);
          setLoading(false);
          // Fetch passenger data for each booking
          fetchPassengerData(user.email);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        setShowPassengerDropdown({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchPassengerData = async (email) => {
    try {
      const response = await fetch(`https://ow91reoh80.execute-api.ap-south-1.amazonaws.com/air/passenger?user_email=${email}`);
      const data = await response.json();

      // Group passenger data by booking_id
      const groupedData = {};
      data.forEach(item => {
        groupedData[item.booking_id] = item;
      });
      setPassengerData(groupedData);
    } catch (error) {
      console.error("Error fetching passenger data:", error);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString();
  };
  const calculateActualAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const now = new Date();
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    return `${years} years, ${months} months, ${days} days`;
  };

  const initializePassengerForm = (booking) => {
    const user = JSON.parse(sessionStorage.getItem("loginData"));
    const existingData = passengerData[booking._id];

    if (existingData) {
      setPassengerFormData(prev => ({
        ...prev,
        [booking._id]: {
          user_email: user.email,
          booking_for: existingData.booking_for || "self",
          journey_legs: existingData.journey_legs || [],
          notes: existingData.notes || ""
        }
      }));
    } else {
      // Initialize with booking segments
      const journeyLegs = booking.segments.map(segment => ({
        from: segment.from === "custom" ? segment.fromAddress : segment.fromCity,
        to: segment.to === "custom" ? segment.toAddress : segment.toCity,
        departure_datetime: segment.departureDate ? new Date(segment.departureDate).toISOString() : null,
        arrival_datetime: null, // You might need to calculate this
        passengers: Array.from({ length: segment.passengers }, () => ({
          title: "",
          full_name: "",
          gender: "",
          date_of_birth: "",
          actual_age: "",
          visa_issued_by: "",
          visa_waiver_vvip: "",
          diplomatic: "",
          nationality: "",
          contact_number: "",
          email: "",
          document_type: "",
          document_number: "",
          document_expiry: "",
          visa_required: false,
          visa_number: "",
          visa_expiry: null,
          special_assistance: "None",
          meal_preference: "",
          seat_preference: "",
          is_lead_passenger: false
        })),
        pets: []
      }));

      setPassengerFormData(prev => ({
        ...prev,
        [booking._id]: {
          user_email: user.email,
          booking_for: "self",
          journey_legs: journeyLegs,
          notes: ""
        }
      }));
    }
  };

  const togglePassengerForm = (booking) => {
    const bookingId = booking._id;
    setShowPassengerForm(prev => ({
      ...prev,
      [bookingId]: !prev[bookingId]
    }));

    if (!showPassengerForm[bookingId]) {
      initializePassengerForm(booking);
    }
  };

  const updatePassengerField = (bookingId, legIndex, passengerIndex, field, value) => {
    setPassengerFormData(prev => ({
      ...prev,
      [bookingId]: {
        ...prev[bookingId],
        journey_legs: prev[bookingId].journey_legs.map((leg, lIndex) =>
          lIndex === legIndex
            ? {
              ...leg,
              passengers: leg.passengers.map((passenger, pIndex) =>
                pIndex === passengerIndex
                  ? {
                    ...passenger,
                    [field]: value,
                    ...(field === "date_of_birth" && {
                      actual_age: calculateActualAge(value)
                    })
                  }
                  : passenger
              )
            }
            : leg
        )
      }
    }));
  };

  const addPet = (bookingId, legIndex) => {
    setPassengerFormData(prev => ({
      ...prev,
      [bookingId]: {
        ...prev[bookingId],
        journey_legs: prev[bookingId].journey_legs.map((leg, lIndex) =>
          lIndex === legIndex
            ? {
              ...leg,
              pets: [...leg.pets, {
                pet_name: "",
                species: "",
                breed: "",
                age: 0,
                weight_kg: 0,
                microchip_number: "",
                vaccination_docs: [],
                is_service_animal: false,
                travel_crate_dimensions_cm: { length: 0, width: 0, height: 0 },
                permit_required: false,
                import_permit_number: ""
              }]
            }
            : leg
        )
      }
    }));
  };

  const updatePetField = (bookingId, legIndex, petIndex, field, value) => {
    setPassengerFormData(prev => ({
      ...prev,
      [bookingId]: {
        ...prev[bookingId],
        journey_legs: prev[bookingId].journey_legs.map((leg, lIndex) =>
          lIndex === legIndex
            ? {
              ...leg,
              pets: leg.pets.map((pet, pIndex) =>
                pIndex === petIndex ? { ...pet, [field]: value } : pet
              )
            }
            : leg
        )
      }
    }));
  };
  const getFilledPassengers = (formData) => {
    const filledPassengers = [];
    formData.journey_legs.forEach((leg, legIndex) => {
      leg.passengers.forEach((passenger, passengerIndex) => {
        if (passenger.full_name && passenger.full_name.trim()) {
          filledPassengers.push({
            ...passenger,
            legIndex,
            passengerIndex,
            displayName: `${passenger.full_name} (Age: ${passenger.date_of_birth ?
              new Date().getFullYear() - new Date(passenger.date_of_birth).getFullYear() : 'N/A'})`
          });
        }
      });
    });

    return filledPassengers;
    
  };
  const copyPassengerData = (bookingId, targetLegIndex, targetPassengerIndex, sourcePassenger) => {
  const fieldsToUpdate = [
  'title', 'full_name', 'gender', 'date_of_birth', 'actual_age', 'nationality', 'contact_number',
  'email', 'document_type', 'document_number', 'document_expiry', 'visa_issued_by', 'visa_waiver_vvip', 'diplomatic', 'visa_number', 'visa_expiry', 'meal_preference', 'seat_preference',
  'special_assistance'
];

    fieldsToUpdate.forEach(field => {
      updatePassengerField(bookingId, targetLegIndex, targetPassengerIndex, field, sourcePassenger[field]);
    });

    // Hide dropdown after selection
    setShowPassengerDropdown(prev => ({
      ...prev,
      [`${bookingId}-${targetLegIndex}-${targetPassengerIndex}`]: false
    }));
  };

  const removePet = (bookingId, legIndex, petIndex) => {
    setPassengerFormData(prev => ({
      ...prev,
      [bookingId]: {
        ...prev[bookingId],
        journey_legs: prev[bookingId].journey_legs.map((leg, lIndex) =>
          lIndex === legIndex
            ? {
              ...leg,
              pets: leg.pets.filter((_, pIndex) => pIndex !== petIndex)
            }
            : leg
        )
      }
    }));
  };

  const savePassengerData = async (bookingId) => {
    setPassengerLoading(prev => ({ ...prev, [bookingId]: true }));

    try {
      const formData = passengerFormData[bookingId];
      const existingData = passengerData[bookingId];

      let response;
      if (existingData) {
        // Update existing data
        response = await fetch(`https://ow91reoh80.execute-api.ap-south-1.amazonaws.com/air/passenger/${existingData._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_email: formData.user_email,
            booking_for: formData.booking_for,
            journey_legs: formData.journey_legs,
            notes: formData.notes
          })
        });
      } else {
        // Create new data
        response = await fetch("https://ow91reoh80.execute-api.ap-south-1.amazonaws.com/air/passenger", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            booking_id: bookingId
          })
        });
      }

      if (response.ok) {
        alert("Passenger information saved successfully!");
        setShowPassengerForm(prev => ({ ...prev, [bookingId]: false }));
        // Refresh passenger data
        const user = JSON.parse(sessionStorage.getItem("loginData"));
        fetchPassengerData(user.email);
      } else {
        alert("Failed to save passenger information.");
      }
    } catch (error) {
      console.error("Error saving passenger data:", error);
      alert("Failed to save passenger information.");
    } finally {
      setPassengerLoading(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  const toggleModificationRequest = (bookingId) => {
    setModificationRequests(prev => ({
      ...prev,
      [bookingId]: {
        ...prev[bookingId],
        isOpen: !prev[bookingId]?.isOpen,
        message: prev[bookingId]?.message || ""
      }
    }));
  };

  const updateModificationMessage = (bookingId, message) => {
    setModificationRequests(prev => ({
      ...prev,
      [bookingId]: {
        ...prev[bookingId],
        message
      }
    }));
  };

  const sendModificationRequest = async (booking) => {
    const user = JSON.parse(sessionStorage.getItem("loginData"));
    const message = modificationRequests[booking._id]?.message;

    if (!message || !message.trim()) {
      alert("Please enter a message for your modification request.");
      return;
    }

    setEmailLoading(prev => ({ ...prev, [booking._id]: true }));

    try {
      const tripDetails = booking.segments.map((segment, index) => {
        const fromLocation = segment.from === "custom"
          ? segment.fromAddress
          : `${segment.fromCity} (${segment.fromIATA})`;
        const toLocation = segment.to === "custom"
          ? segment.toAddress
          : `${segment.toCity} (${segment.toIATA})`;

        return `Trip ${index + 1}: ${fromLocation} → ${toLocation} on ${segment.departureDate ? new Date(segment.departureDate).toLocaleDateString() : 'N/A'}`;
      }).join('\n');

      const emailBody = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2563eb;">Booking Modification Request</h2>
          
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e40af;">Booking Details:</h3>
            <p><strong>Booking ID:</strong> ${booking._id}</p>
            <p><strong>Customer Name:</strong> ${booking.user_info?.name || user?.name || 'N/A'}</p>
            <p><strong>Customer Email:</strong> ${booking.user_info?.email || user?.email || 'N/A'}</p>
            <p><strong>Booking Type:</strong> ${booking.trip_type?.toUpperCase()}</p>
            <p><strong>Amount Paid:</strong> ${booking.amount_paid} ${booking.currency}</p>
            <p><strong>Status:</strong> ${booking.status}</p>
          </div>

          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e40af;">Trip Information:</h3>
            <pre style="white-space: pre-line; font-family: Arial, sans-serif;">${tripDetails}</pre>
          </div>

          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #d97706;">Customer's Modification Request:</h3>
            <p style="background-color: white; padding: 10px; border-radius: 4px; border-left: 4px solid #d97706;">${message}</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              This email was sent automatically from the travel booking system.<br>
              Please respond to the customer at their registered email address.
            </p>
          </div>
        </div>
      `;

      const payload = {
        to: "shivam@hexerve.com",
        subject: `Booking Modification Request - ${booking._id}`,
        html: emailBody
      };

      await fetch("https://ow91reoh80.execute-api.ap-south-1.amazonaws.com/air/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      alert("Modification request sent successfully! We'll get back to you soon.");
      setModificationRequests(prev => ({
        ...prev,
        [booking._id]: { isOpen: false, message: "" }
      }));
    } catch (error) {
      console.error("Error sending modification request:", error);
    } finally {
      setEmailLoading(prev => ({ ...prev, [booking._id]: false }));
    }
  };

  const renderPassengerForm = (booking) => {
    const bookingId = booking._id;
    const formData = passengerFormData[bookingId];

    if (!formData) return null;

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-blue-800">
            Passenger & Pet Information
          </h3>
          <button
            onClick={() => togglePassengerForm(booking)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <AiOutlineClose size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {formData.journey_legs.map((leg, legIndex) => (
            <div key={legIndex} className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-gray-800 mb-3">
                Trip {legIndex + 1}: {leg.from} → {leg.to}
              </h4>

              <div className="space-y-4">
                <h5 className="font-medium text-gray-700">Passengers:</h5>
                {leg.passengers.map((passenger, passengerIndex) => (
                  <div key={passengerIndex} className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h6 className="font-medium text-gray-700">Passenger {passengerIndex + 1}</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ">
                      <div className="relative">
                        <label className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-500 font-medium">
                          title
                        </label>
                        <select
                          value={passenger.title}
                          onChange={(e) => updatePassengerField(bookingId, legIndex, passengerIndex, 'title', e.target.value)}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        >
                          <option value="">Select Title</option>
                          {TITLES.map(title => (
                            <option key={title} value={title}>{title}</option>
                          ))}
                        </select>
                      </div>
                      <div className="relative">
                        <label className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-500 font-medium">
                          full_name
                        </label>
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={passenger.full_name}
                          onChange={(e) => updatePassengerField(bookingId, legIndex, passengerIndex, 'full_name', e.target.value)}
                          onFocus={() => {
                            const dropdownKey = `${bookingId}-${legIndex}-${passengerIndex}`;
                            const filledPassengers = getFilledPassengers(formData);
                            if (filledPassengers.length > 0) {
                              setShowPassengerDropdown(prev => ({
                                ...prev,
                                [dropdownKey]: true
                              }));
                            }
                          }}
                          onBlur={() => {
                            const dropdownKey = `${bookingId}-${legIndex}-${passengerIndex}`;
                            setTimeout(() => {
                              setShowPassengerDropdown(prev => ({
                                ...prev,
                                [dropdownKey]: false
                              }));
                            }, 150); // slight delay to allow click selection
                          }}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />

                        {/* Dropdown for existing passengers */}
                        {showPassengerDropdown[`${bookingId}-${legIndex}-${passengerIndex}`] && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                            {getFilledPassengers(formData)
                              .filter(p => !(p.legIndex === legIndex && p.passengerIndex === passengerIndex))
                              .map((filledPassenger, index) => (
                                <div
                                  key={index}
                                  className="p-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                  onClick={() => copyPassengerData(bookingId, legIndex, passengerIndex, filledPassenger)}
                                >
                                  <div className="text-sm font-medium text-gray-800">
                                    {filledPassenger.displayName}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {filledPassenger.nationality} • {filledPassenger.document_type}
                                  </div>
                                </div>
                              ))}
                            {getFilledPassengers(formData)
                              .filter(p => !(p.legIndex === legIndex && p.passengerIndex === passengerIndex))
                              .length === 0 && (
                                <div className="p-2 text-sm text-gray-500 text-center">
                                  No filled passengers found
                                </div>
                              )}
                          </div>
                        )}
                      </div>

                      <div className="relative">
                        <label className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-500 font-medium">
                          gender
                        </label>
                        <select
                          value={passenger.gender}
                          onChange={(e) => updatePassengerField(bookingId, legIndex, passengerIndex, 'gender', e.target.value)}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        >
                          <option value="">Select Gender</option>
                          {GENDERS.map(gender => (
                            <option key={gender} value={gender}>{gender}</option>
                          ))}
                        </select>
                      </div>

                      <div className="relative">
                        <label className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-500 font-medium">
                          date_of_birth
                        </label>
                        <input
                          type="date"
                          value={passenger.date_of_birth}
                          onChange={(e) => updatePassengerField(bookingId, legIndex, passengerIndex, 'date_of_birth', e.target.value)}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                      </div>
                      {/* Actual Age */}
                      <div className="relative">
                        <label className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-500 font-medium">
                          Actual Age
                        </label>
                        <input
                          type="text"
                          value={calculateActualAge(passenger.date_of_birth)}
                          readOnly
                          className="p-2 border border-gray-300 rounded-md bg-gray-100 w-full"
                        />
                      </div>

                      <div className="relative">
                        <label className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-500 font-medium">
                          nationality
                        </label>
                        <select
                          value={passenger.nationality}
                          onChange={(e) => updatePassengerField(bookingId, legIndex, passengerIndex, 'nationality', e.target.value)}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        >
                          <option value="">Select Nationality</option>
                          {NATIONALITIES.map(nat => (
                            <option key={nat} value={nat}>{nat}</option>
                          ))}
                        </select>
                      </div>

                      <div className="relative">
                        <label className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-500 font-medium">
                          contact_number
                        </label>
                        <input
                          type="tel"
                          placeholder="Contact Number"
                          value={passenger.contact_number}
                          onChange={(e) => updatePassengerField(bookingId, legIndex, passengerIndex, 'contact_number', e.target.value)}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                      </div>

                      <div className="relative">
                        <label className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-500 font-medium">
                          email
                        </label>
                        <input
                          type="email"
                          placeholder="Email"
                          value={passenger.email}
                          onChange={(e) => updatePassengerField(bookingId, legIndex, passengerIndex, 'email', e.target.value)}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                      </div>
                      {/* Visa Issued By */}
                      <div className="relative">
                        <label className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-500 font-medium">
                          visa_issued_by
                        </label>
                        <input
                          type="text"
                          placeholder="Visa Issued By"
                          value={passenger.visa_issued_by}
                          onChange={(e) => updatePassengerField(bookingId, legIndex, passengerIndex, 'visa_issued_by', e.target.value)}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                      </div>

                      {/* Visa Waiver (VVIP) */}
                      <div className="relative">
                        <label className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-500 font-medium">
                          visa_waiver_vvip
                        </label>
                        <select
                          value={passenger.visa_waiver_vvip}
                          onChange={(e) => updatePassengerField(bookingId, legIndex, passengerIndex, 'visa_waiver_vvip', e.target.value)}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>

                      {/* Diplomatic */}
                      <div className="relative">
                        <label className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-500 font-medium">
                          diplomatic
                        </label>
                        <select
                          value={passenger.diplomatic}
                          onChange={(e) => updatePassengerField(bookingId, legIndex, passengerIndex, 'diplomatic', e.target.value)}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>

                      <div className="relative">
                        <label className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-500 font-medium">
                          document_type
                        </label>
                        <select
                          value={passenger.document_type}
                          onChange={(e) => updatePassengerField(bookingId, legIndex, passengerIndex, 'document_type', e.target.value)}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        >
                          <option value="">Select Document Type</option>
                          {DOCUMENT_TYPES.map(doc => (
                            <option key={doc} value={doc.toLowerCase()}>{doc}</option>
                          ))}
                        </select>
                      </div>

                      <div className="relative">
                        <label className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-500 font-medium">
                          document_number
                        </label>
                        <input
                          type="text"
                          placeholder="Document Number"
                          value={passenger.document_number}
                          onChange={(e) => updatePassengerField(bookingId, legIndex, passengerIndex, 'document_number', e.target.value)}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                      </div>

                      <div className="relative">
                        <label className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-500 font-medium">
                          document_expiry
                        </label>
                        <input
                          type="date"
                          value={passenger.document_expiry}
                          onChange={(e) => updatePassengerField(bookingId, legIndex, passengerIndex, 'document_expiry', e.target.value)}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                      </div>

                      <div className="relative">
                        <label className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-500 font-medium">
                          visa_number
                        </label>
                        <input
                          type="text"
                          placeholder="Visa Number"
                          value={passenger.visa_number}
                          onChange={(e) => updatePassengerField(bookingId, legIndex, passengerIndex, 'visa_number', e.target.value)}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                      </div>

                      <div className="relative">
                        <label className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-500 font-medium">
                          visa_expiry
                        </label>
                        <input
                          type="date"
                          value={passenger.visa_expiry}
                          onChange={(e) => updatePassengerField(bookingId, legIndex, passengerIndex, 'visa_expiry', e.target.value)}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                      </div>

                      <div className="relative">
                        <label className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-500 font-medium">
                          meal_preference
                        </label>
                        <select
                          value={passenger.meal_preference}
                          onChange={(e) => updatePassengerField(bookingId, legIndex, passengerIndex, 'meal_preference', e.target.value)}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        >
                          <option value="">Select Meal Preference</option>
                          {MEAL_PREFERENCES.map(meal => (
                            <option key={meal} value={meal}>{meal}</option>
                          ))}
                        </select>
                      </div>

                      <div className="relative">
                        <label className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-500 font-medium">
                          seat_preference
                        </label>
                        <select
                          value={passenger.seat_preference}
                          onChange={(e) => updatePassengerField(bookingId, legIndex, passengerIndex, 'seat_preference', e.target.value)}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        >
                          <option value="">Select Seat Preference</option>
                          {SEAT_PREFERENCES.map(seat => (
                            <option key={seat} value={seat}>{seat}</option>
                          ))}
                        </select>
                      </div>

                      <div className="relative">
                        <label className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-500 font-medium">
                          special_assistance
                        </label>
                        <input
                          type="text"
                          placeholder="Special Assistance"
                          value={passenger.special_assistance}
                          onChange={(e) => updatePassengerField(bookingId, legIndex, passengerIndex, 'special_assistance', e.target.value)}
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pet Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-700">Pets:</h5>
                    <button
                      onClick={() => addPet(bookingId, legIndex)}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                    >
                      <AiOutlinePlus size={14} />
                      Add Pet
                    </button>
                  </div>

                  {leg.pets.map((pet, petIndex) => (
                    <div key={petIndex} className="bg-green-50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h6 className="font-medium text-gray-700">Pet {petIndex + 1}</h6>
                        <button
                          onClick={() => removePet(bookingId, legIndex, petIndex)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <AiOutlineDelete size={16} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div className="relative">
                          <label className="absolute -top-2 left-3 bg-green-50 px-1 text-xs text-gray-500 font-medium">
                            pet_name
                          </label>
                          <input
                            type="text"
                            placeholder="Pet Name"
                            value={pet.pet_name}
                            onChange={(e) => updatePetField(bookingId, legIndex, petIndex, 'pet_name', e.target.value)}
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                          />
                        </div>

                        <div className="relative">
                          <label className="absolute -top-2 left-3 bg-green-50 px-1 text-xs text-gray-500 font-medium">
                            species
                          </label>
                          <input
                            type="text"
                            placeholder="Species"
                            value={pet.species}
                            onChange={(e) => updatePetField(bookingId, legIndex, petIndex, 'species', e.target.value)}
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                          />
                        </div>

                        <div className="relative">
                          <label className="absolute -top-2 left-3 bg-green-50 px-1 text-xs text-gray-500 font-medium">
                            breed
                          </label>
                          <input
                            type="text"
                            placeholder="Breed"
                            value={pet.breed}
                            onChange={(e) => updatePetField(bookingId, legIndex, petIndex, 'breed', e.target.value)}
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                          />
                        </div>

                        <div className="relative">
                          <label className="absolute -top-2 left-3 bg-green-50 px-1 text-xs text-gray-500 font-medium">
                            age
                          </label>
                          <input
                            type="number"
                            placeholder="Age"
                            value={pet.age}
                            onChange={(e) => updatePetField(bookingId, legIndex, petIndex, 'age', parseInt(e.target.value))}
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                          />
                        </div>

                        <div className="relative">
                          <label className="absolute -top-2 left-3 bg-green-50 px-1 text-xs text-gray-500 font-medium">
                            weight_kg
                          </label>
                          <input
                            type="number"
                            placeholder="Weight (kg)"
                            value={pet.weight_kg}
                            onChange={(e) => updatePetField(bookingId, legIndex, petIndex, 'weight_kg', parseFloat(e.target.value))}
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                          />
                        </div>

                        <div className="relative">
                          <label className="absolute -top-2 left-3 bg-green-50 px-1 text-xs text-gray-500 font-medium">
                            microchip_number
                          </label>
                          <input
                            type="text"
                            placeholder="Microchip Number"
                            value={pet.microchip_number}
                            onChange={(e) => updatePetField(bookingId, legIndex, petIndex, 'microchip_number', e.target.value)}
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <textarea
            placeholder="Additional notes..."
            value={formData.notes}
            onChange={(e) => setPassengerFormData(prev => ({
              ...prev,
              [bookingId]: { ...prev[bookingId], notes: e.target.value }
            }))}
            className="w-full h-24 p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => savePassengerData(bookingId)}
            disabled={passengerLoading[bookingId]}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
          >
            {passengerLoading[bookingId] ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <AiOutlineSend size={16} />
                Save Details
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen w-full bg-fixed bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-photo/airplane-runway-airport-sunset-travel-concept_587448-8154.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/40 z-10" />
      <div className="absolute w-full top-0 left-0 z-40">
        <NavBar />
      </div>

      <div className="relative z-30 min-h-screen overflow-auto pt-28 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-white mb-8 drop-shadow-lg">
            My Travel History
          </h1>

          {loading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
              <p className="text-white text-lg">Loading your bookings...</p>
            </div>
          ) : bookings && bookings.length > 0 ? (
            bookings
              .slice()
              .sort((a, b) => {
                const dateA = new Date(a.createdAt || a.updatedAt || 0);
                const dateB = new Date(b.createdAt || b.updatedAt || 0);
                return dateB - dateA;
              })
              .map((booking, index) => (
                <div
                  key={booking._id}
                  className="bg-white bg-opacity-95 rounded-xl shadow-2xl p-6 mb-8 backdrop-blur-sm hover:shadow-3xl transition-all duration-300"
                >
                  <div className="flex items-start md:items-center justify-between gap-4 border-b border-gray-200 pb-4 mb-6">
                    <div className="flex items-center gap-3">
                      <AiOutlineCheckCircle className="text-green-500 flex-shrink-0" size={36} />
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                          Booking #{index + 1}
                        </h2>
                        <p className="text-sm text-gray-600 font-medium">
                          {booking.flight_type} &mdash;{" "}
                          <span className="text-blue-600">{booking.trip_type?.toUpperCase()}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-700">
                          Amount Paid ({booking.currency})
                        </p>
                        <p className="text-2xl text-blue-600 font-bold">
                          {booking.amount_paid}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                        }`}>
                        {booking.status?.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <AiOutlineUser className="text-blue-600" />
                        Passenger Details
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Name</p>
                            <p className="font-medium text-gray-800">
                              {booking.user_info?.name || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium text-gray-800">
                              {booking.user_info?.email || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="font-medium text-gray-800">
                              {booking.user_info?.phone || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Passengers</p>
                            <p className="font-medium text-gray-800">
                              {booking.segments?.[0]?.passengers || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Booking Information
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Booking ID</p>
                            <p className="font-medium text-gray-800 text-xs">
                              {booking._id}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Created</p>
                            <p className="font-medium text-gray-800">
                              {formatDateTime(booking.createdAt)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Updated</p>
                            <p className="font-medium text-gray-800">
                              {formatDateTime(booking.updatedAt)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Booking Status</p>
                            <p className="font-medium text-gray-800">
                              {booking.status || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Flight Segments
                    </h3>
                    {booking.segments && booking.segments.length > 0 ? (
                      <div className="space-y-3">
                        {booking.segments.map((segment, segmentIndex) => (
                          <div
                            key={segmentIndex}
                            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-gray-800">
                                Segment {segmentIndex + 1}
                              </h4>
                              <span className="text-sm text-gray-600">
                                {segment.passengers} passenger{segment.passengers > 1 ? 's' : ''}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">From</p>
                                <p className="font-medium text-gray-800">
                                  {segment.from === "custom"
                                    ? segment.fromAddress
                                    : `${segment.fromCity} (${segment.fromIATA})`}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">To</p>
                                <p className="font-medium text-gray-800">
                                  {segment.to === "custom"
                                    ? segment.toAddress
                                    : `${segment.toCity} (${segment.toIATA})`}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Departure</p>
                                <p className="font-medium text-gray-800">
                                  {segment.departureDate
                                    ? new Date(segment.departureDate).toLocaleDateString()
                                    : 'N/A'}
                                </p>
                              </div>
                              {segment.returnDate && (
                                <div>
                                  <p className="text-sm text-gray-600 mb-1">Return</p>
                                  <p className="font-medium text-gray-800">
                                    {new Date(segment.returnDate).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                              {/* <div>
                                <p className="text-sm text-gray-600 mb-1">Class</p>
                                <p className="font-medium text-gray-800">
                                  {segment.class || 'N/A'}
                                </p>
                              </div> */}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No flight segments available.</p>
                    )}
                  </div>

                  {/* Passenger Information Form */}
                  {showPassengerForm[booking._id] && renderPassengerForm(booking)}

                  {/* Modification Request Section */}
                  {modificationRequests[booking._id]?.isOpen && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-yellow-800">
                          Request Modification
                        </h3>
                        <button
                          onClick={() => toggleModificationRequest(booking._id)}
                          className="text-yellow-600 hover:text-yellow-800 transition-colors"
                        >
                          <AiOutlineClose size={20} />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Please describe the changes you would like to make:
                          </label>
                          <textarea
                            value={modificationRequests[booking._id]?.message || ''}
                            onChange={(e) => updateModificationMessage(booking._id, e.target.value)}
                            placeholder="Describe your modification request in detail..."
                            className="w-full h-32 p-3 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={() => sendModificationRequest(booking)}
                            disabled={emailLoading[booking._id]}
                            className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
                          >
                            {emailLoading[booking._id] ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Sending...
                              </>
                            ) : (
                              <>
                                <AiOutlineSend size={16} />
                                Send Request
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => togglePassengerForm(booking)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                    >
                      <AiOutlineUser size={16} />
                      {showPassengerForm[booking._id] ? 'Hide' : 'Add'} Passenger Details
                    </button>

                    <button
                      onClick={() => toggleModificationRequest(booking._id)}
                      className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                    >
                      <AiOutlineEdit size={16} />
                      Request Modification
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-12">
              <div className="bg-white bg-opacity-95 rounded-xl shadow-2xl p-8 backdrop-blur-sm">
                <AiOutlineCheckCircle className="mx-auto text-gray-400 mb-4" size={64} />
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  No Bookings Found
                </h2>
                <p className="text-gray-600 mb-6">
                  You haven't made any bookings yet. Start planning your next adventure!
                </p>
                <button
                  onClick={() => window.location.href = '/'}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Start Booking
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelHistory;