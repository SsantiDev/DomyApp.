import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Intentar recuperar el tema guardado
    const savedTheme = localStorage.getItem('theme');
    
    // Si existe y es válido, usarlo
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    
    // Si no, detectar preferencia del sistema
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    
    return 'dark'; // Default
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remover la clase anterior (si usas clases) o atributo
    root.classList.remove('light', 'dark');
    
    // Aplicar el nuevo tema
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.setAttribute('data-theme', 'dark'); // O remover atributo si el default es dark sin atributo
    }

    // Guardar en localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
}
