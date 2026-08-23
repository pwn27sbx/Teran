import { useEffect } from 'react';

export function useDarkMode() {
  // Efecto para forzar siempre el modo claro y limpiar localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }, []);

  return { isDark: false, toggleDark: () => {} };
}
