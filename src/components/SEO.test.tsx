import { cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import i18n from '@/i18n';
import { SEO } from './SEO';

const SITE_URL = 'https://hospitalveterinarioteran.com';
const OG_IMAGE_PATH = '/og-teran.jpg';
const OG_IMAGE_URL = `${SITE_URL}${OG_IMAGE_PATH}`;

interface RenderSeoOptions {
  /** Route the router resolves, used by the canonical fallback. */
  route?: string;
  /** Explicit `url` prop, as every page currently passes it. */
  url?: string;
  /** Explicit `image` prop, which must also resolve to an absolute URL. */
  image?: string;
}

function renderSeo({ route = '/', url, image }: RenderSeoOptions = {}) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[route]}>
        <SEO url={url} image={image} />
      </MemoryRouter>
    </HelmetProvider>,
  );
}

function canonicalLinks(): NodeListOf<HTMLLinkElement> {
  return document.head.querySelectorAll('link[rel="canonical"]');
}

function metaContent(selector: string): string | null {
  return document.head.querySelector(selector)?.getAttribute('content') ?? null;
}

describe('SEO', () => {
  beforeEach(async () => {
    // The shipped LanguageDetector reads localStorage/navigator, so the language
    // must be pinned explicitly to keep this suite order-independent.
    await i18n.changeLanguage('es');
    // Each case asserts exact tag counts in <head>, so start from a clean head.
    document.head.innerHTML = '';
  });

  afterEach(async () => {
    cleanup();
    document.head.innerHTML = '';
    document.documentElement.removeAttribute('lang');
    await i18n.changeLanguage('es');
  });

  it('declares exactly one canonical link matching the current route', async () => {
    renderSeo({ route: '/servicios', url: '/servicios' });

    await waitFor(() => {
      expect(canonicalLinks()).toHaveLength(1);
    });

    expect(canonicalLinks()[0].getAttribute('href')).toBe(`${SITE_URL}/servicios`);
  });

  it('derives the canonical from the active route when no url prop is given', async () => {
    renderSeo({ route: '/nosotros' });

    await waitFor(() => {
      expect(canonicalLinks()).toHaveLength(1);
    });

    expect(canonicalLinks()[0].getAttribute('href')).toBe(`${SITE_URL}/nosotros`);
  });

  it('declares a single absolute og:image of 1200x630', async () => {
    renderSeo({ route: '/', url: '/' });

    await waitFor(() => {
      expect(document.head.querySelectorAll('meta[property="og:image"]')).toHaveLength(1);
    });

    expect(metaContent('meta[property="og:image"]')).toBe(OG_IMAGE_URL);
    expect(metaContent('meta[property="og:image:width"]')).toBe('1200');
    expect(metaContent('meta[property="og:image:height"]')).toBe('630');
    expect(metaContent('meta[property="og:image:type"]')).toBe('image/jpeg');
  });

  it('keeps the Open Graph and Twitter metadata aligned with the site domain', async () => {
    renderSeo({ route: '/', url: '/' });

    await waitFor(() => {
      expect(metaContent('meta[property="og:url"]')).toBe(`${SITE_URL}/`);
    });

    expect(metaContent('meta[property="og:site_name"]')).toBe('Hospital Veterinario Terán');
    expect(metaContent('meta[property="og:locale"]')).toBe('es_ES');
    expect(metaContent('meta[property="og:type"]')).toBe('website');
    expect(metaContent('meta[name="twitter:card"]')).toBe('summary_large_image');
    expect(metaContent('meta[name="twitter:image"]')).toBe(OG_IMAGE_URL);
    expect(metaContent('meta[name="twitter:title"]')).not.toBeNull();
    expect(metaContent('meta[name="twitter:description"]')).not.toBeNull();
  });

  it('resolves a custom image prop against the production origin', async () => {
    renderSeo({ route: '/', url: '/', image: '/gallery/oter.webp' });

    await waitFor(() => {
      expect(metaContent('meta[property="og:image"]')).toBe(`${SITE_URL}/gallery/oter.webp`);
    });

    expect(metaContent('meta[name="twitter:image"]')).toBe(`${SITE_URL}/gallery/oter.webp`);
  });

  it('sets the html lang attribute from the active i18n language', async () => {
    await i18n.changeLanguage('en');
    renderSeo({ route: '/', url: '/' });

    await waitFor(() => {
      expect(document.documentElement.getAttribute('lang')).toBe('en');
    });

    await i18n.changeLanguage('es');

    await waitFor(() => {
      expect(document.documentElement.getAttribute('lang')).toBe('es');
    });
  });

  it('omits the non-standard image meta name', async () => {
    renderSeo({ route: '/', url: '/' });

    await waitFor(() => {
      expect(canonicalLinks()).toHaveLength(1);
    });

    expect(document.head.querySelector('meta[name="image"]')).toBeNull();
  });
});
