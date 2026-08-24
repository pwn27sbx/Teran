import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  "es": {
    "translation": {
      "nav.home": "Inicio",
      "nav.services": "Servicios",
      "nav.about": "Nosotros",
      "nav.certification": "Certificación",
      "nav.store": "Tienda",
      "nav.emergencies": "EMERGENCIAS 24H",
      "nav.emergencies_short": "24H",
      "nav.switch_lang": "Switch to English",
      "footer.address": "Urb. Las Quintas, Av. Universitaria #591",
      "footer.phone": "+593 000 0000",
      "footer.emergency": "Emergencias 24/7",
      "footer.rights": "Todos los derechos reservados.",
      "footer.made": "Hecho con el ❤️ por",
      "home.hero.title": "Amor y ciencia para el bienestar de tu",
      "home.hero.best_friend": "mejor amigo",
      "home.hero.subtitle": "Atención médica integral, tecnología avanzada y un equipo compasivo disponible las 24 horas para cuidar de quienes más amas.",
      "home.hero.cta": "Conoce Nuestros Servicios",
      "home.trusted.title": "Cientos de familias confían en nosotros",
      "home.trusted.rating": "5.0 de 500+ reseñas"
    }
  },
  "en": {
    "translation": {
      "nav.home": "Home",
      "nav.services": "Services",
      "nav.about": "About Us",
      "nav.certification": "Certification",
      "nav.store": "Store",
      "nav.emergencies": "24H EMERGENCIES",
      "nav.emergencies_short": "24H",
      "nav.switch_lang": "Cambiar a Español",
      "footer.address": "Las Quintas Urb, Universitaria Ave #591",
      "footer.phone": "+593 000 0000",
      "footer.emergency": "24/7 Emergencies",
      "footer.rights": "All rights reserved.",
      "footer.made": "Made with ❤️ by",
      "home.hero.title": "Love and science for the well-being of your",
      "home.hero.best_friend": "best friend",
      "home.hero.subtitle": "Comprehensive medical care, advanced technology, and a compassionate team available 24/7 to care for the ones you love most.",
      "home.hero.cta": "Discover Our Services",
      "home.trusted.title": "Hundreds of families trust us",
      "home.trusted.rating": "5.0 from 500+ reviews"
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
