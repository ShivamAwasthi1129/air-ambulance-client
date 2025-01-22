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
  const OPENSEARCH_DOMAIN =
    "https://search-airbase-search-q5vzxvf7nu2vyeghdh6gqr5xyy.ap-south-1.es.amazonaws.com";
  const INDEX_NAME = "id";
  try {
    // OpenSearch Query (Full-Text Search)
    const openSearchQuery = {
      size: 10, // Limit results to 10
      query: {
        multi_match: {
          query: query,
          fields: ["name", "iata_code", "icao_code", "city", "country"],
        },
      },
    };

    // OpenSearch API URL
    const url = `${OPENSEARCH_DOMAIN}/${INDEX_NAME}/_search`;

    // Basic Authentication
    const username = process.env.OPENSEARCH_USERNAME;
    const password = process.env.OPENSEARCH_PASSWORD;

    // Send request to OpenSearch
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString(
          "base64"
        )}`,
      },
      body: JSON.stringify(openSearchQuery),
    });

    if (!response.ok) {
      throw new Error(`OpenSearch Error: ${response.statusText}`);
    }

    const data = await response.json();
    const results = data.hits.hits.map((hit) => hit._source);
    return results;
  } catch (e) {
    console.error("Error searching for station:", e.message);
    return [];
  }
}

export function convertToHoursMinutes(decimalHours) {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  return `${hours} hours and ${minutes} minutes`;
}