/**
 * Local Rides Dispatch Simulation
 * This script simulates the inDrive-style matching algorithm:
 * 1. Find nearby drivers within a radius.
 * 2. Score drivers based on distance, rating, and acceptance rate.
 * 3. Return the prioritized list for broadcasting.
 */

interface Driver {
  id: string;
  lat: number;
  lng: number;
  rating: number;
  acceptanceRate: number;
  isOnline: boolean;
}

const DRIVERS: Driver[] = [
  { id: 'SARAH', lat: -17.7812, lng: 31.0522, rating: 4.9, acceptanceRate: 0.95, isOnline: true },
  { id: 'JOHN', lat: -17.7850, lng: 31.0600, rating: 4.2, acceptanceRate: 0.80, isOnline: true },
  { id: 'MEMORY', lat: -17.7900, lng: 31.0450, rating: 4.7, acceptanceRate: 0.88, isOnline: true },
  { id: 'SIMBA', lat: -17.8100, lng: 31.0500, rating: 4.5, acceptanceRate: 0.90, isOnline: true },
];

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function scoreDriver(driver: Driver, pickupLat: number, pickupLng: number): number {
  const distance = calculateDistance(driver.lat, driver.lng, pickupLat, pickupLng);
  
  // Weighting factors
  const distanceScore = Math.max(0, 1 - distance / 5); // Max 5km radius
  const ratingScore = driver.rating / 5;
  const acceptanceScore = driver.acceptanceRate;

  // Final score out of 1.0 (weighted)
  // 40% Distance, 40% Rating, 20% Acceptance Rate
  return (distanceScore * 0.4) + (ratingScore * 0.4) + (acceptanceScore * 0.2);
}

function simulateDispatch(pickupLat: number, pickupLng: number) {
  console.log(`📡 Searching for drivers near [${pickupLat}, ${pickupLng}]...`);

  const results = DRIVERS
    .filter(d => d.isOnline)
    .map(d => ({
      id: d.id,
      distance: calculateDistance(d.lat, d.lng, pickupLat, pickupLng).toFixed(2),
      score: scoreDriver(d, pickupLat, pickupLng).toFixed(3)
    }))
    .sort((a, b) => parseFloat(b.score) - parseFloat(a.score));

  console.table(results);
  console.log(`🚀 Dispatching request to Top 2: ${results.slice(0, 2).map(r => r.id).join(', ')}`);
}

// Pickup: Borrowdale Shopping Centre
simulateDispatch(-17.7800, 31.0500);
