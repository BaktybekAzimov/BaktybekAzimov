import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors duration-200 group"
      aria-label="Toggle theme"
      title={theme === 'light' ? 'Переключить на темную тему' : 'Переключить на светлую тему'}
    >
      <div className="relative w-5 h-5">
        {/* Sun icon */}
        <Sun
          className={`absolute inset-0 w-5 h-5 text-warning-500 transition-all duration-300 ${
            theme === 'light'
              ? 'rotate-0 scale-100 opacity-100'
              : 'rotate-90 scale-0 opacity-0'
          }`}
        />
        {/* Moon icon */}
        <Moon
          className={`absolute inset-0 w-5 h-5 text-primary-400 transition-all duration-300 ${
            theme === 'dark'
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>
    </button>
  );
};
