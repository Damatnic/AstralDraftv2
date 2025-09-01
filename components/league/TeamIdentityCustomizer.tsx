/**
 * Team Identity & Customization System - Express team personality and style
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo, useState, useEffect } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { Palette, Crown, Music, Shirt, Image, Save, RefreshCw, Eye, Volume2 } from &apos;lucide-react&apos;;

interface TeamIdentity {
}
  teamId: string;
  teamName: string;
  motto: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logo: string;
  logoType: &apos;emoji&apos; | &apos;icon&apos; | &apos;upload&apos;;
  walkupSong: {
}
    name: string;
    artist: string;
    url?: string;
    duration: number;
  };
  endZoneCelebration: {
}
    name: string;
    animation: string;
    duration: number;
    particles: boolean;
  };
  jerseyDesign: {
}
    style: &apos;classic&apos; | &apos;modern&apos; | &apos;retro&apos; | &apos;futuristic&apos;;
    pattern: &apos;solid&apos; | &apos;gradient&apos; | &apos;stripes&apos; | &apos;spots&apos;;
  };
  teamPersonality: {
}
    style: &apos;aggressive&apos; | &apos;analytical&apos; | &apos;fun&apos; | &apos;underdog&apos; | &apos;professional&apos;;
    traits: string[];
  };
  customBanner: {
}
    text: string;
    background: string;
    animation: string;
  };

interface TeamIdentityCustomizerProps {
}
  teamId: string;
  currentIdentity?: TeamIdentity;
  onSave: (identity: TeamIdentity) => void;
  onPreview: (identity: TeamIdentity) => void;

}

const TeamIdentityCustomizer: React.FC<TeamIdentityCustomizerProps> = ({
}
  teamId,
  currentIdentity,
  onSave,
//   onPreview
}: any) => {
}
  const [identity, setIdentity] = useState<TeamIdentity>(currentIdentity || {
}
    teamId,
    teamName: &apos;&apos;,
    motto: &apos;&apos;,
    primaryColor: &apos;#3b82f6&apos;,
    secondaryColor: &apos;#1e40af&apos;,
    accentColor: &apos;#fbbf24&apos;,
    logo: &apos;⚡&apos;,
    logoType: &apos;emoji&apos;,
    walkupSong: {
}
      name: &apos;Eye of the Tiger&apos;,
      artist: &apos;Survivor&apos;,
      duration: 30
    },
    endZoneCelebration: {
}
      name: &apos;Victory Dance&apos;,
      animation: &apos;bounce&apos;,
      duration: 3000,
      particles: true
    },
    jerseyDesign: {
}
      style: &apos;modern&apos;,
      pattern: &apos;gradient&apos;
    },
    teamPersonality: {
}
      style: &apos;aggressive&apos;,
      traits: [&apos;Competitive&apos;, &apos;Bold&apos;, &apos;Confident&apos;]
    },
    customBanner: {
}
      text: &apos;CHAMPIONS&apos;,
      background: &apos;gradient&apos;,
      animation: &apos;pulse&apos;

  });

  const [activeTab, setActiveTab] = useState<&apos;colors&apos; | &apos;logo&apos; | &apos;audio&apos; | &apos;celebration&apos; | &apos;jersey&apos; | &apos;personality&apos;>(&apos;colors&apos;);
  const [previewMode, setPreviewMode] = useState(false);

  // Color presets for different team personalities
  const colorPresets = {
}
    aggressive: [
      { name: &apos;Fire&apos;, primary: &apos;#dc2626&apos;, secondary: &apos;#991b1b&apos;, accent: &apos;#fbbf24&apos; },
      { name: &apos;Thunder&apos;, primary: &apos;#7c3aed&apos;, secondary: &apos;#5b21b6&apos;, accent: &apos;#a78bfa&apos; },
      { name: &apos;Storm&apos;, primary: &apos;#1f2937&apos;, secondary: &apos;#111827&apos;, accent: &apos;#6b7280&apos; }
    ],
    analytical: [
      { name: &apos;Tech Blue&apos;, primary: &apos;#3b82f6&apos;, secondary: &apos;#1e40af&apos;, accent: &apos;#60a5fa&apos; },
      { name: &apos;Data Green&apos;, primary: &apos;#10b981&apos;, secondary: &apos;#047857&apos;, accent: &apos;#34d399&apos; },
      { name: &apos;Precision&apos;, primary: &apos;#6366f1&apos;, secondary: &apos;#4338ca&apos;, accent: &apos;#a5b4fc&apos; }
    ],
    fun: [
      { name: &apos;Tropical&apos;, primary: &apos;#f59e0b&apos;, secondary: &apos;#d97706&apos;, accent: &apos;#fde047&apos; },
      { name: &apos;Neon&apos;, primary: &apos;#ec4899&apos;, secondary: &apos;#be185d&apos;, accent: &apos;#f9a8d4&apos; },
      { name: &apos;Rainbow&apos;, primary: &apos;#8b5cf6&apos;, secondary: &apos;#7c3aed&apos;, accent: &apos;#c4b5fd&apos; }
    ],
    underdog: [
      { name: &apos;Gritty&apos;, primary: &apos;#78716c&apos;, secondary: &apos;#57534e&apos;, accent: &apos;#a8a29e&apos; },
      { name: &apos;Determined&apos;, primary: &apos;#0f766e&apos;, secondary: &apos;#0d9488&apos;, accent: &apos;#5eead4&apos; },
      { name: &apos;Scrappy&apos;, primary: &apos;#b45309&apos;, secondary: &apos;#92400e&apos;, accent: &apos;#fde68a&apos; }
    ],
    professional: [
      { name: &apos;Corporate&apos;, primary: &apos;#1f2937&apos;, secondary: &apos;#111827&apos;, accent: &apos;#3b82f6&apos; },
      { name: &apos;Executive&apos;, primary: &apos;#374151&apos;, secondary: &apos;#1f2937&apos;, accent: &apos;#10b981&apos; },
      { name: &apos;Elite&apos;, primary: &apos;#581c87&apos;, secondary: &apos;#4c1d95&apos;, accent: &apos;#c4b5fd&apos; }

  };

  // Logo options
  const logoEmojis = [&apos;⚡&apos;, &apos;🔥&apos;, &apos;👑&apos;, &apos;🏆&apos;, &apos;🦅&apos;, &apos;🦁&apos;, &apos;⚔️&apos;, &apos;🛡️&apos;, &apos;💎&apos;, &apos;🎯&apos;, &apos;🚀&apos;, &apos;💀&apos;, &apos;👹&apos;, &apos;🐺&apos;, &apos;🐉&apos;];
  
  // Walk-up songs library
  const walkupSongs = [
    { name: &apos;Eye of the Tiger&apos;, artist: &apos;Survivor&apos;, duration: 30 },
    { name: &apos;We Will Rock You&apos;, artist: &apos;Queen&apos;, duration: 25 },
    { name: &apos;Thunderstruck&apos;, artist: &apos;AC/DC&apos;, duration: 30 },
    { name: &apos;Enter Sandman&apos;, artist: &apos;Metallica&apos;, duration: 35 },
    { name: &apos;Lose Yourself&apos;, artist: &apos;Eminem&apos;, duration: 30 },
    { name: &apos;Can\&apos;t Hold Us&apos;, artist: &apos;Macklemore&apos;, duration: 28 },
    { name: &apos;Till I Collapse&apos;, artist: &apos;Eminem&apos;, duration: 32 },
    { name: &apos;Remember the Name&apos;, artist: &apos;Fort Minor&apos;, duration: 30 },
    { name: &apos;Pump It&apos;, artist: &apos;Black Eyed Peas&apos;, duration: 25 },
    { name: &apos;All Star&apos;, artist: &apos;Smash Mouth&apos;, duration: 30 }
  ];

  // Celebration options
  const celebrations = [
    { name: &apos;Victory Dance&apos;, animation: &apos;bounce&apos;, duration: 3000, particles: true },
    { name: &apos;Championship Stomp&apos;, animation: &apos;shake&apos;, duration: 2500, particles: false },
    { name: &apos;End Zone Spike&apos;, animation: &apos;fadeInUp&apos;, duration: 2000, particles: true },
    { name: &apos;Crown Ceremony&apos;, animation: &apos;rotateIn&apos;, duration: 4000, particles: true },
    { name: &apos;Fireworks Show&apos;, animation: &apos;zoomIn&apos;, duration: 5000, particles: true },
    { name: &apos;Victory Lap&apos;, animation: &apos;slideInRight&apos;, duration: 3500, particles: false }
  ];

  // Team personality traits
  const personalityTraits = {
}
    aggressive: [&apos;Competitive&apos;, &apos;Bold&apos;, &apos;Fearless&apos;, &apos;Dominant&apos;, &apos;Ruthless&apos;, &apos;Intense&apos;],
    analytical: [&apos;Strategic&apos;, &apos;Data-driven&apos;, &apos;Methodical&apos;, &apos;Calculated&apos;, &apos;Precise&apos;, &apos;Logical&apos;],
    fun: [&apos;Entertaining&apos;, &apos;Creative&apos;, &apos;Playful&apos;, &apos;Energetic&apos;, &apos;Colorful&apos;, &apos;Spontaneous&apos;],
    underdog: [&apos;Resilient&apos;, &apos;Determined&apos;, &apos;Scrappy&apos;, &apos;Hardworking&apos;, &apos;Gritty&apos;, &apos;Persistent&apos;],
    professional: [&apos;Disciplined&apos;, &apos;Organized&apos;, &apos;Consistent&apos;, &apos;Elite&apos;, &apos;Refined&apos;, &apos;Focused&apos;]
  };

  const updateIdentity = (updates: Partial<TeamIdentity>) => {
}
    const newIdentity = { ...identity, ...updates };
    setIdentity(newIdentity);
    onPreview(newIdentity);
  };

  const handleColorPreset = (preset: typeof colorPresets.aggressive[0]) => {
}
    updateIdentity({
}
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent
    });
  };

  const toggleTrait = (trait: string) => {
}
    const currentTraits = identity.teamPersonality.traits;
    const newTraits = currentTraits.includes(trait)
      ? currentTraits.filter((t: any) => t !== trait)
      : [...currentTraits, trait].slice(0, 5); // Max 5 traits
    
    updateIdentity({
}
      teamPersonality: {
}
        ...identity.teamPersonality,
        traits: newTraits

    });
  };

  const renderColorTab = () => (
    <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
      {/* Color Presets */}
      <div>
        <h4 className="font-semibold text-white mb-3 sm:px-4 md:px-6 lg:px-8">Quick Presets</h4>
        <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
          {Object.entries(colorPresets).map(([style, presets]) => (
}
            <div key={style} className="space-y-2 sm:px-4 md:px-6 lg:px-8">
              <div className="text-sm text-gray-400 capitalize sm:px-4 md:px-6 lg:px-8">{style} Style</div>
              <div className="grid grid-cols-3 gap-2 sm:px-4 md:px-6 lg:px-8">
                {presets.map((preset: any) => (
}
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
}
            <button
              key={emoji}
              onClick={() => updateIdentity({ logo: emoji, logoType: &apos;emoji&apos; }}
              className={`p-3 text-2xl rounded-lg border transition-colors ${
}
                identity.logo === emoji
                  ? &apos;border-primary-500 bg-primary-500/20&apos;
                  : &apos;border-gray-600 hover:border-gray-500&apos;
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
}
            <button
              key={`${song.name}-${song.artist}`}
              onClick={() => updateIdentity({ walkupSong: song }}
              className={`w-full p-3 rounded-lg border transition-colors text-left ${
}
                identity.walkupSong.name === song.name
                  ? &apos;border-primary-500 bg-primary-500/20&apos;
                  : &apos;border-gray-600 hover:border-gray-500&apos;
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
}
            <button
              key={celebration.name}
              onClick={() => updateIdentity({ endZoneCelebration: celebration }}
              className={`p-4 rounded-lg border transition-colors text-left ${
}
                identity.endZoneCelebration.name === celebration.name
                  ? &apos;border-primary-500 bg-primary-500/20&apos;
                  : &apos;border-gray-600 hover:border-gray-500&apos;
              }`}
            >
              <div className="font-semibold text-white sm:px-4 md:px-6 lg:px-8">{celebration.name}</div>
              <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
                {celebration.duration / 1000}s • {celebration.particles ? &apos;With particles&apos; : &apos;Clean animation&apos;}
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
}
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
}
            <button
              key={style}
              onClick={() = aria-label="Action button"> updateIdentity({ 
}
                teamPersonality: {
}
                  style, 
                  traits: personalityTraits[style].slice(0, 3) 

              })}
              className={`p-3 rounded-lg border transition-colors ${
}
                identity.teamPersonality.style === style
                  ? &apos;border-primary-500 bg-primary-500/20&apos;
                  : &apos;border-gray-600 hover:border-gray-500&apos;
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
}
            <button
              key={trait}
              onClick={() => toggleTrait(trait)}`}
            >
              {trait}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
}
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );

  return (
    <div className="bg-dark-800 rounded-xl p-6 border border-gray-700 sm:px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
          <Palette className="w-6 h-6 text-purple-400 sm:px-4 md:px-6 lg:px-8" />
          <div>
            <h2 className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Team Identity Studio</h2>
            <p className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Express your team&apos;s unique personality</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
          <button
            onClick={() => setPreviewMode(!previewMode)}`}
          >
            <Eye className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
            {previewMode ? &apos;Exit Preview&apos; : &apos;Preview&apos;}
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
}
              { id: &apos;colors&apos;, label: &apos;Colors&apos;, icon: Palette },
              { id: &apos;logo&apos;, label: &apos;Logo & Motto&apos;, icon: Crown },
              { id: &apos;audio&apos;, label: &apos;Walk-up Song&apos;, icon: Music },
              { id: &apos;celebration&apos;, label: &apos;Celebrations&apos;, icon: Crown },
              { id: &apos;personality&apos;, label: &apos;Personality&apos;, icon: Shirt }
            ].map((tab: any) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}`}
              >
                <tab.icon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-dark-700 rounded-lg p-6 sm:px-4 md:px-6 lg:px-8">
            {activeTab === &apos;colors&apos; && renderColorTab()}
            {activeTab === &apos;logo&apos; && renderLogoTab()}
            {activeTab === &apos;audio&apos; && renderAudioTab()}
            {activeTab === &apos;celebration&apos; && renderCelebrationTab()}
            {activeTab === &apos;personality&apos; && renderPersonalityTab()}
          </div>
        </div>

        {/* Live Preview */}
        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
          {/* Team Card Preview */}
          <div 
            className="p-6 rounded-xl border-2 transition-all sm:px-4 md:px-6 lg:px-8"
            style={{
}
              backgroundColor: `${identity.primaryColor}10`,
              borderColor: identity.primaryColor,
              background: `linear-gradient(135deg, ${identity.primaryColor}20, ${identity.secondaryColor}20)`
            }}
          >
            <div className="text-center space-y-3 sm:px-4 md:px-6 lg:px-8">
              <div className="text-4xl sm:px-4 md:px-6 lg:px-8">{identity.logo}</div>
              <div>
                <h3 className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">{identity.teamName || &apos;Team Name&apos;}</h3>
                <p className="text-sm italic sm:px-4 md:px-6 lg:px-8" style={{ color: identity.accentColor }}>
                  "{identity.motto || &apos;Your motto here&apos;}"
                </p>
              </div>
              
              {/* Team Traits */}
              <div className="flex flex-wrap gap-1 justify-center sm:px-4 md:px-6 lg:px-8">
                {identity.teamPersonality.traits.slice(0, 3).map((trait: any) => (
}
                  <span 
                    key={trait}
                    className="px-2 py-1 rounded-full text-xs font-semibold sm:px-4 md:px-6 lg:px-8"
                    style={{ 
}
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
              <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Banner: "{identity.customBanner.text || &apos;VICTORY!&apos;}"</div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Mode Overlay */}
      <AnimatePresence>
        {previewMode && (
}
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
                <h1 className="text-6xl font-bold text-white mb-4 sm:px-4 md:px-6 lg:px-8">{identity.teamName || &apos;TEAM NAME&apos;}</h1>
                <p 
                  className="text-2xl font-bold mb-6 sm:px-4 md:px-6 lg:px-8"
                  style={{ color: identity.accentColor }}
                >
                  "{identity.motto || &apos;YOUR MOTTO HERE&apos;}"
                </p>
                <div 
                  className="text-4xl font-bold px-8 py-4 rounded-lg animate-pulse sm:px-4 md:px-6 lg:px-8"
                  style={{ 
}
                    backgroundColor: `${identity.primaryColor}30`,
                    border: `2px solid ${identity.accentColor}`
                  }}
                >
                  {identity.customBanner.text || &apos;VICTORY!&apos;}
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