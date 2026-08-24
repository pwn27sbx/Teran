import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  es: {
    translation: {
      "nav.home": "Inicio",
      "nav.services": "Servicios",
      "nav.about": "Nosotros",
      "nav.certification": "Certificación",
      "nav.store": "Tienda",
      "nav.emergencies": "EMERGENCIAS 24H",
      "nav.emergencies_short": "24H",
      "nav.switch_lang": "Switch to English"
    }
  },
  en: {
    translation: {
      "nav.home": "Home",
      "nav.services": "Services",
      "nav.about": "About Us",
      "nav.certification": "Certification",
      "nav.store": "Store",
      "nav.emergencies": "24H EMERGENCIES",
      "nav.emergencies_short": "24H",
      "nav.switch_lang": "Cambiar a Español"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
