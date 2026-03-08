import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import './ThemeToggle.css';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
            title={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
        >
            {/* Icono de Sol (visible en modo claro) */}
            <Sun
                className={`theme-icon sun-icon ${theme === 'light' ? 'visible' : 'hidden'}`}
                size={22}
                strokeWidth={1.5}
            />

            {/* Icono de Luna (visible en modo oscuro) */}
            <Moon
                className={`theme-icon moon-icon ${theme === 'dark' ? 'visible' : 'hidden'}`}
                size={22}
                strokeWidth={1.5}
            />
        </button>
    );
}
