/**
 * Plays a subtle celebratory sound when users get questions correct or earn MP
 * Uses Web Audio API to create pleasant, non-annoying sound effects
 */
export const playCelebratorySound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Play a gentle, pleasant chime sequence
    const playTone = (frequency: number, duration: number, delay: number, type: OscillatorType = 'sine') => {
      setTimeout(() => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = type;
        
        // Gentle volume with smooth attack and decay
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      }, delay);
    };

    // Simple pleasant ascending chime - not overwhelming
    playTone(523.25, 0.3, 0); // C5 - gentle start
    playTone(659.25, 0.4, 150); // E5 - pleasant middle
    playTone(783.99, 0.5, 250); // G5 - satisfying resolution

  } catch (error) {
    // Silently fail if audio is not supported or blocked
    console.log('Audio not supported or blocked:', error);
  }
};

/**
 * Plays a more elaborate MP reward chime for significant achievements
 */
export const playMPRewardChime = (amount: number) => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const playTone = (frequency: number, duration: number, delay: number, volume: number = 0.12) => {
      setTimeout(() => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      }, delay);
    };

    if (amount >= 500) {
      // Big achievement - fuller chord progression
      playTone(523.25, 0.4, 0, 0.15); // C5
      playTone(659.25, 0.5, 100, 0.12); // E5
      playTone(783.99, 0.6, 200, 0.14); // G5
      playTone(1046.50, 0.7, 300, 0.16); // C6 - triumphant high note
    } else if (amount >= 100) {
      // Medium achievement - rich harmony
      playTone(523.25, 0.4, 0); // C5
      playTone(659.25, 0.5, 120); // E5  
      playTone(783.99, 0.6, 240); // G5
      playTone(880.00, 0.5, 360); // A5
    } else {
      // Standard achievement - simple but satisfying
      playTone(523.25, 0.3, 0); // C5
      playTone(659.25, 0.4, 150); // E5
      playTone(783.99, 0.5, 250); // G5
    }

  } catch (error) {
    console.log('Audio not supported or blocked:', error);
  }
};