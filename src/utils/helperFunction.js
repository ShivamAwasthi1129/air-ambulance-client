import Airports from "@/app/models/Airports";
import { connectToDatabase } from "@/config/mongo";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

// Haversine Formula to calculate distance
export function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const toRad = (angle) => (angle * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

export async function searchStation(query) {
  try {
    await connectToDatabase();
    const results = await Airports.find(
      { $text: { $search: query } }, // Full-text search
      { score: { $meta: "textScore" } } // Get search relevance score
    ).sort({ score: { $meta: "textScore" } }); // Sort by relevance

    return results;
  } catch (error) {
    console.error("Error searching airports:", error);
    return [];
  }
}

export function convertToHoursMinutes(decimalHours) {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  return `${hours}h ${minutes}m`;
}

export function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email }, // Payload: user ID and email
    SECRET_KEY, // Secret key
    { expiresIn: "1h" } // Token expiration time
  );
}
