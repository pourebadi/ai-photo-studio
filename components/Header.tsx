import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';

interface HeaderProps {
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
}

const Header: React.FC<HeaderProps> = ({ theme, setTheme }) => {
  return (
    <header className="flex-shrink-0 w-full p-3 bg-[var(--background)] border-b border-[var(--border)]">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
           <span className="material-icons-round text-3xl text-[var(--primary)]">auto_fix_high</span>
          <h1 className="text-lg md:text-xl font-bold text-[var(--foreground)]">
            AI Photo <span className="text-[var(--primary)]">Studio</span>
          </h1>
        </div>
        <ThemeSwitcher theme={theme} setTheme={setTheme} />
      </div>
    </header>
  );
};

export default Header;