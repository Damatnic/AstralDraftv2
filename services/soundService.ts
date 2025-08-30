/**
 * Sound Service
 * Handles sound playback with graceful fallback for missing files
 */

class SoundService {
  private soundCache = new Map<string, HTMLAudioElement | null>();
  private soundEnabled = true;
  private fallbackSound: string | null = null;

  /**
   * Load a sound file with error handling
   */
  private async loadSound(path: string): Promise<HTMLAudioElement | null> {
    // Check cache first
    if (this.soundCache.has(path)) {
      return this.soundCache.get(path) || null;
    }

    try {
      const audio = new Audio(path);
      
      // Preload the audio
      audio.preload = 'auto';
      
      // Wait for the sound to be loadable
      await new Promise((resolve, reject) => {
        audio.addEventListener('canplaythrough', resolve, { once: true });
        audio.addEventListener('error', reject, { once: true });
        
        // Timeout after 3 seconds
        setTimeout(() => reject(new Error('Sound load timeout')), 3000);
      });

      // Cache the successfully loaded sound
      this.soundCache.set(path, audio);
      return audio;
    } catch (error) {
      console.warn(`Failed to load sound: ${path}`, error);
      // Cache null to prevent repeated failed attempts
      this.soundCache.set(path, null);
      return null;
    }
  }

  /**
   * Play a sound with fallback handling
   */
  async playSound(path: string, volume: number = 0.5): Promise<void> {
    if (!this.soundEnabled) {
      return;
    }

    try {
      // Try to load the requested sound
      let audio = await this.loadSound(path);
      
      // If the sound doesn't exist and we have a fallback, use it
      if (!audio && this.fallbackSound && path !== this.fallbackSound) {
        console.log(`Using fallback sound for ${path}`);
        audio = await this.loadSound(this.fallbackSound);
      }
      
      // If we have a valid audio element, play it
      if (audio) {
        // Clone the audio to allow multiple simultaneous plays
        const audioClone = audio.cloneNode() as HTMLAudioElement;
        audioClone.volume = Math.max(0, Math.min(1, volume));
        
        // Play and handle any errors
        await audioClone.play().catch(err => {
          console.warn('Sound playback failed:', err);
        });
      }
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }

  /**
   * Set a fallback sound to use when requested sounds are unavailable
   */
  setFallbackSound(path: string): void {
    this.fallbackSound = path;
  }

  /**
   * Enable or disable all sounds
   */
  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  /**
   * Check if sounds are enabled
   */
  isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  /**
   * Preload multiple sounds
   */
  async preloadSounds(paths: string[]): Promise<void> {
    await Promise.all(paths.map(path => this.loadSound(path)));
  }

  /**
   * Clear the sound cache
   */
  clearCache(): void {
    this.soundCache.clear();
  }

  /**
   * Get a list of available (successfully loaded) sounds
   */
  getAvailableSounds(): string[] {
    return Array.from(this.soundCache.entries())
      .filter(([_, audio]) => audio !== null)
      .map(([path, _]) => path);
  }
}

// Export singleton instance
export const soundService = new SoundService();

// Set up default sounds
soundService.preloadSounds([
  '/sounds/notification.mp3',
  '/sounds/trade.mp3',
  '/sounds/injury.mp3',
  '/sounds/score.mp3',
  '/sounds/critical.mp3',
  '/sounds/high-priority.mp3',
  '/sounds/oracle.mp3',
  '/sounds/draft-pick.mp3',
  '/sounds/draft-start.mp3',
  '/sounds/draft-turn.mp3'
]).catch(err => {
  console.log('Some sounds could not be preloaded:', err);
});

export default soundService;