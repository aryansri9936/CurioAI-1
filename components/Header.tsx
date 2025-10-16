
import React from 'react';
import { LogoIcon, MoonIcon, SunIcon } from './icons';

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md">
      <div className="flex items-center gap-2">
        <LogoIcon className="h-8 w-8 text-indigo-500" />
        <span className="text-xl font-bold text-gray-800 dark:text-gray-200">BeyondChats Study</span>
      </div>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
      </button>
    </header>
  );
};
