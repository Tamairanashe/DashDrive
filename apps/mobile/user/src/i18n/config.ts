import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Minimal configuration for scaling
const resources = {
  en: {
    translation: {
      "welcome": "Welcome to DashDrive",
      "request_ride": "Request a Ride",
      "negotiate": "Negotiate Price",
      "driver_found": "Driver Found!",
    }
  },
  sn: { // Shona (Zimbabwe)
    translation: {
      "welcome": "Tikugashirei kuDashDrive",
      "request_ride": "Kumbira kufambiswa",
      "negotiate": "Hurukuro yemutengo",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
