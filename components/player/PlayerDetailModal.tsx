
import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback } from &apos;react&apos;;
import { AnimatePresence } from &apos;framer-motion&apos;;
import type { Player, PlayerNote, League } from &apos;../../types&apos;;
import { Modal } from &apos;../ui/Modal&apos;;
import { Tabs } from &apos;../ui/Tabs&apos;;
import OverviewTab from &apos;./tabs/OverviewTab&apos;;
import ScoutingTab from &apos;./tabs/ScoutingTab&apos;;
import FantasyTab from &apos;./tabs/FantasyTab&apos;;
import IntelligenceTab from &apos;./tabs/IntelligenceTab&apos;;
import { generatePlayerInsight, generatePlayerAvatar } from &apos;../../services/geminiService&apos;;
import { SparklesIcon } from &apos;../icons/SparklesIcon&apos;;
import { ShieldCheckIcon } from &apos;../icons/ShieldCheckIcon&apos;;
import SimilarPlayersPopup from &apos;./SimilarPlayersPopup&apos;;
import StoryTab from &apos;./tabs/StoryTab&apos;;
import ContractTab from &apos;./tabs/ContractTab&apos;;
import GameLogTab from &apos;./tabs/GameLogTab&apos;;
import { MicrophoneIcon } from &apos;../icons/MicrophoneIcon&apos;;
import { StopIcon } from &apos;../icons/StopIcon&apos;;
import { Trash2Icon } from &apos;../icons/Trash2Icon&apos;;
import { Avatar } from &apos;../ui/Avatar&apos;;

interface PlayerDetailModalProps {
}
  player: Player;
  onClose: () => void;
  playerNotes: { [playerId: number]: PlayerNote };
  dispatch: React.Dispatch<any>;
  initialTab?: string;
  league?: League | null;
  playerAvatars: { [playerId: number]: string };
}

const positionColor: Record<string, string> = {
}
    QB: &apos;from-red-500/30&apos;,
    RB: &apos;from-green-500/30&apos;,
    WR: &apos;from-blue-500/30&apos;,
    TE: &apos;from-orange-500/30&apos;,
    DST: &apos;from-purple-500/30&apos;,
    K: &apos;from-yellow-500/30&apos;
};

interface MyNotesTabProps {
}
    player: Player;
    note: PlayerNote | undefined;
    dispatch: React.Dispatch<any>;

}

