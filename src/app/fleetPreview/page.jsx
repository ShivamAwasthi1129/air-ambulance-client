import FleetDetailsPreview from '../components/FleetDetailsPreview';


const fleetData = {
  "fleetDetails": {
    "selectedModel": "Cessna Citation Longitude",
    "registrationNo": "7458569854",
    "pricing": "1200",
    "maxSpeed": "850",
    "flyingRange": "200 - 400 Knots",
    "landingRunway": "380",
    "takeoffRunway": "260",
    "mfgDate": "2025-01-09",
    "lastMaintenance": "2025-01-17",
    "refurbishedDate": "2025-01-15",
    "insuranceExpiry": "2025-01-16",
    "isFleetUnavailable": "yes",
    "restrictedAirports": [
      "Toulouse-Blagnac Airport",
      "Bordeaux-Mérignac Airport",
      "Nantes Atlantique Airport",
      "Fukuoka Airport",
      "Osaka International Airport"
    ],
    "unavailabilityDates": {
      "fromDate": "2025-01-23",
      "toDate": "2025-01-28"
    }
  },
  "aircraftGallery": {
    "interior": {
      "Front View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/internal+view/istockphoto-1438630873-2048x2048.jpg",
      "Left View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/internal+view/istockphoto-1413587508-2048x2048.jpg",
      "Rear View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/internal+view/istockphoto-154191655-2048x2048.jpg",
      "Right View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/internal+view/istockphoto-471884691-2048x2048.jpg"
    },
    "exterior": {
      "Front View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/exterior+view/pexels-asadphoto-240524.jpg",
      "Left View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/exterior+view/pexels-guskazi-13528331.jpg",
      "Rear View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/exterior+view/pexels-joerg-mangelsen-337913024-15953920.jpg",
      "Right View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/exterior+view/pexels-saturnus99-19766183.jpg"
    },
    "cockpit": {
      "Front View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/cockpitView/pexels-joerg-mangelsen-337913024-15781287.jpg",
      "Left View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/cockpitView/pexels-kelly-1179532-2898316.jpg",
      "Rear View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/cockpitView/pexels-luis-peralta-58498002-29637932.jpg",
      "Right View": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/cockpitView/pexels-rafael-cosquiere-1059286-2064123.jpg"
    },
    "video": "https://s3.ap-south-1.amazonaws.com/aviation.hexerve/video/3657467-hd_1920_1080_30fps.mp4"
  },
  "additionalAmenities": {
    "Air Hostess / Escorts": {
      "value": "chargeable",
      "name": "akash sharma",
      "phone": "5685475124"
    },
    "Airport DropOff": {
      "value": "not_available",
      "name": "",
      "phone": ""
    },
    "Airport Pickup": {
      "value": "not_available",
      "name": "",
      "phone": ""
    },
    "Bouquet": {
      "value": "free",
      "name": "",
      "phone": ""
    },
    "Brand new Interior": {
      "value": "free",
      "name": "",
      "phone": ""
    },
    "Brand new Paint": {
      "value": "free",
      "name": "",
      "phone": ""
    },
    "Cafe": {
      "value": "not_available",
      "name": "",
      "phone": ""
    },
    "Emergency Evacuation": {
      "value": "not_available",
      "name": "",
      "phone": ""
    },
    "Espresso Coffee Machine": {
      "value": "free",
      "name": "",
      "phone": ""
    },
    "Full Bar": {
      "value": "not_available",
      "name": "",
      "phone": ""
    },
    "Hot and Cold Stations": {
      "value": "not_available",
      "name": "",
      "phone": ""
    },
    "Life Jacket": {
      "value": "not_available",
      "name": "",
      "phone": ""
    },
    "Lounge Access": {
      "value": "not_available",
      "name": "",
      "phone": ""
    },
    "Microwave": {
      "value": "free",
      "name": "",
      "phone": ""
    },
    "Music System Surround Sound": {
      "value": "free",
      "name": "",
      "phone": ""
    },
    "New FHD Monitor": {
      "value": "free",
      "name": "",
      "phone": ""
    },
    "Personal Gate": {
      "value": "not_available",
      "name": "",
      "phone": ""
    },
    "Power Supply 110V": {
      "value": "free",
      "name": "",
      "phone": ""
    },
    "Private Security": {
      "value": "not_available",
      "name": "",
      "phone": ""
    },
    "Red Carpet": {
      "value": "not_available",
      "name": "",
      "phone": ""
    },
    "Secret Service": {
      "value": "not_available",
      "name": "",
      "phone": ""
    },
    "Security": {
      "value": "not_available",
      "name": "",
      "phone": ""
    },
    "Vip Cab Pick & Drop": {
      "value": "not_available",
      "name": "",
      "phone": ""
    },
    "Vvip Car inside Airport": {
      "value": "not_available",
      "name": "",
      "phone": ""
    },
    "Vvip car Pick & Drop": {
      "value": "free",
      "name": "shivam",
      "phone": "9958241284"
    }
  },
  "travelmodes": {
    "cargo": {
      "Space": {
        "Length": "70",
        "Height": "14",
        "Width": "10"
      },
      "Weight in (TONS)": {
        "Length": "70",
        "Height": "20",
        "Width": "12",
        "Weight in (TONS)": "320"
      }
    },
    "medical": {
      "Guest Seats": {
        "Guest Seats": "5"
      },
      "Patient Beds": {
        "Patient Beds": "4"
      }
    },
    "night": {
      "Common Beds": {
        "Common Beds": "2"
      },
      "Private Rooms": {
        "Private Rooms": "1"
      },
      "Recliners": {
        "Recliners": "12"
      }
    },
    "press": {
      "Podium": {
        "Podium": "1"
      },
      "Seats": {
        "Seats": "12"
      }
    }
  }
};

const App = () => {
  return (
    <FleetDetailsPreview fleetData={fleetData} />
  );
};

export default App;
