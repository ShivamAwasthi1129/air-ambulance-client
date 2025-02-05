import Airports from "@/app/models/Airports";

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
    const results = await Airports.find({
      "name": {
        $regex: new RegExp(`^${query.trim()}$`, "i"),
      },
    });

    return results;
  } catch (e) {
    console.error("Error searching for station:", e.message);
    return [];
  }
}

export function convertToHoursMinutes(decimalHours) {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  return `${hours}h ${minutes}m`;
}