const MyNotesTab: React.FC<MyNotesTabProps> = ({player, note, dispatch}: any) => {
}
    const [noteText, setNoteText] = React.useState(note?.text || &apos;&apos;);
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [isRecording, setIsRecording] = React.useState(false);
    const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
    const audioChunksRef = React.useRef<Blob[]>([]);

     React.useEffect(() => {
}
        setNoteText(note?.text || &apos;&apos;);
    }, [note?.text]);

    const handleSaveText = () => {
}
        dispatch({
}
            type: &apos;ADD_PLAYER_NOTE&apos;,
            payload: { playerId: player.id, note: noteText }
        });
        dispatch({
}
            type: &apos;ADD_NOTIFICATION&apos;,
            payload: { message: `Note for ${player.name} saved!`, type: &apos;SYSTEM&apos; }
        });
    };

    const handleGenerateInsight = async () => {
}
        try {
}
            setIsGenerating(true);
            const insight = await generatePlayerInsight(player);
            if (insight) {
}
                const newNote = noteText ? `${noteText}\n\n---\n🔮 Oracle&apos;s Insight:\n${insight}` : `🔮 Oracle&apos;s Insight:\n${insight}`;
                setNoteText(newNote);
            } else {
}
                dispatch({
}
                    type: &apos;ADD_NOTIFICATION&apos;,
                    payload: { message: `Could not generate insight for ${player.name}.`, type: &apos;SYSTEM&apos; }
                });
            }
        } catch (error) {
}
            dispatch({
}
                type: &apos;ADD_NOTIFICATION&apos;,
                payload: { message: `Could not generate insight for ${player.name}.`, type: &apos;SYSTEM&apos; }
            });
        } finally {
}
            setIsGenerating(false);
        }
    };
    
    const handleStartRecording = async () => {
}
        try {
}
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];
            
            mediaRecorderRef.current.ondataavailable = (event: any) => {
}
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
}
                const audioBlob = new Blob(audioChunksRef.current, { type: &apos;audio/webm&apos; });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = () => {
}
                    const base64data = reader.result as string;
                    dispatch({ type: &apos;ADD_PLAYER_AUDIO_NOTE&apos;, payload: { playerId: player.id, audioDataUrl: base64data } });
                     dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: `Audio note for ${player.name} saved.`, type: &apos;SYSTEM&apos; } });
                };
                 stream.getTracks().forEach((track: any) => track.stop());
            };
            
            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
}
            console.error(&apos;Recording error:&apos;, error);
        }
    };
    
    const handleStopRecording = () => {
}
        if (mediaRecorderRef.current) {
}
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
    };
    
    const handleDeleteAudio = () => {
}
        dispatch({ type: &apos;DELETE_PLAYER_AUDIO_NOTE&apos;, payload: { playerId: player.id }});
        dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: `Audio note for ${player.name} deleted.`, type: &apos;SYSTEM&apos; } });
    };

    return (
        <div>
            <h3 className="font-bold text-lg text-cyan-300 mb-2 sm:px-4 md:px-6 lg:px-8">My Private Notes</h3>
            <textarea 
                className="w-full h-32 p-2 bg-black/20 rounded-md border border-[var(--panel-border)] focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm sm:px-4 md:px-6 lg:px-8"
                placeholder={`Jot down your thoughts on ${player.name}...`}
                value={noteText}
                onChange={(e: any) => setNoteText(e.target.value)}
            />
            <div className="mt-2 flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                 <button 
                    onClick={handleGenerateInsight}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-3 py-1.5 bg-transparent border border-cyan-400/50 text-cyan-300 font-bold text-xs rounded-md hover:bg-cyan-400/20 disabled:opacity-50 disabled:cursor-wait sm:px-4 md:px-6 lg:px-8"
                    aria-label="Generate AI insight for player note"
                >
                    {isGenerating ? &apos;Generating...&apos; : <><SparklesIcon /> AI Insight</>}
                </button>
                <button 
                    onClick={handleSaveText}
                    disabled={isGenerating}
                    className="px-4 py-1.5 bg-cyan-500 text-black font-bold text-sm rounded-md hover:bg-cyan-400 disabled:opacity-50 sm:px-4 md:px-6 lg:px-8"
                    aria-label="Save player note"
                >
                    Save Note
                </button>
            </div>
             <div className="mt-4 pt-4 border-t border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                <h3 className="font-bold text-lg text-cyan-300 mb-2 sm:px-4 md:px-6 lg:px-8">Voice Memo</h3>
                {note?.audio ? (
}
                    <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        <audio src={note.audio} controls className="w-full h-10 sm:px-4 md:px-6 lg:px-8" />
                        <button onClick={handleDeleteAudio} className="p-2 bg-red-500/20 text-red-300 rounded-md hover:bg-red-500/30 sm:px-4 md:px-6 lg:px-8">
                            <Trash2Icon />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        <button 
                            onClick={isRecording ? handleStopRecording : handleStartRecording}
                            className={`px-4 py-2 text-sm font-bold rounded-md flex items-center gap-2 transition-colors ${isRecording ? &apos;bg-red-500 text-white&apos; : &apos;bg-blue-500 text-white&apos;}`}
                        >
                            {isRecording ? <><StopIcon /> Stop</> : <><MicrophoneIcon className="h-4 w-4 sm:px-4 md:px-6 lg:px-8" /> Record</>}
                        </button>
                         {isRecording && <p className="text-sm text-red-400 animate-pulse sm:px-4 md:px-6 lg:px-8">Recording...</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({ player, onClose, playerNotes, dispatch, initialTab = &apos;overview&apos;, league, playerAvatars }: any) => {
}
  const [isSimilarPlayersOpen, setIsSimilarPlayersOpen] = React.useState(false);
  
  const tabItems = [
    { id: &apos;overview&apos;, label: &apos;Overview&apos; },
    { id: &apos;scouting&apos;, label: &apos;Scouting&apos; },
    { id: &apos;fantasy&apos;, label: &apos;Fantasy&apos; },
    { id: &apos;game_log&apos;, label: &apos;Game Log&apos; },
    { id: &apos;contract&apos;, label: &apos;Contract&apos; },
    { id: &apos;intel&apos;, label: &apos;Astral Intel&apos; },
    { id: &apos;story&apos;, label: &apos;Story&apos; },
    { id: &apos;notes&apos;, label: &apos;My Notes&apos; },
  ];

  const [activeTab, setActiveTab] = React.useState(initialTab);
  
  const playerNote = playerNotes[player.id];
  const generatedAvatar = playerAvatars[player.id];

  const rosteredTeam = React.useMemo(() => {
}
    if (!league) return null;
    return league.teams.find((team: any) => team.roster.some((p: any) => p.id === player.id));
  }, [league, player.id]);
  
  React.useEffect(() => {
}
    setActiveTab(initialTab);
  }, [initialTab]);
  
  React.useEffect(() => {
}
    // Generate an AI avatar for the player if one doesn&apos;t exist
    if (!generatedAvatar) {
}
        generatePlayerAvatar(player).then(avatarUrl => {
}
            if(avatarUrl) {
}
                dispatch({ type: &apos;SET_PLAYER_AVATAR&apos;, payload: { playerId: player.id, avatarUrl } });
            }
        });
    }
  }, [player, generatedAvatar, dispatch]);

  return (
    <>
      <Modal isOpen={true} onClose={onClose}>
          <div className={`glass-pane bg-[var(--panel-bg)] backdrop-blur-xl border-[var(--panel-border)] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col`}>
              {/* Header */}
              <div className={`p-4 sm:p-6 border-b border-[var(--panel-border)] bg-gradient-to-br ${positionColor[player.position]} to-transparent flex items-start justify-between`}>
                  <div className="flex items-start gap-4 sm:px-4 md:px-6 lg:px-8">
                        <Avatar>
                           avatar={player.astralIntelligence?.spiritAnimal?.split(&apos;,&apos;)[0] || &apos;🏈&apos;}
                           generatedAvatarUrl={generatedAvatar}
                           className="w-24 h-24 text-6xl rounded-lg flex-shrink-0 sm:px-4 md:px-6 lg:px-8"
                           alt={player.name}
                        />
                        <div>
                            <p className="font-bold text-sm text-cyan-300 sm:px-4 md:px-6 lg:px-8">{player.position} / {player.team}</p>
                            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-wider">{player.name}</h2>
                        </div>
                  </div>
                  <div>
                      {rosteredTeam && (
}
                          <div className="flex items-center gap-2 px-3 py-1 bg-green-900/50 border border-green-400/30 rounded-full text-xs text-green-300 sm:px-4 md:px-6 lg:px-8">
                              <ShieldCheckIcon className="h-4 w-4 sm:px-4 md:px-6 lg:px-8" />
                              <span>Rostered by <strong>{rosteredTeam.name}</strong></span>
                          </div>
                      )}
                  </div>
              </div>

              {/* Tabs */}
              <div className="flex-shrink-0 px-4 sm:px-6 border-b border-[var(--panel-border)] overflow-x-auto">
                  <Tabs items={tabItems} activeTab={activeTab} onTabChange={setActiveTab} />
              </div>

              {/* Content */}
              <div className="flex-grow p-4 sm:p-6 overflow-y-auto">
                  <AnimatePresence mode="wait">
                      <div key={activeTab}>
                          {activeTab === &apos;overview&apos; && <OverviewTab player={player} onFindSimilar={() => setIsSimilarPlayersOpen(true)} />}
                          {activeTab === &apos;scouting&apos; && <ScoutingTab player={player} />}
                          {activeTab === &apos;fantasy&apos; && league && <FantasyTab player={player} league={league} dispatch={dispatch} />}
                          {activeTab === &apos;game_log&apos; && <GameLogTab player={player} />}
                          {activeTab === &apos;contract&apos; && <ContractTab player={player} />}
                          {activeTab === &apos;intel&apos; && <IntelligenceTab player={player} />}
                          {activeTab === &apos;story&apos; && league && <StoryTab player={player} league={league} />}
                          {activeTab === &apos;notes&apos; && <MyNotesTab player={player} note={playerNote} dispatch={dispatch} />}
                      </div>
                  </AnimatePresence>
              </div>
          </div>
      </Modal>
      <AnimatePresence>
        {isSimilarPlayersOpen && (
}
            <SimilarPlayersPopup>
                playerToCompare={player}
                onClose={() => setIsSimilarPlayersOpen(false)}
            />
        )}
      </AnimatePresence>
    </>
  );
};

const PlayerDetailModalWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <PlayerDetailModal {...props} />
  </ErrorBoundary>
);

export default React.memo(PlayerDetailModalWithErrorBoundary);
