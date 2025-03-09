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
    // const results = await Airports.find(
    //   { $text: { $search: query } }, // Full-text search
    //   { score: { $meta: "textScore" } } // Get search relevance score
    // ).sort({ score: { $meta: "textScore" } }); // Sort by relevance

    const results = await Airports.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: query, $options: "i" } }, // Case-insensitive partial match for name
            { city: { $regex: query, $options: "i" } }, // Case-insensitive partial match for city
            { country: { $regex: query, $options: "i" } }, // Case-insensitive partial match for country
            { iata_code: { $regex: query, $options: "i" } }, // Case-insensitive partial match for iata_code
            { icao_code: { $regex: query, $options: "i" } }, // Case-insensitive partial match for icao_code
          ],
        },
      },
      {
        $addFields: {
          // Calculate a custom score for each document
          score: {
            $sum: [
              {
                $cond: [
                  { $eq: [{ $toLower: "$name" }, query.toLowerCase()] },
                  10, // Highest score for exact match on name
                  0,
                ],
              },
              {
                $cond: [
                  { $eq: [{ $toLower: "$city" }, query.toLowerCase()] },
                  8, // Higher score for exact match on city
                  0,
                ],
              },
              {
                $cond: [
                  { $eq: [{ $toLower: "$country" }, query.toLowerCase()] },
                  6, // Higher score for exact match on country
                  0,
                ],
              },
              {
                $cond: [
                  { $eq: [{ $toLower: "$iata_code" }, query.toLowerCase()] },
                  4, // Higher score for exact match on iata_code
                  0,
                ],
              },
              {
                $cond: [
                  { $eq: [{ $toLower: "$icao_code" }, query.toLowerCase()] },
                  2, // Higher score for exact match on icao_code
                  0,
                ],
              },
              {
                $cond: [
                  { $regexMatch: { input: "$name", regex: query, options: "i" } },
                  1, // Lower score for partial match on name
                  0,
                ],
              },
              {
                $cond: [
                  { $regexMatch: { input: "$city", regex: query, options: "i" } },
                  1, // Lower score for partial match on city
                  0,
                ],
              },
              {
                $cond: [
                  { $regexMatch: { input: "$country", regex: query, options: "i" } },
                  1, // Lower score for partial match on country
                  0,
                ],
              },
              {
                $cond: [
                  { $regexMatch: { input: "$iata_code", regex: query, options: "i" } },
                  1, // Lower score for partial match on iata_code
                  0,
                ],
              },
              {
                $cond: [
                  { $regexMatch: { input: "$icao_code", regex: query, options: "i" } },
                  1, // Lower score for partial match on icao_code
                  0,
                ],
              },
            ],
          },
        },
      },
      {
        $project: {
          name: 1,
          city: 1,
          country: 1,
          iata_code: 1,
          icao_code: 1,
          score: 1, 
          latitude: 1,
          longitude: 1
        },
      },
      {
        $sort: {
          score: -1, // Sort by score in descending order
        },
      },
    ])

    return results;
  } catch (error) {
    console.error("Error searching airports:", error);
    return [];
  }
}

export function addHoursToDate(dateString, hoursToAdd) {
  let date = new Date(dateString);
  date.setHours(date.getHours() + hoursToAdd);
  return date;
}

export function convertTo12HourFormat(time) {
  // Split the time into hours and minutes
  let [hours, minutes] = time.split(':');

  // Convert hours to a number
  hours = parseInt(hours);

  // Determine AM or PM
  const period = hours >= 12 ? 'PM' : 'AM';

  // Convert to 12-hour format
  hours = hours % 12 || 12; // Handle midnight (0 hours) case

  // Return the formatted time
  return `${hours}:${minutes} ${period}`;
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
