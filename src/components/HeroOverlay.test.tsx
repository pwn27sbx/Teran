import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import i18n from '@/i18n';
import HeroOverlay from './HeroOverlay';

const WHATSAPP_PHONE = '51959390711';
const WHATSAPP_MESSAGE = 'Hola, quiero agendar una cita para mi mascota.';

const ES_TITLE = 'Amor y ciencia para el bienestar de tu';
const ES_BEST_FRIEND = 'mejor amigo';
const ES_SUBTITLE =
  'Atención médica integral, tecnología avanzada y un equipo compasivo disponible las 24 horas para cuidar de quienes más amas.';
const EN_TITLE = 'Love and science for the well-being of your';
const EN_BEST_FRIEND = 'best friend';

function renderOverlay() {
  return render(
    <MemoryRouter>
      <HeroOverlay />
    </MemoryRouter>,
  );
}

describe('HeroOverlay', () => {
  beforeEach(async () => {
    // The shipped LanguageDetector reads localStorage/navigator, so the language
    // must be pinned explicitly to keep this suite order-independent.
    await i18n.changeLanguage('es');
  });

  afterEach(async () => {
    cleanup();
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
