
import { useAppState } from '../contexts/AppContext';
import { Widget } from '../components/ui/Widget';
import { UserIcon } from '../components/icons/UserIcon';
import { Avatar } from '../components/ui/Avatar';
import { PencilIcon } from '../components/icons/PencilIcon';
import { AnimatePresence } from 'framer-motion';
import EditProfileModal from '../components/core/EditProfileModal';
import { BookOpenIcon } from '../components/icons/BookOpenIcon';
import { calculateManagerStats, calculateCareerHistory } from '../utils/careerStats';
import AchievementsWidget from '../components/profile/AchievementsWidget';
import { LogOutIcon } from '../components/icons/LogOutIcon';

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }: any) => (
    <div className="bg-white/5 p-3 rounded-lg text-center">
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
    </div>
);

const ProfileView: React.FC = () => {
    const { state, dispatch } = useAppState();
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

    const stats = React.useMemo(() => {
        return state.user ? calculateManagerStats(state.user, state.leagues) : { championships: 0, leaguesJoined: 0 };
    }, [state.leagues, state.user]);

    const careerHistory = React.useMemo(() => {
        return state.user ? calculateCareerHistory(state.user?.id, state.leagues) : [];
    }, [state.leagues, state.user]);

    const memberSinceDate = state.user?.memberSince
        ? new Date(state.user.memberSince).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
        : 'a long time ago';
    
    // Early return if no user
    if (!state.user) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-gray-400 mb-4">Please log in to view your profile</p>
                    <button
                        onClick={() => dispatch({ type: 'SET_VIEW', payload: 'AUTH' })}
                        className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Navigation Header */}
            <div className="nav-header">
                <div className="flex justify-between items-center">
                    <h1>Manager Profile</h1>
                    <button 
                        onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })} 
                        className="back-btn"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4">
                <main className="w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column */}
                        <div className="lg:col-span-1 space-y-6">
                            <Widget title="Identity" icon={<UserIcon />}>
                                <div className="p-4 flex flex-col items-center text-center">
                                    <Avatar avatar={state.user.avatar} className="w-28 h-28 text-7xl rounded-full mb-4 ring-4 ring-cyan-400/50" />
                                    <h2 className="text-2xl font-bold font-display">{state.user.name}</h2>
                                    <p className="text-xs text-secondary">Member since {memberSinceDate}</p>
                                    <p className="text-sm text-secondary mt-3 italic">"{state.user.bio || 'No bio set.'}"</p>
                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={() => setIsEditModalOpen(true)}
                                        >
                                            <PencilIcon />
                                            Edit Profile
                                        </button>
                                         <button
                                            onClick={() => dispatch({ type: 'LOGOUT' })}
                                            className="btn btn-danger flex items-center gap-2 text-xs"
                                        >
                                            <LogOutIcon />
//                                             Logout
                                        </button>
                                    </div>
                                </div>
                            </Widget>
                            <Widget title="Career Stats">
                                <div className="p-4 grid grid-cols-2 gap-4">
                                    <div className="stat-item">
                                        <div className="stat-value text-2xl">{stats.championships}</div>
                                        <div className="stat-label">Championships</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-value text-2xl">{stats.leaguesJoined}</div>
                                        <div className="stat-label">Leagues Joined</div>
                                    </div>
                                </div>
                            </Widget>
                            <AchievementsWidget badges={state.user.badges || []} />
                        </div>

                        {/* Right Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <Widget title="League History" icon={<BookOpenIcon />}>
                                 <div className="p-4 space-y-3">
                                    {careerHistory.map((entry: any) => {
                                        const league = state.leagues.find((l: any) => l.id === entry.leagueId);
                                        return (
                                            <div key={entry.key} className="bg-slate-700/30 p-3 rounded-lg flex items-center justify-between hover:bg-slate-600/30 transition-colors">
                                                <div>
                                                    <p className="font-bold text-white">{entry.season} Season - <span className="text-cyan-300">{entry.leagueName}</span></p>
                                                    {entry.isComplete ? (
                                                        <p className="text-sm text-secondary">
                                                            Finished <span className="font-bold">{entry.rank}</span> / {league?.teams.length} ({entry.record.wins}-{entry.record.losses}-{entry.record.ties})
                                                            {entry.isChampion && <span className="ml-2">🏆</span>}
                                                        </p>
                                                    ) : (
                                                        <p className="text-sm text-secondary">Current Record: {entry.record.wins}-{entry.record.losses}-{entry.record.ties} (Rank {entry.rank})</p>
                                                    )}
                                                </div>
                                                <button 
                                                    onClick={() => {
                                                        dispatch({type: 'SET_ACTIVE_LEAGUE', payload: entry.leagueId});
                                                        if (entry.isComplete) {
                                                            dispatch({type: 'SET_SEASON_REVIEW_YEAR', payload: entry.season});
                                                            dispatch({type: 'SET_VIEW', payload: 'SEASON_REVIEW'});
                                                        } else {
                                                            dispatch({type: 'SET_VIEW', payload: 'LEAGUE_HUB'});
                                                        }
                                                    }}
                                                    className="btn btn-secondary text-xs"
                                                >
                                                    {entry.isComplete ? 'Season Review' : 'Go to Hub'}
                                                </button>
                                            </div>
                                        )
                                    })}
                                    {careerHistory.length === 0 && <p className="text-sm text-center text-muted py-4">No league history yet. Complete a season!</p>}
                                </div>
                            </Widget>
                        </div>
                    </div>
                </main>
                
                <AnimatePresence>
                    {isEditModalOpen && state.user && (
                        <EditProfileModal user={state.user} dispatch={dispatch} onClose={() => setIsEditModalOpen(false)} />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ProfileView;
