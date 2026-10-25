import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import i18n from '@/i18n';
import BrushReveal from './BrushReveal';
import HeroOverlay from './HeroOverlay';

const WHATSAPP_PHONE = '51959390711';
const WHATSAPP_MESSAGE = 'Hola, quiero agendar una cita para mi mascota.';

const ES_TITLE = 'Amor y ciencia para el bienestar de tu';
const ES_BEST_FRIEND = 'mejor amigo';
const ES_SUBTITLE =
  'Atención médica integral, tecnología avanzada y un equipo compasivo disponible las 24 horas para cuidar de quienes más amas.';
const EN_TITLE = 'Love and science for the well-being of your';
const EN_BEST_FRIEND = 'best friend';

const ES_LOADING = 'Cargando magia...';
const EN_LOADING = 'Loading the magic...';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function renderOverlay() {
  return render(
    <MemoryRouter>
      <HeroOverlay />
    </MemoryRouter>,
  );
}

function renderBrushReveal() {
  return render(<BrushReveal bgImage="/base.webp" revealImage="/reveal.webp" />);
}

/**
 * Pins the reduced-motion preference. This jsdom environment has no
 * `window.matchMedia` at all, so the preference must be injected.
 */
function stubReducedMotionPreference(prefersReducedMotion: boolean): void {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => {
      const matches = prefersReducedMotion && query === REDUCED_MOTION_QUERY;

      return {
        matches,
        media: query,
        onchange: null,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => false,
      } as MediaQueryList;
    }),
  );
}

/** jsdom ships neither observer, and without the canvas package it has no 2D context. */
function stubCanvasEnvironment(): void {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    },
  );

  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
      takeRecords(): [] {
        return [];
      }
    },
  );

  // jsdom logs a "not implemented" warning per call; it already returns null.
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
}

/**
 * jsdom never loads images, so `BrushReveal` would stay stuck on its loading
 * state. This stub resolves every image on the next tick, which is what lets a
 * test observe the state the component reaches after its assets are ready.
 */
function stubAutoLoadingImages(): void {
  class AutoLoadingImage {
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    width = 1200;
    height = 800;
    private currentSource = '';

    get src(): string {
      return this.currentSource;
    }

    set src(value: string) {
      this.currentSource = value;
      setTimeout(() => this.onload?.(), 0);
    }
  }

  vi.stubGlobal('Image', AutoLoadingImage);
}

describe('HeroOverlay', () => {
  beforeEach(async () => {
    // The shipped LanguageDetector reads localStorage/navigator, so the language
    // must be pinned explicitly to keep this suite order-independent.
    await i18n.changeLanguage('es');
  });

  afterEach(async () => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    await i18n.changeLanguage('es');
  });

  it('renders exactly one h1 built from the hero title copy', () => {
    renderOverlay();

    const headings = screen.getAllByRole('heading', { level: 1 });

    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(ES_TITLE);
    expect(headings[0]).toHaveTextContent(ES_BEST_FRIEND);
  });

  it('renders the hero subtitle paragraph', () => {
    renderOverlay();

    expect(screen.getByText(ES_SUBTITLE)).toBeInTheDocument();
  });

  it('renders the WhatsApp primary CTA that opens in a new tab', () => {
    renderOverlay();

    const primary = screen.getByRole('link', { name: /reservar cita/i });
    const href = primary.getAttribute('href') ?? '';

    expect(href.startsWith(`https://wa.me/${WHATSAPP_PHONE}`)).toBe(true);
    expect(href).toContain(encodeURIComponent(WHATSAPP_MESSAGE));
    expect(primary).toHaveAttribute('target', '_blank');
    expect(primary.getAttribute('rel') ?? '').toContain('noopener');
  });

  it('renders the secondary CTA linking to the services page', () => {
    renderOverlay();

    const secondary = screen.getByRole('link', { name: /conoce nuestros servicios/i });

    expect(secondary).toHaveAttribute('href', '/servicios');
    expect(secondary).not.toHaveAttribute('target');
  });

  it('renders the headline in English after a language switch', async () => {
    await i18n.changeLanguage('en');
    renderOverlay();

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toHaveTextContent(EN_TITLE);
    expect(heading).toHaveTextContent(EN_BEST_FRIEND);
  });
});

// The hero media layer lives in BrushReveal, which is what the hero mounts for
// its background. Its reduced-motion and loading contracts are covered here to
// keep the hero behaviour in a single suite.
describe('BrushReveal as the hero media layer', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('es');
  });

  afterEach(async () => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    await i18n.changeLanguage('es');
  });

  it('starts an animation frame loop when motion is allowed', async () => {
    stubReducedMotionPreference(false);
    stubCanvasEnvironment();
    stubAutoLoadingImages();
    const requestFrame = vi.spyOn(window, 'requestAnimationFrame');

    renderBrushReveal();

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    // Give the settled state a chance to start its frame loop before asserting.
    await new Promise((resolve) => setTimeout(resolve, 25));

    expect(requestFrame).toHaveBeenCalled();
  });

  it('starts no animation frame loop when reduced motion is preferred', async () => {
    stubReducedMotionPreference(true);
    stubCanvasEnvironment();
    stubAutoLoadingImages();
    const requestFrame = vi.spyOn(window, 'requestAnimationFrame');

    const { container } = renderBrushReveal();

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    // Give any deferred frame a chance to be requested before asserting.
    await new Promise((resolve) => setTimeout(resolve, 25));

    expect(requestFrame).not.toHaveBeenCalled();
    // The static hero is the base image only.
    expect(container.querySelector('img')).not.toBeNull();
  });

  it('hides the decorative base image from assistive technology', () => {
    stubReducedMotionPreference(false);
    stubCanvasEnvironment();

    const { container } = renderBrushReveal();
    const baseImage = container.querySelector('img');

    expect(baseImage).not.toBeNull();
    expect(baseImage?.getAttribute('alt')).toBe('');
    expect(baseImage?.getAttribute('aria-hidden')).toBe('true');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('announces the loading state through an assistive status role', () => {
    stubReducedMotionPreference(false);
    stubCanvasEnvironment();

    renderBrushReveal();

    expect(screen.getByRole('status')).toHaveTextContent(ES_LOADING);
  });

  it('localizes the loading status in English', async () => {
    stubReducedMotionPreference(false);
    stubCanvasEnvironment();
    await i18n.changeLanguage('en');

    renderBrushReveal();

    expect(screen.getByRole('status')).toHaveTextContent(EN_LOADING);
  });
});
