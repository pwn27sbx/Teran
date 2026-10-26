import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const SITE_URL = 'https://hospitalveterinarioteran.com';
const SITE_NAME = 'Hospital Veterinario Terán';
const DEFAULT_IMAGE = '/og-teran.jpg';
const OG_IMAGE_WIDTH = '1200';
const OG_IMAGE_HEIGHT = '630';
const OG_IMAGE_TYPE = 'image/jpeg';
/** Open Graph locales are territory-tagged, so the bare i18n language maps here. */
const OG_LOCALES: Record<string, string> = { es: 'es_ES', en: 'en_US' };
const FALLBACK_OG_LOCALE = 'es_ES';
const FALLBACK_LANGUAGE = 'es';

/** Resolves repository-relative paths against the production origin. */
function absoluteUrl(value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_URL}${value.startsWith('/') ? '' : '/'}${value}`;
}

/** Normalizes a route so the canonical never concatenates two slashes. */
function normalizeRoute(route: string): string {
  return route.startsWith('/') ? route : `/${route}`;
}

export function SEO({ title, description, image, url }: SEOProps) {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const defaultTitle = SITE_NAME;
  const defaultDescription = t('home.hero.subtitle', 'Atención médica integral, tecnología avanzada y un equipo compasivo disponible las 24 horas para cuidar de quienes más amas.');

  // The route is declarative data; deriving it also keeps the canonical correct
  // for any route that does not pass `url` explicitly.
  const route = normalizeRoute(url ?? location.pathname);
  const language = i18n.language?.split('-')[0] || FALLBACK_LANGUAGE;
  const ogLocale = OG_LOCALES[language] ?? FALLBACK_OG_LOCALE;

  const seo = {
    title: title ? `${title} | ${defaultTitle}` : defaultTitle,
    description: description || defaultDescription,
    image: absoluteUrl(image || DEFAULT_IMAGE),
    url: `${SITE_URL}${route}`,
    canonical: `${SITE_URL}${route}`,
  };

  return (
    <Helmet htmlAttributes={{ lang: language }}>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={seo.canonical} />

      {/* OpenGraph tags */}
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:image:width" content={OG_IMAGE_WIDTH} />
      <meta property="og:image:height" content={OG_IMAGE_HEIGHT} />
      <meta property="og:image:type" content={OG_IMAGE_TYPE} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={ogLocale} />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
    </Helmet>
  );
}
