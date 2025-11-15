// Tutor voice player utility
// Uses Web Audio API for short voice line playback

let audioContext: AudioContext | null = null;
let lastPlayTime = 0;
const MIN_PLAY_INTERVAL = 1000; // Throttle to prevent rapid replays

const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Generate simple synthetic voice-like tones as placeholders
// In production, replace with actual voice recordings
const generateVoiceTone = async (
  tutorId: string,
  duration: number = 2000
): Promise<AudioBuffer> => {
  const ctx = initAudioContext();
  const sampleRate = ctx.sampleRate;
  const numSamples = (sampleRate * duration) / 1000;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const channelData = buffer.getChannelData(0);

  // Different frequency profiles for each tutor personality
  const voiceProfiles: Record<string, { baseFreq: number; variation: number }> = {
    ava: { baseFreq: 320, variation: 20 }, // Calm, soft female voice
    lucas: { baseFreq: 180, variation: 15 }, // Confident male voice
    'dr-rivera': { baseFreq: 280, variation: 10 }, // Mature female voice
    jayden: { baseFreq: 220, variation: 30 }, // Energetic male voice
  };

  const profile = voiceProfiles[tutorId] || voiceProfiles.ava;

  // Generate audio samples with frequency modulation
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const freq = profile.baseFreq + Math.sin(t * 3) * profile.variation;
    const envelope = Math.exp(-t * 1.5); // Fade out
    channelData[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.3;
  }

  return buffer;
};

export const playTutorVoice = async (tutorId: string): Promise<void> => {
  const now = Date.now();
  
  // Throttle rapid calls
  if (now - lastPlayTime < MIN_PLAY_INTERVAL) {
    return;
  }
  
  lastPlayTime = now;

  try {
    const ctx = initAudioContext();
    
    // Resume context if suspended (needed for user interaction requirement)
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    // Generate voice tone
    const buffer = await generateVoiceTone(tutorId);
    
    // Create source and play
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    
    // Add slight reverb for warmth
    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.5;
    
    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    source.start(0);
    
  } catch (error) {
    console.log('Voice playback not available:', error);
  }
};

// Preload/warm up audio context
export const initTutorVoiceSystem = () => {
  try {
    initAudioContext();
  } catch (error) {
    console.log('Audio context initialization failed:', error);
  }
};

// Voice lines for each tutor (for display purposes)
export const TUTOR_VOICE_LINES: Record<string, string> = {
  ava: "We take this step by step. No rush, no pressure — just progress.",
  lucas: "Tell me your deadline, and we'll crush it. No fluff.",
  'dr-rivera': "You'll understand the why, not just the answer.",
  jayden: "Alright — let's make this fun and beat procrastination together.",
};
