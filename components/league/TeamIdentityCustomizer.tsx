/**
 * Team Identity & Customization System - Express team personality and style
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Crown, Music, Shirt, Image, Save, RefreshCw, Eye, Volume2 } from 'lucide-react';

interface TeamIdentity {
  teamId: string;
  teamName: string;
  motto: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logo: string;
  logoType: 'emoji' | 'icon' | 'upload';
  walkupSong: {
    name: string;
    artist: string;
    url?: string;
    duration: number;
  };
  endZoneCelebration: {
    name: string;
    animation: string;
    duration: number;
    particles: boolean;
  };
  jerseyDesign: {
    style: 'classic' | 'modern' | 'retro' | 'futuristic';
    pattern: 'solid' | 'gradient' | 'stripes' | 'spots';
  };
  teamPersonality: {
    style: 'aggressive' | 'analytical' | 'fun' | 'underdog' | 'professional';
    traits: string[];
  };
  customBanner: {
    text: string;
    background: string;
    animation: string;
  };
}

interface TeamIdentityCustomizerProps {
  teamId: string;
  currentIdentity?: TeamIdentity;
  onSave: (identity: TeamIdentity) => void;
  onPreview: (identity: TeamIdentity) => void;
}

const TeamIdentityCustomizer: React.FC<TeamIdentityCustomizerProps> = ({
  teamId,
  currentIdentity,
  onSave,
//   onPreview
}: any) => {
  const [identity, setIdentity] = useState<TeamIdentity>(currentIdentity || {
    teamId,
    teamName: '',
    motto: '',
    primaryColor: '#3b82f6',
    secondaryColor: '#1e40af',
    accentColor: '#fbbf24',
    logo: '⚡',
    logoType: 'emoji',
    walkupSong: {
      name: 'Eye of the Tiger',
      artist: 'Survivor',
      duration: 30
    },
    endZoneCelebration: {
      name: 'Victory Dance',
      animation: 'bounce',
      duration: 3000,
      particles: true
    },
    jerseyDesign: {
      style: 'modern',
      pattern: 'gradient'
    },
    teamPersonality: {
      style: 'aggressive',
      traits: ['Competitive', 'Bold', 'Confident']
    },
    customBanner: {
      text: 'CHAMPIONS',
      background: 'gradient',
      animation: 'pulse'
    }
  });

  const [activeTab, setActiveTab] = useState<'colors' | 'logo' | 'audio' | 'celebration' | 'jersey' | 'personality'>('colors');
  const [previewMode, setPreviewMode] = useState(false);

  // Color presets for different team personalities
  const colorPresets = {
    aggressive: [
      { name: 'Fire', primary: '#dc2626', secondary: '#991b1b', accent: '#fbbf24' },
      { name: 'Thunder', primary: '#7c3aed', secondary: '#5b21b6', accent: '#a78bfa' },
      { name: 'Storm', primary: '#1f2937', secondary: '#111827', accent: '#6b7280' }
    ],
    analytical: [
      { name: 'Tech Blue', primary: '#3b82f6', secondary: '#1e40af', accent: '#60a5fa' },
      { name: 'Data Green', primary: '#10b981', secondary: '#047857', accent: '#34d399' },
      { name: 'Precision', primary: '#6366f1', secondary: '#4338ca', accent: '#a5b4fc' }
    ],
    fun: [
      { name: 'Tropical', primary: '#f59e0b', secondary: '#d97706', accent: '#fde047' },
      { name: 'Neon', primary: '#ec4899', secondary: '#be185d', accent: '#f9a8d4' },
      { name: 'Rainbow', primary: '#8b5cf6', secondary: '#7c3aed', accent: '#c4b5fd' }
    ],
    underdog: [
      { name: 'Gritty', primary: '#78716c', secondary: '#57534e', accent: '#a8a29e' },
      { name: 'Determined', primary: '#0f766e', secondary: '#0d9488', accent: '#5eead4' },
      { name: 'Scrappy', primary: '#b45309', secondary: '#92400e', accent: '#fde68a' }
    ],
    professional: [
      { name: 'Corporate', primary: '#1f2937', secondary: '#111827', accent: '#3b82f6' },
      { name: 'Executive', primary: '#374151', secondary: '#1f2937', accent: '#10b981' },
      { name: 'Elite', primary: '#581c87', secondary: '#4c1d95', accent: '#c4b5fd' }
    ]
  };

  // Logo options
  const logoEmojis = ['⚡', '🔥', '👑', '🏆', '🦅', '🦁', '⚔️', '🛡️', '💎', '🎯', '🚀', '💀', '👹', '🐺', '🐉'];
  
  // Walk-up songs library
  const walkupSongs = [
    { name: 'Eye of the Tiger', artist: 'Survivor', duration: 30 },
    { name: 'We Will Rock You', artist: 'Queen', duration: 25 },
    { name: 'Thunderstruck', artist: 'AC/DC', duration: 30 },
    { name: 'Enter Sandman', artist: 'Metallica', duration: 35 },
    { name: 'Lose Yourself', artist: 'Eminem', duration: 30 },
    { name: 'Can\'t Hold Us', artist: 'Macklemore', duration: 28 },
    { name: 'Till I Collapse', artist: 'Eminem', duration: 32 },
    { name: 'Remember the Name', artist: 'Fort Minor', duration: 30 },
    { name: 'Pump It', artist: 'Black Eyed Peas', duration: 25 },
    { name: 'All Star', artist: 'Smash Mouth', duration: 30 }
  ];

  // Celebration options
  const celebrations = [
    { name: 'Victory Dance', animation: 'bounce', duration: 3000, particles: true },
    { name: 'Championship Stomp', animation: 'shake', duration: 2500, particles: false },
    { name: 'End Zone Spike', animation: 'fadeInUp', duration: 2000, particles: true },
    { name: 'Crown Ceremony', animation: 'rotateIn', duration: 4000, particles: true },
    { name: 'Fireworks Show', animation: 'zoomIn', duration: 5000, particles: true },
    { name: 'Victory Lap', animation: 'slideInRight', duration: 3500, particles: false }
  ];

  // Team personality traits
  const personalityTraits = {
    aggressive: ['Competitive', 'Bold', 'Fearless', 'Dominant', 'Ruthless', 'Intense'],
    analytical: ['Strategic', 'Data-driven', 'Methodical', 'Calculated', 'Precise', 'Logical'],
    fun: ['Entertaining', 'Creative', 'Playful', 'Energetic', 'Colorful', 'Spontaneous'],
    underdog: ['Resilient', 'Determined', 'Scrappy', 'Hardworking', 'Gritty', 'Persistent'],
    professional: ['Disciplined', 'Organized', 'Consistent', 'Elite', 'Refined', 'Focused']
  };

  const updateIdentity = (updates: Partial<TeamIdentity>) => {
    const newIdentity = { ...identity, ...updates };
    setIdentity(newIdentity);
    onPreview(newIdentity);
  };

  const handleColorPreset = (preset: typeof colorPresets.aggressive[0]) => {
    updateIdentity({
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent
    });
  };

  const toggleTrait = (trait: string) => {
    const currentTraits = identity.teamPersonality.traits;
    const newTraits = currentTraits.includes(trait)
      ? currentTraits.filter((t: any) => t !== trait)
      : [...currentTraits, trait].slice(0, 5); // Max 5 traits
    
    updateIdentity({
      teamPersonality: {
        ...identity.teamPersonality,
        traits: newTraits
      }
    });
  };

  const renderColorTab = () => (
    <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
      {/* Color Presets */}
      <div>
        <h4 className="font-semibold text-white mb-3 sm:px-4 md:px-6 lg:px-8">Quick Presets</h4>
        <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
          {Object.entries(colorPresets).map(([style, presets]) => (
            <div key={style} className="space-y-2 sm:px-4 md:px-6 lg:px-8">
              <div className="text-sm text-gray-400 capitalize sm:px-4 md:px-6 lg:px-8">{style} Style</div>
              <div className="grid grid-cols-3 gap-2 sm:px-4 md:px-6 lg:px-8">
                {presets.map((preset: any) => (
                  <button
                    key={preset.name}
                    onClick={() => handleColorPreset(preset)}
                  >
                    <div className="flex gap-1 mb-2 sm:px-4 md:px-6 lg:px-8">
                      <div className="w-4 h-4 rounded sm:px-4 md:px-6 lg:px-8" style={{ backgroundColor: preset.primary }}></div>
                      <div className="w-4 h-4 rounded sm:px-4 md:px-6 lg:px-8" style={{ backgroundColor: preset.secondary }}></div>
                      <div className="w-4 h-4 rounded sm:px-4 md:px-6 lg:px-8" style={{ backgroundColor: preset.accent }}></div>
                    </div>
                    <div className="text-xs text-gray-300 sm:px-4 md:px-6 lg:px-8">{preset.name}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div>
        <h4 className="font-semibold text-white mb-3 sm:px-4 md:px-6 lg:px-8">Custom Colors</h4>
        <div className="grid grid-cols-3 gap-4 sm:px-4 md:px-6 lg:px-8">
          <div>
            <label className="block text-sm text-gray-400 mb-2 sm:px-4 md:px-6 lg:px-8">Primary</label>
            <input
              type="color"
              value={identity.primaryColor}
              onChange={(e: any) => updateIdentity({ primaryColor: e.target.value }}
              className="w-full h-10 rounded border border-gray-600 sm:px-4 md:px-6 lg:px-8"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2 sm:px-4 md:px-6 lg:px-8">Secondary</label>
            <input
              type="color"
              value={identity.secondaryColor}
              onChange={(e: any) => updateIdentity({ secondaryColor: e.target.value }}
              className="w-full h-10 rounded border border-gray-600 sm:px-4 md:px-6 lg:px-8"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2 sm:px-4 md:px-6 lg:px-8">Accent</label>
            <input
              type="color"
              value={identity.accentColor}
              onChange={(e: any) => updateIdentity({ accentColor: e.target.value }}
              className="w-full h-10 rounded border border-gray-600 sm:px-4 md:px-6 lg:px-8"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderLogoTab = () => (
    <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
      <div>
        <h4 className="font-semibold text-white mb-3 sm:px-4 md:px-6 lg:px-8">Team Logo</h4>
        <div className="grid grid-cols-8 gap-2 sm:px-4 md:px-6 lg:px-8">
          {logoEmojis.map((emoji: any) => (
            <button
              key={emoji}
              onClick={() => updateIdentity({ logo: emoji, logoType: 'emoji' }}
              className={`p-3 text-2xl rounded-lg border transition-colors ${
                identity.logo === emoji
                  ? 'border-primary-500 bg-primary-500/20'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-white mb-3 sm:px-4 md:px-6 lg:px-8">Team Motto</h4>
        <input
          type="text"
          value={identity.motto}
          onChange={(e: any) => updateIdentity({ motto: e.target.value }}
          placeholder="Enter your team motto..."
          className="w-full bg-dark-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 sm:px-4 md:px-6 lg:px-8"
          maxLength={50}
        />
        <div className="text-xs text-gray-500 mt-1 sm:px-4 md:px-6 lg:px-8">{identity.motto.length}/50 characters</div>
      </div>
    </div>
  );

  const renderAudioTab = () => (
    <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
      <div>
        <h4 className="font-semibold text-white mb-3 sm:px-4 md:px-6 lg:px-8">Walk-up Song</h4>
        <div className="space-y-2 max-h-60 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
          {walkupSongs.map((song: any) => (
            <button
              key={`${song.name}-${song.artist}`}
              onClick={() => updateIdentity({ walkupSong: song }}
              className={`w-full p-3 rounded-lg border transition-colors text-left ${
                identity.walkupSong.name === song.name
                  ? 'border-primary-500 bg-primary-500/20'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="font-semibold text-white sm:px-4 md:px-6 lg:px-8">{song.name}</div>
              <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">{song.artist} • {song.duration}s</div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-dark-700 rounded-lg sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-2 sm:px-4 md:px-6 lg:px-8">
          <Volume2 className="w-4 h-4 text-primary-400 sm:px-4 md:px-6 lg:px-8" />
          <span className="font-semibold text-primary-400 sm:px-4 md:px-6 lg:px-8">Selected Song</span>
        </div>
        <div className="text-white sm:px-4 md:px-6 lg:px-8">{identity.walkupSong.name}</div>
        <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">{identity.walkupSong.artist}</div>
      </div>
    </div>
  );

  const renderCelebrationTab = () => (
    <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
      <div>
        <h4 className="font-semibold text-white mb-3 sm:px-4 md:px-6 lg:px-8">Victory Celebration</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {celebrations.map((celebration: any) => (
            <button
              key={celebration.name}
              onClick={() => updateIdentity({ endZoneCelebration: celebration }}
              className={`p-4 rounded-lg border transition-colors text-left ${
                identity.endZoneCelebration.name === celebration.name
                  ? 'border-primary-500 bg-primary-500/20'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="font-semibold text-white sm:px-4 md:px-6 lg:px-8">{celebration.name}</div>
              <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
                {celebration.duration / 1000}s • {celebration.particles ? 'With particles' : 'Clean animation'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Banner */}
      <div>
        <h4 className="font-semibold text-white mb-3 sm:px-4 md:px-6 lg:px-8">Victory Banner</h4>
        <input
          type="text"
          value={identity.customBanner.text}
          onChange={(e: any) => updateIdentity({ 
            customBanner: { ...identity.customBanner, text: e.target.value }})}
          placeholder="Victory message..."
          className="w-full bg-dark-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 sm:px-4 md:px-6 lg:px-8"
          maxLength={20}
        />
      </div>
    </div>
  );

  const renderPersonalityTab = () => (
    <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
      <div>
        <h4 className="font-semibold text-white mb-3 sm:px-4 md:px-6 lg:px-8">Team Personality</h4>
        <div className="grid grid-cols-5 gap-2 sm:px-4 md:px-6 lg:px-8">
          {(Object.keys(personalityTraits) as Array<keyof typeof personalityTraits>).map((style: any) => (
            <button
              key={style}
              onClick={() => updateIdentity({ 
                teamPersonality: {
                  style, 
                  traits: personalityTraits[style].slice(0, 3)
                }
              })}
              className={`p-3 rounded-lg border transition-colors ${
                identity.teamPersonality.style === style
                  ? 'border-primary-500 bg-primary-500/20'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="text-sm font-semibold text-white capitalize sm:px-4 md:px-6 lg:px-8">{style}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-white mb-3 sm:px-4 md:px-6 lg:px-8">
          Team Traits 
          <span className="text-sm text-gray-400 ml-2 sm:px-4 md:px-6 lg:px-8">({identity.teamPersonality.traits.length}/5)</span>
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {personalityTraits[identity.teamPersonality.style].map((trait: any) => (
            <button
              key={trait}
              onClick={() => toggleTrait(trait)}
              className={`p-2 rounded-lg border transition-colors ${
                identity.teamPersonality.traits.includes(trait)
                  ? 'border-primary-500 bg-primary-500/20'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              {trait}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Loading state removed - assuming it's defined elsewhere in the component

  return (
    <div className="bg-dark-800 rounded-xl p-6 border border-gray-700 sm:px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
          <Palette className="w-6 h-6 text-purple-400 sm:px-4 md:px-6 lg:px-8" />
          <div>
            <h2 className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Team Identity Studio</h2>
            <p className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Express your team's unique personality</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              previewMode ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <Eye className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
            {previewMode ? 'Exit Preview' : 'Preview'}
          </button>
          <button
            onClick={() => onSave(identity)}
          >
            <Save className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customization Panel */}
        <div className="lg:col-span-2">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 sm:px-4 md:px-6 lg:px-8">
            {[
              { id: 'colors', label: 'Colors', icon: Palette },
              { id: 'logo', label: 'Logo & Motto', icon: Crown },
              { id: 'audio', label: 'Walk-up Song', icon: Music },
              { id: 'celebration', label: 'Celebrations', icon: Crown },
              { id: 'personality', label: 'Personality', icon: Shirt }
            ].map((tab: any) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <tab.icon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-dark-700 rounded-lg p-6 sm:px-4 md:px-6 lg:px-8">
            {activeTab === 'colors' && renderColorTab()}
            {activeTab === 'logo' && renderLogoTab()}
            {activeTab === 'audio' && renderAudioTab()}
            {activeTab === 'celebration' && renderCelebrationTab()}
            {activeTab === 'personality' && renderPersonalityTab()}
          </div>
        </div>

        {/* Live Preview */}
        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
          {/* Team Card Preview */}
          <div 
            className="p-6 rounded-xl border-2 transition-all sm:px-4 md:px-6 lg:px-8"
            style={{
              backgroundColor: `${identity.primaryColor}10`,
              borderColor: identity.primaryColor,
              background: `linear-gradient(135deg, ${identity.primaryColor}20, ${identity.secondaryColor}20)`
            }}
          >
            <div className="text-center space-y-3 sm:px-4 md:px-6 lg:px-8">
              <div className="text-4xl sm:px-4 md:px-6 lg:px-8">{identity.logo}</div>
              <div>
                <h3 className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">{identity.teamName || 'Team Name'}</h3>
                <p className="text-sm italic sm:px-4 md:px-6 lg:px-8" style={{ color: identity.accentColor }}>
                  "{identity.motto || 'Your motto here'}"
                </p>
              </div>
              
              {/* Team Traits */}
              <div className="flex flex-wrap gap-1 justify-center sm:px-4 md:px-6 lg:px-8">
                {identity.teamPersonality.traits.slice(0, 3).map((trait: any) => (
                  <span 
                    key={trait}
                    className="px-2 py-1 rounded-full text-xs font-semibold sm:px-4 md:px-6 lg:px-8"
                    style={{ 
                      backgroundColor: `${identity.accentColor}30`,
                      color: identity.accentColor 
                    }}
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div className="bg-dark-700 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
            <h4 className="font-semibold text-white mb-3 sm:px-4 md:px-6 lg:px-8">Color Palette</h4>
            <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
              <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                <div className="w-6 h-6 rounded sm:px-4 md:px-6 lg:px-8" style={{ backgroundColor: identity.primaryColor }}></div>
                <span className="text-sm text-gray-300 sm:px-4 md:px-6 lg:px-8">Primary: {identity.primaryColor}</span>
              </div>
              <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                <div className="w-6 h-6 rounded sm:px-4 md:px-6 lg:px-8" style={{ backgroundColor: identity.secondaryColor }}></div>
                <span className="text-sm text-gray-300 sm:px-4 md:px-6 lg:px-8">Secondary: {identity.secondaryColor}</span>
              </div>
              <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                <div className="w-6 h-6 rounded sm:px-4 md:px-6 lg:px-8" style={{ backgroundColor: identity.accentColor }}></div>
                <span className="text-sm text-gray-300 sm:px-4 md:px-6 lg:px-8">Accent: {identity.accentColor}</span>
              </div>
            </div>
          </div>

          {/* Audio Preview */}
          <div className="bg-dark-700 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
            <h4 className="font-semibold text-white mb-3 sm:px-4 md:px-6 lg:px-8">Walk-up Song</h4>
            <div className="space-y-1 sm:px-4 md:px-6 lg:px-8">
              <div className="text-sm font-medium text-white sm:px-4 md:px-6 lg:px-8">{identity.walkupSong.name}</div>
              <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">{identity.walkupSong.artist}</div>
              <div className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">{identity.walkupSong.duration} seconds</div>
            </div>
          </div>

          {/* Celebration Preview */}
          <div className="bg-dark-700 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
            <h4 className="font-semibold text-white mb-3 sm:px-4 md:px-6 lg:px-8">Victory Setup</h4>
            <div className="space-y-2 text-sm sm:px-4 md:px-6 lg:px-8">
              <div className="text-white sm:px-4 md:px-6 lg:px-8">Celebration: {identity.endZoneCelebration.name}</div>
              <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Duration: {identity.endZoneCelebration.duration / 1000}s</div>
              <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Banner: "{identity.customBanner.text || 'VICTORY!'}"</div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Mode Overlay */}
      <AnimatePresence>
        {previewMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[1100] sm:px-4 md:px-6 lg:px-8"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="text-center space-y-6 sm:px-4 md:px-6 lg:px-8"
            >
              <div className="text-8xl animate-bounce sm:px-4 md:px-6 lg:px-8">{identity.logo}</div>
              <div>
                <h1 className="text-6xl font-bold text-white mb-4 sm:px-4 md:px-6 lg:px-8">{identity.teamName || 'TEAM NAME'}</h1>
                <p 
                  className="text-2xl font-bold mb-6 sm:px-4 md:px-6 lg:px-8"
                  style={{ color: identity.accentColor }}
                >
                  "{identity.motto || 'YOUR MOTTO HERE'}"
                </p>
                <div 
                  className="text-4xl font-bold px-8 py-4 rounded-lg animate-pulse sm:px-4 md:px-6 lg:px-8"
                  style={{ 
                    backgroundColor: `${identity.primaryColor}30`,
                    border: `2px solid ${identity.accentColor}`
                  }}
                >
                  {identity.customBanner.text || 'VICTORY!'}
                </div>
              </div>
              
              <button
                onClick={() => setPreviewMode(false)}
              >
                Exit Preview
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TeamIdentityCustomizerWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <TeamIdentityCustomizer {...props} />
  </ErrorBoundary>
);

export default React.memo(TeamIdentityCustomizerWithErrorBoundary);