

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;
import { motion } from &apos;framer-motion&apos;;
import { Avatar } from &apos;../ui/Avatar&apos;;
import { LazyImage } from &apos;../ui/LazyImage&apos;;
import { MenuIcon } from &apos;../icons/MenuIcon&apos;;
import TeamSwitcher from &apos;../ui/TeamSwitcher&apos;;
import { MailIcon } from &apos;../icons/MailIcon&apos;;

const Header: React.FC = () => {
}
    const { state, dispatch } = useAppState();
    const { user } = state;

    const hasUnreadMessages = state.directMessages?.some((m: any) => m.toUserId === user?.id && !m.isRead);

    return (
        <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 glass-pane border-b-0 rounded-b-xl mx-auto max-w-7xl mt-4">
             <div className="flex items-center gap-2">
                <LazyImage>
                  src="/favicon.svg" 
                  alt="Astral Draft Logo" 
                  className="h-8 w-8"
                  loading="eager"
                />
                <h1 className="font-display text-xl font-bold tracking-wider text-white hidden sm:block">ASTRAL DRAFT</h1>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
                <TeamSwitcher />
                <button 
                    onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;MESSAGES&apos; })}
                    className="relative p-2 rounded-full hover:bg-white/10"
                    aria-label="Open messages"
                >
                    <MailIcon />
                    {hasUnreadMessages && <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-800"></div>}
                </button>
                <button 
                    onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;PROFILE&apos; })}
                    className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-white/10"
                >
                    <Avatar avatar={user?.avatar || &apos;/&apos;} className="w-8 h-8 text-lg rounded-full" />
                    <span className="font-semibold text-sm hidden sm:block">{user?.name || &apos;Guest&apos;}</span>
                </button>
                <button 
                    onClick={() => dispatch({ type: &apos;TOGGLE_MOBILE_NAV&apos; })}
                    className="sm:hidden p-2 rounded-full hover:bg-white/10"
                    aria-label="Open navigation menu"
                >
                    <MenuIcon />
                </button>
            </div>
        </header>
    );
};

const HeaderWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <Header {...props} />
  </ErrorBoundary>
);

export default React.memo(HeaderWithErrorBoundary);
