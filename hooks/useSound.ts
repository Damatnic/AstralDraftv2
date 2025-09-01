
import { useAppState } from &apos;../contexts/AppContext&apos;;

// Data URLs for simple placeholder sounds
const sounds = {
}
    notification: &apos;data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAABhZ2FzAAAAAAAAAAAAAABoYXJtAAAAADAAAAAJAAAAGgAAAAEAAgAUAAAAZGF0YV9vT18AAAAABgAAABcAMgA0ADoAOwA+AD4APQA8ADgANQAyAC8ALQApACUALgAuAC4ALgAsACcAJgAjACAAGgAXABEADQAHAAIAAAA=&apos;,
    draft: &apos;data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAABhZ2FzAAAAAAAAAAAAAABoYXJtAAAAADAAAAAJAAAAGgAAAAEAAgAUAAAAZGF0YV9vT18AAAAABgAAAE4AVQBTAD0AMgAqACIAFgAIAAQAPwA/AD8APQA2ACwAJgAgABUADQAFAAAA&apos;,
    bid: &apos;data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAABhZ2FzAAAAAAAAAAAAAABoYXJtAAAAADAAAAAJAAAAGgAAAAEAAgAUAAAAZGF0YV9vT18AAAAABgAAABMAHgAjACgAKgAmACIAHAAXABEACQADAAAA&apos;,
    yourTurn: &apos;data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAABhZ2FzAAAAAAAAAAAAAABoYXJtAAAAADAAAAAJAAAAGgAAAAEAAgAUAAAAZGF0YV9vT18AAAAABgAAACUANgA9AD0AMwArACIAFwAOAAQAPgA/AD8APgA5AC0AJgAfABYADQAFAAAA&apos;,
    sold: &apos;data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAABhZ2FzAAAAAAAAAAAAAABoYXJtAAAAADAAAAAJAAAAGgAAAAEAAgAUAAAAZGF0YV9vT18AAAAABgAAAEIAVwBeAFsAUgBGADoALgAiABUACQABAAA=&apos;,
    tradeOffer: &apos;data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAABhZ2FzAAAAAAAAAAAAAABoYXJtAAAAADAAAAAJAAAAGgAAAAEAAgAUAAAAZGF0YV9vT18AAAAABgAAADMARgBOAFQASgA/ADAAJgAbABMADgAFAAACAAAA&apos;,
    hover: &apos;data:audio/wav;base64,UklGRkFvT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAABhZ2FzAAAAAAAAAAAAAABoYXJtAAAAADAAAAAJAAAAGgAAAAEAAgAUAAAAZGF0YVpvT18AAAAABQAAAP8A/wD/AP8A/w==&apos;,
    openModal: &apos;data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAABhZ2FzAAAAAAAAAAAAAABoYXJtAAAAADAAAAAJAAAAGgAAAAEAAgAUAAAAZGF0YV9vT18AAAAABgAAABcAMgA0ADoAOwA+AD4APQA8ADgANQAyAC8ALQApACUALgAuAC4ALgAsACcAJgAjACAAGgAXABEADQAHAAIAAAA=&apos;,
    closeModal: &apos;data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAABhZ2FzAAAAAAAAAAAAAABoYXJtAAAAADAAAAAJAAAAGgAAAAEAAgAUAAAAZGF0YV9vT18AAAAABgAAAD4APAA4ADMANgA5ADwAPQA9ADoANgAyACwAJgAgABcAEQAMAAcAAgAAAA==&apos;,
    tab: &apos;data:audio/wav;base64,UklGRkFvT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAABhZ2FzAAAAAAAAAAAAAABoYXJtAAAAADAAAAAJAAAAGgAAAAEAAgAUAAAAZGF0YVpvT18AAAAABQAAACAAIAAgACAAIA==&apos;
};

type SoundType = keyof typeof sounds;

const audioCache: { [key in SoundType]?: HTMLAudioElement } = {};

const useSound = (soundType: SoundType, volume: number = 0.5): (() => void) => {
}
    const { state } = useAppState();

    const play = React.useCallback(() => {
}
        if (!state.soundEnabled || !state.isAudioUnlocked) {
}
            return;
        }

        try {
}

            if (!audioCache[soundType]) {
}
                audioCache[soundType] = new Audio(sounds[soundType]);
            }
            const audio = audioCache[soundType]!;
            audio.volume = volume;
            
            // Allow playing the sound again even if it&apos;s already playing
            audio.currentTime = 0;
            audio.play().catch(e => console.error("Error playing sound:", e));

    } catch (error) {
}
        console.error(error);
    } catch (e) {
}
            console.error("Could not play sound", e);
        }
    }, [soundType, volume, state.soundEnabled, state.isAudioUnlocked]);

    return play;
};

export default useSound;
