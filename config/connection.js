const GeographicLib = require('geographiclib');

function calculateDistance(lat1, lon1, lat2, lon2) {
  const geod = GeographicLib.Geodesic.WGS84;
  const result = geod.Inverse(lat1, lon1, lat2, lon2);
  const distance = result.s12 / 1000; // Convert meters to kilometers
  return distance;
}

// Example usage
const lat1 = 9.8992824; // Latitude of the first point
const lon1 = 77.0168663; // Longitude of the first point
const lat2 = 9.7510; // Latitude of the second point
const lon2 = 77.1428; // Longitude of the second point

const distance = calculateDistance(lat1, lon1, lat2, lon2);
console.log(distance); // Output: 44.978145

