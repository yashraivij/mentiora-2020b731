/**
 * Plays a subtle celebratory sound when users get questions correct
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
 * Plays MP reward chimes with different tones based on the reward amount
 */
export const playMPRewardChime = (amount: number) => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const playTone = (frequency: number, duration: number, delay: number, type: OscillatorType = 'sine') => {
      setTimeout(() => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = type;
        
        // Gentle volume
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.12, audioContext.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      }, delay);
    };

    // Different chimes based on MP amount
    if (amount >= 500) {
      // Epic streak reward - grand ascending progression
      playTone(523.25, 0.2, 0); // C5
      playTone(659.25, 0.2, 100); // E5  
      playTone(783.99, 0.2, 200); // G5
      playTone(1046.50, 0.4, 300); // C6 - victorious finish
    } else if (amount >= 250) {
      // Major weekly challenge - triumphant sequence
      playTone(659.25, 0.25, 0); // E5
      playTone(783.99, 0.25, 120); // G5
      playTone(932.33, 0.35, 220); // A#5 - celebratory peak
    } else if (amount >= 100) {
      // Weekly bonus - satisfying progression
      playTone(523.25, 0.3, 0); // C5
      playTone(698.46, 0.35, 140); // F5 - uplifting conclusion
    } else if (amount >= 40) {
      // Practice completion - encouraging single chime
      playTone(659.25, 0.4, 0); // E5 - warm and positive
    } else {
      // Daily login - gentle acknowledgment
      playTone(523.25, 0.3, 0); // C5 - friendly and brief
    }

  } catch (error) {
    console.log('Audio not supported or blocked:', error);
  }
};