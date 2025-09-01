
import { SunIcon } from &apos;../icons/SunIcon&apos;;
import { MoonIcon } from &apos;../icons/MoonIcon&apos;;

interface ThemeToggleProps {
}
    theme: &apos;dark&apos; | &apos;light&apos;;
    dispatch: React.Dispatch<any>;

}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, dispatch }: any) => {
}
    return (
        <button
            onClick={() => dispatch({ type: &apos;TOGGLE_THEME&apos; })}
            className="p-2 rounded-full bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors sm:px-4 md:px-6 lg:px-8"
            aria-label={`Switch to ${theme === &apos;dark&apos; ? &apos;light&apos; : &apos;dark&apos;} mode`}
        >
            {theme === &apos;dark&apos; ? <SunIcon /> : <MoonIcon />}
        </button>
    );
};
