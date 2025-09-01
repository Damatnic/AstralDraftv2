
import React from 'react';
import { SunIcon } from '../icons/SunIcon';
import { MoonIcon } from '../icons/MoonIcon';

interface ThemeToggleProps {
    theme: 'dark' | 'light';
    dispatch: React.Dispatch<any>;

}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, dispatch }: any) => {
    return (
        <button
            onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
            className="p-2 rounded-full bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors sm:px-4 md:px-6 lg:px-8"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
    );
};
