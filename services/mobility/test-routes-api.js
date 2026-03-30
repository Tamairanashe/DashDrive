const axios = require('axios');

const apiKey = 'AIzaSyCxwlIiOcrI_yBrehP9CKr-CoIoPusShh0';
const url = 'https://routes.googleapis.com/v1/computeRoutes'; // Testing both with and without colon if needed
// Actually, let's try the common one:
const url2 = 'https://routes.googleapis.com/directions/v2:computeRoutes';

const body = {
  origin: {
    location: {
      latLng: { latitude: -17.8248, longitude: 31.0530 }
    }
  },
  destination: {
    location: {
      latLng: { latitude: -17.8625, longitude: 30.9220 }
    }
  },
  travelMode: 'DRIVE',
  routingPreference: 'TRAFFIC_AWARE_OPTIMAL',
  computeAlternativeRoutes: true,
  languageCode: 'en-US',
  units: 'METRIC'
};

async function test() {
  const urls = [
    'https://routes.googleapis.com/v1/computeRoutes',
    'https://routes.googleapis.com/directions/v2:computeRoutes'
  ];

  for (const testUrl of urls) {
    console.log(`\nTesting: ${testUrl}`);
    try {
      const response = await axios.post(testUrl, body, {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline'
        }
      });
      console.log('SUCCESS!');
      console.log(JSON.stringify(response.data, null, 2));
      return; // Stop on first success
    } catch (error) {
      console.error('FAILED!');
      if (error.response) {
        console.error('Status:', error.response.status);
        if (error.response.status === 404) {
          console.error('URL not found.');
        } else {
          console.error('Data:', JSON.stringify(error.response.data, null, 2));
        }
      } else {
        console.error('Error:', error.message);
      }
    }
  }
}

test();

