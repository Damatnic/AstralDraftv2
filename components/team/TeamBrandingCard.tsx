
import { ErrorBoundary } from '../ui/ErrorBoundary';
import React from 'react';
import type { Team } from '../../types';
import { Avatar } from '../ui/Avatar';

interface TeamBrandingCardProps {
    team: Team;
    slogan: string;

}

const TeamBrandingCard: React.FC<TeamBrandingCardProps> = ({ team, slogan }) => {
    const { name, avatar, record } = team;
    return (
        <div className="w-full max-w-sm aspect-[2/1] bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 flex flex-col justify-between shadow-lg border border-cyan-400/30 relative overflow-hidden sm:px-4 md:px-6 lg:px-8">
            {/* Background Glow */}
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-radial from-cyan-500/10 via-transparent to-transparent animate-pulse sm:px-4 md:px-6 lg:px-8"></div>
            
            <div className="flex justify-between items-start sm:px-4 md:px-6 lg:px-8">
                <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                    <h3 className="font-display text-2xl font-bold text-white leading-tight sm:px-4 md:px-6 lg:px-8">{name}</h3>
                    <p className="font-mono text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">{record.wins}-{record.losses}-{record.ties}</p>
                </div>
                 <Avatar avatar={avatar} className="w-16 h-16 text-4xl rounded-lg flex-shrink-0 sm:px-4 md:px-6 lg:px-8" />
            </div>
            <div className="text-center sm:px-4 md:px-6 lg:px-8">
                 <p className="font-display text-lg italic text-cyan-200 sm:px-4 md:px-6 lg:px-8">"{slogan}"</p>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">
                <span className="font-display font-bold sm:px-4 md:px-6 lg:px-8">ASTRAL DRAFT</span>
                <span>{new Date().getFullYear()} Season</span>
            </div>
        </div>
    );
};

const TeamBrandingCardWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <TeamBrandingCard {...props} />
  </ErrorBoundary>
);

export default React.memo(TeamBrandingCardWithErrorBoundary);