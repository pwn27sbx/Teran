import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const WHATSAPP_PHONE = "51959390711";
const WHATSAPP_MESSAGE = "Hola, quiero agendar una cita para mi mascota.";

const WHATSAPP_URL = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export interface HeroOverlayProps {
  /**
   * Optional media slot. The overlay owns the stacked (mobile) layout, so the
   * object it receives is sized by layout instead of by a number copied from a
   * neighbouring block. On `md+` that object leaves the slot and positions
   * itself against the hero box.
   */
  media?: ReactNode;
}

/**
 * Copy layer of the home hero.
 *
 * Rendered outside the media error boundaries so the message and the
 * conversion path survive an image failure. It also owns the stacked layout: the
 * brand lockup, the media slot and the copy block share the hero height as a
 * flex column. The root stays pointer-events-none so the media layer keeps its
 * full interaction area; only the CTA row restores pointer events (the object
 * inside the slot does the same for itself).
 */
function HeroOverlay({ media }: HeroOverlayProps) {
  const { t } = useTranslation();

  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex flex-col">
      {/* Brand lockup: mobile only, the header already shows it on desktop */}
      <div className="md:hidden flex flex-col items-center text-gray-900 dark:text-white drop-shadow-md pt-[8vh] sm:pt-[16vh] px-6">
        <img
          src="/logoTeran.svg"
          alt="Logo Hospital Veterinario Terán"
          className="h-[64px] sm:h-[85px] w-auto"
        />
        <div className="flex flex-col justify-center items-center mt-2">
          <span className="font-['Outfit'] font-black text-[40px] sm:text-[56px] tracking-tighter uppercase leading-none text-gray-900 dark:text-white drop-shadow-sm text-center">
            TERAN
          </span>
          <span className="font-['Outfit'] font-bold text-[14px] tracking-[0.09em] uppercase text-gray-700 dark:text-gray-300 leading-none mt-1.5 drop-shadow-sm text-center">
            Hospital Veterinario
          </span>
        </div>
      </div>

      {/* Media slot: allocates whatever height the lockup and the copy leave on
          the stacked layout, and is inert on md+ where the object leaves it. */}
      {media ? (
        <div
          data-hero-media-slot
          className="flex min-h-0 flex-1 items-center justify-center py-[2vh]"
        >
          {media}
        </div>
      ) : null}

      {/* Copy block: bottom-anchored on mobile and on desktop */}
      <div className="mt-auto flex flex-col px-6 pb-10 sm:pb-24 text-center md:pl-12 md:pb-16 md:items-start md:text-left md:max-w-xl">
        <h1 className="font-['Outfit'] font-black text-[32px] sm:text-[40px] md:text-6xl tracking-tighter leading-[0.95] text-gray-900 dark:text-white">
          {t('home.hero.title')}{' '}
          <span className="text-[#f4484a]">{t('home.hero.best_friend')}</span>
        </h1>

        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 font-light max-w-[34ch] mt-4">
          {t('home.hero.subtitle')}
        </p>

        <div className="pointer-events-auto flex flex-col items-center gap-4 sm:gap-5 mt-8 md:flex-row md:gap-7">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#0277ab] hover:bg-[#02688f] text-white rounded-full font-['Outfit'] font-bold text-[13px] tracking-widest uppercase shadow-[0_8px_24px_rgba(2,119,171,0.28)] transition-all hover:scale-105 active:scale-95"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            {t('home.hero.cta_primary')}
          </a>

          <Link
            to="/servicios"
            className="font-['Outfit'] font-bold text-[13px] tracking-widest uppercase text-[#0277ab] underline underline-offset-4 decoration-2 hover:text-[#f4484a] transition-colors"
          >
            {t('home.hero.cta')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HeroOverlay;
