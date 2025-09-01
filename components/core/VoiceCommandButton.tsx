

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;
import { MicrophoneIcon } from &apos;../icons/MicrophoneIcon&apos;;
import { players } from &apos;../../data/players&apos;;
import type { Player } from &apos;../../types&apos;;

// Web Speech API might be vendor-prefixed
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const speak = (text: string) => {
}
    if (&apos;speechSynthesis&apos; in window) {
}
        try {
}

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.1;
            utterance.pitch = 0.9;
            window.speechSynthesis.speak(utterance);

    } catch (error) {
}


};

const VoiceCommandButton: React.FC = () => {
}
    const { state, dispatch } = useAppState();
    const [isListening, setIsListening] = React.useState(false);
    const [transcript, setTranscript] = React.useState(&apos;&apos;);
    const recognitionRef = React.useRef<any>(null);

    const processCommand = (command: string) => {
}
        const lowerCaseCommand = command.toLowerCase();
        
        if (lowerCaseCommand.includes(&apos;go to dashboard&apos;)) {
}
            dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;DASHBOARD&apos; });
            speak("Navigating to Dashboard");
        } else if (lowerCaseCommand.includes(&apos;show my team&apos;) || lowerCaseCommand.includes(&apos;go to my team&apos;)) {
}
            if(state.activeLeagueId) {
}
                dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;TEAM_HUB&apos; });
                speak("Navigating to your Team Hub");
            } else {
}
                speak("Please select a league first");

        } else if (lowerCaseCommand.includes(&apos;open command palette&apos;)) {
}
            dispatch({ type: &apos;SET_COMMAND_PALETTE_OPEN&apos;, payload: true });
            speak("Opening Command Palette");
        } else if (lowerCaseCommand.startsWith(&apos;search for&apos;) || lowerCaseCommand.startsWith(&apos;look up&apos;)) {
}
            const playerName = lowerCaseCommand.replace(&apos;search for&apos;, &apos;&apos;).replace(&apos;look up&apos;, &apos;&apos;).trim();
            const foundPlayer = players.find((p: any) => p.name.toLowerCase() === playerName);
            if(foundPlayer) {
}
                dispatch({ type: &apos;SET_PLAYER_DETAIL&apos;, payload: { player: foundPlayer } });
                speak(`Showing details for ${foundPlayer.name}`);
            } else {
}
                 speak(`Sorry, I could not find a player named ${playerName}`);

        } else {
}
            speak(`I didn&apos;t recognize that command.`);

    };

    const handleListen = () => {
}
        if (!SpeechRecognition) {
}
            dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: &apos;Voice commands not supported by this browser.&apos;, type: &apos;SYSTEM&apos; }});
            speak("Sorry, voice commands are not supported on this browser.");
            return;

        if (isListening) {
}
            recognitionRef.current?.stop();
            return;

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = &apos;en-US&apos;;

        recognition.onstart = () => {
}
            setIsListening(true);
            setTranscript(&apos;&apos;);
        };

        recognition.onend = () => {
}
            setIsListening(false);
        };

        recognition.onerror = (event: any) => {
}
            speak(`Voice error: ${event.error}`);
        };

        recognition.onresult = (event: any) => {
}
            const currentTranscript = Array.from(event.results)
                .map((result: any) => result[0])
                .map((result: any) => result.transcript)
                .join(&apos;&apos;);
            
            setTranscript(currentTranscript);

            if (event.results[0].isFinal) {
}
                processCommand(currentTranscript);

        };

        recognition.start();
    };

    return (
        <>
            <motion.button
                onClick={handleListen}
                className={`fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-colors
}
                    ${isListening ? &apos;bg-red-500&apos; : &apos;bg-gradient-to-r from-cyan-500 to-blue-600&apos;}`

                aria-label={isListening ? &apos;Stop listening&apos; : &apos;Start voice command&apos;}
                {...{
}
                    whileHover: { scale: 1.1 },
                    whileTap: { scale: 0.9 },
                }}
            >
                {isListening && (
}
                    <motion.div
                        className="absolute inset-0 border-4 border-red-300 rounded-full sm:px-4 md:px-6 lg:px-8"
                        {...{
}
                            animate: {
}
                                scale: [1, 1.3, 1],
                                opacity: [0.5, 1, 0.5]
                            },
                            transition: {
}
                                repeat: Infinity,
                                duration: 1.5,
                                ease: "easeInOut"
                            },
                        }}
                    />
                )}
                <MicrophoneIcon className="h-8 w-8 sm:px-4 md:px-6 lg:px-8" />
            </motion.button>
            <AnimatePresence>
                {isListening && (
}
                    <motion.div
                        className="fixed bottom-24 right-6 z-40 p-4 bg-gray-900/80 backdrop-blur-md rounded-lg shadow-xl text-white max-w-sm sm:px-4 md:px-6 lg:px-8"
                        {...{
}
                            initial: { opacity: 0, y: 10 },
                            animate: { opacity: 1, y: 0 },
                            exit: { opacity: 0, y: 10 },
                        }}
                    >
                        <p className="text-sm font-semibold mb-1 sm:px-4 md:px-6 lg:px-8">Listening...</p>
                        <p className="text-lg min-h-[1.75rem] sm:px-4 md:px-6 lg:px-8">{transcript || &apos;...&apos;}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

const VoiceCommandButtonWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <VoiceCommandButton {...props} />
  </ErrorBoundary>
);

export default React.memo(VoiceCommandButtonWithErrorBoundary);