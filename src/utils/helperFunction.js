import Airports from "@/app/models/Airports";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export function generateUniqueString() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 6 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

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
      {
        $limit: 10
      }
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

export function addTimeToDate(dateInput, timeString) {
  const baseDate = new Date(dateInput);
  
  const [hours, minutes] = timeString.split(':').map(Number);

  if (isNaN(baseDate.getTime()) || isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error('Invalid date or time format. Use a valid date and time in "HH:MM" (24-hour) format.');
  }

  const resultDate = new Date(baseDate);
  resultDate.setHours(hours, minutes, 0, 0); 
  return resultDate;
}

export function addDurationToDate(dateInput, durationString) {
  const baseDate = new Date(dateInput);
  
  if (isNaN(baseDate.getTime())) {
    throw new Error('Invalid date input.');
  }

  const durationMatch = durationString.match(/(\d+)h\s*(\d+)m/);
  if (!durationMatch) {
    throw new Error('Invalid duration format. Use "Xh Ym" (e.g., "1h 19m").');
  }

  const hours = parseInt(durationMatch[1], 10); // Hours extract karo
  const minutes = parseInt(durationMatch[2], 10); // Minutes extract karo

  if (isNaN(hours) || isNaN(minutes) || hours < 0 || minutes < 0 || minutes > 59) {
    throw new Error('Invalid hours or minutes.');
  }

  const resultDate = new Date(baseDate);
  resultDate.setHours(baseDate.getHours() + hours);
  resultDate.setMinutes(baseDate.getMinutes() + minutes);

  return resultDate;
}