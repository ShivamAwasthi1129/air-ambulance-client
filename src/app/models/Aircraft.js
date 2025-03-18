import mongoose from "mongoose";

const AmenitiesSchema = new mongoose.Schema({
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
    value: { type: String, required: true }
});

const GallerySchema = new mongoose.Schema({
    Day: { type: String, default: "" },
    Night: { type: String, default: "" }
});

const ViewSchema = new mongoose.Schema({
    "Front View": { type: String, default: "" },
    "Left View": { type: String, default: "" },
    "Rear View": { type: String, default: "" },
    "Right View": { type: String, default: "" }
});

const AircraftGallerySchema = new mongoose.Schema({
    aircraftLayout: GallerySchema,
    cockpit: ViewSchema,
    exterior: ViewSchema,
    interior: ViewSchema,
    video: { type: String, default: "" }
});

const FleetDetailsSchema = new mongoose.Schema({
    baseStation: { type: String, required: true },
    flightType: { type: String, required: true },
    flyingRange: { type: String, required: true },
    insuranceExpiry: { type: String, required: true },
    landingRunway: { type: String, required: true },
    lastMaintenance: { type: String, required: true },
    maxSpeed: { type: String, required: true },
    mfgDate: { type: String, required: true },
    pricing: { type: String, required: true },
    refurbishedDate: { type: String, required: true },
    luggage: { type: String, required: true },
    registrationNo: { type: String, required: true },
    restrictedAirports: [{ type: String }],
    seatCapacity: { type: Number, required: true },
    selectedModel: { type: String, required: true },
    takeoffRunway: { type: String, required: true },
    unavailabilityDates: {
        fromDate: { type: String, required: true },
        toDate: { type: String, required: true }
    }
});

const CargoSchema = new mongoose.Schema({
    Space: {
        Height: { type: String, required: true },
        Length: { type: String, required: true },
        Width: { type: String, required: true }
    },
    "Weight in (TONS)": {
        Height: { type: String, required: true },
        Length: { type: String, required: true },
        Width: { type: String, required: true },
        "Weight in (TONS)": { type: String, required: true }
    }
});

const MedicalSchema = new mongoose.Schema({
    "Guest Seats": { GuestSeats: { type: String, required: true } },
    "Patient Beds": { PatientBeds: { type: String, required: true } }
});

const NightSchema = new mongoose.Schema({
    "Common Beds": { CommonBeds: { type: String, required: true } },
    "Private Rooms": { PrivateRooms: { type: String, required: true } },
    Recliners: { Recliners: { type: String, required: true } }
});

const PressSchema = new mongoose.Schema({
    Podium: { Podium: { type: String, required: true } },
    Seats: { Seats: { type: String, required: true } }
});

const TravelModesSchema = new mongoose.Schema({
    cargo: CargoSchema,
    medical: MedicalSchema,
    night: NightSchema,
    press: PressSchema
});

const AircraftSchema = new mongoose.Schema({
    serialNumber: { type: Number, required: true },
    // additionalAmenities: { type: Map, of: AmenitiesSchema },
    additionalAmenities: mongoose.Schema.Types.Mixed,
    aircraftGallery: AircraftGallerySchema,
    fleetDetails: FleetDetailsSchema,
    travelModes: TravelModesSchema
});

export default mongoose.models.Aircraft || mongoose.model("Aircraft", AircraftSchema, "Aircraft");
