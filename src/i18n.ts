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
      "home.trusted.rating": "5.0 de 500+ reseñas",
      "home.why_us": "¿Por qué elegirnos?",
      "home.why_us_desc": "Veterinarias Terán es sinónimo de profesionalismo y pasión. Son <strong class='font-bold text-[#0277ab]'>24 años</strong> salvaguardando el bienestar de las mascotas del Perú, siendo precursores en tecnología médica de punta y capacitación constante de nuestro staff. Cada día es un reto para salvar una vida y mejorar nuestro país.",
      "home.gallery": "Nuestra Galería",
      "home.gallery_desc": "Un vistazo a la excelencia de nuestras instalaciones y los pacientes felices que confían en nosotros día a día.",
      "premium.store.title": "Tienda Virtual",
      "premium.store.subtitle": "PET SHOP EXCLUSIVO",
      "premium.store.desc": "Los mejores productos en alimentos, juguetes, camas y accesorios para consentir a tu mascota.",
      "premium.locations.title": "Nuestras Sedes",
      "premium.locations.subtitle": "CERCA DE TI",
      "premium.locations.desc": "Encuentra una clínica Terán lista para atenderte con la mejor tecnología.",
      "premium.tv.title": "Terán TV",
      "premium.tv.subtitle": "ARCHIVO MÉDICO Y CASOS",
      "premium.tv.desc": "Nuestro archivo videográfico con casos clínicos, testimonios y proyectos especiales.",
      "emergencies.title": "Emergencias",
      "emergencies.subtitle": "Unidad de Trauma Activa",
      "emergencies.desc": "Atención veterinaria inmediata las 24 horas. Nuestro equipo de cuidados intensivos está preparado para recibirte.",
      "emergencies.phone": "Central Telefónica",
      "emergencies.whatsapp": "WhatsApp de Emergencia",
      "services.title": "Nuestros",
      "services.title_highlight": "Servicios",
      "services.specialties": "Especialidades",
      "services.desc": "Más de 21 años mejorando la salud de tu mascota con la mejor tecnología.",
      "store.title": "Próximamente",
      "store.subtitle": "Tienda Virtual Terán",
      "store.desc": "Estamos preparando el mejor catálogo de alimentos, juguetes y accesorios para consentir a tu mascota. ¡Vuelve pronto!",
      "store.back": "Regresar al Inicio"
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
      "home.trusted.rating": "5.0 from 500+ reviews",
      "home.why_us": "Why Choose Us?",
      "home.why_us_desc": "Teran Veterinary is synonymous with professionalism and passion. For <strong class='font-bold text-[#0277ab]'>24 years</strong> we have safeguarded the well-being of pets in Peru, being pioneers in cutting-edge medical technology and continuous training for our staff. Every day is a challenge to save a life and improve our country.",
      "home.gallery": "Our Gallery",
      "home.gallery_desc": "A glimpse into the excellence of our facilities and the happy patients who trust us every day.",
      "premium.store.title": "Virtual Store",
      "premium.store.subtitle": "EXCLUSIVE PET SHOP",
      "premium.store.desc": "The best products in food, toys, beds, and accessories to pamper your pet.",
      "premium.locations.title": "Our Locations",
      "premium.locations.subtitle": "CLOSE TO YOU",
      "premium.locations.desc": "Find a Terán clinic ready to attend you with the best technology.",
      "premium.tv.title": "Terán TV",
      "premium.tv.subtitle": "MEDICAL ARCHIVE & CASES",
      "premium.tv.desc": "Our video archive with clinical cases, testimonials, and special projects.",
      "emergencies.title": "Emergencies",
      "emergencies.subtitle": "Active Trauma Unit",
      "emergencies.desc": "Immediate veterinary care 24/7. Our intensive care team is ready to receive you.",
      "emergencies.phone": "Call Center",
      "emergencies.whatsapp": "Emergency WhatsApp",
      "services.title": "Our",
      "services.title_highlight": "Services",
      "services.specialties": "Specialties",
      "services.desc": "Over 21 years improving your pet's health with the best technology.",
      "store.title": "Coming Soon",
      "store.subtitle": "Terán Virtual Store",
      "store.desc": "We are preparing the best catalog of food, toys, and accessories to pamper your pet. Come back soon!",
      "store.back": "Back to Home"
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
