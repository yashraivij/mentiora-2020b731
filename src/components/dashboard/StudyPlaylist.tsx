import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, Waves, Cloud, TreePine } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudyPlaylistProps {
  isUnlocked: boolean;
}

interface AudioTrack {
  name: string;
  duration: string;
  audioType: 'lofi' | 'nature' | 'whitenoise' | 'ambient';
}

const StudyPlaylist = ({ isUnlocked }: StudyPlaylistProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const audioSourcesRef = useRef<AudioNode[]>([]);
  const isGeneratingRef = useRef(false);

  const playlists = [
    {
      name: "Lo-Fi Study Beats",
      icon: Music,
      color: "from-purple-500 to-pink-500",
      audioType: 'lofi' as const,
      tracks: [
        { name: "Coffee Shop Vibes", duration: "4:12", audioType: 'lofi' as const },
        { name: "Rainy Day Focus", duration: "3:45", audioType: 'lofi' as const },
        { name: "Late Night Pages", duration: "4:01", audioType: 'lofi' as const }
      ]
    },
    {
      name: "Nature Sounds",
      icon: TreePine,
      color: "from-green-500 to-emerald-500",
      audioType: 'nature' as const,
      tracks: [
        { name: "Forest Rain", duration: "5:00", audioType: 'nature' as const },
        { name: "Ocean Waves", duration: "6:30", audioType: 'nature' as const },
        { name: "Mountain Stream", duration: "4:45", audioType: 'nature' as const },
        { name: "Birds & Breeze", duration: "5:15", audioType: 'nature' as const }
      ]
    },
    {
      name: "White Noise",
      icon: Waves,
      color: "from-blue-500 to-cyan-500",
      audioType: 'whitenoise' as const,
      tracks: [
        { name: "Brown Noise", duration: "10:00", audioType: 'whitenoise' as const },
        { name: "Pink Noise", duration: "10:00", audioType: 'whitenoise' as const },
        { name: "Fan Sounds", duration: "8:30", audioType: 'whitenoise' as const },
        { name: "Static Calm", duration: "10:00", audioType: 'whitenoise' as const }
      ]
    },
    {
      name: "Ambient Focus",
      icon: Cloud,
      color: "from-indigo-500 to-purple-500",
      audioType: 'ambient' as const,
      tracks: [
        { name: "Deep Space", duration: "7:20", audioType: 'ambient' as const },
        { name: "Ethereal Drones", duration: "6:45", audioType: 'ambient' as const },
        { name: "Minimal Synths", duration: "5:30", audioType: 'ambient' as const },
        { name: "Floating Pads", duration: "8:15", audioType: 'ambient' as const }
      ]
    }
  ];

  const [selectedPlaylist, setSelectedPlaylist] = useState(0);

  // Initialize Audio Context
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }
  };

  // Generate and manage audio
  const generateAudio = (audioType: 'lofi' | 'nature' | 'whitenoise' | 'ambient') => {
    if (isGeneratingRef.current) return;
    
    initAudioContext();
    if (!audioContextRef.current || !gainNodeRef.current) return;

    // Clear any existing audio sources
    audioSourcesRef.current.forEach(source => {
      try {
        if ('stop' in source) {
          (source as AudioBufferSourceNode | OscillatorNode).stop();
        }
      } catch (e) {
        // Source might already be stopped
      }
    });
    audioSourcesRef.current = [];
    
    isGeneratingRef.current = true;
    const ctx = audioContextRef.current;

    switch (audioType) {
      case 'lofi':
        // Enhanced lo-fi with multiple layers
        const lofiOsc1 = ctx.createOscillator();
        const lofiOsc2 = ctx.createOscillator();
        const lofiGain = ctx.createGain();
        const lofiFilter = ctx.createBiquadFilter();
        const lofiDelay = ctx.createDelay();
        const lofiDelayGain = ctx.createGain();
        
        lofiOsc1.type = 'triangle';
        lofiOsc2.type = 'sine';
        lofiOsc1.frequency.setValueAtTime(220, ctx.currentTime);
        lofiOsc2.frequency.setValueAtTime(110, ctx.currentTime);
        
        lofiFilter.type = 'lowpass';
        lofiFilter.frequency.setValueAtTime(1200, ctx.currentTime);
        lofiFilter.Q.setValueAtTime(2, ctx.currentTime);
        
        lofiDelay.delayTime.setValueAtTime(0.3, ctx.currentTime);
        lofiDelayGain.gain.setValueAtTime(0.3, ctx.currentTime);
        lofiGain.gain.setValueAtTime(0.08, ctx.currentTime);
        
        lofiOsc1.connect(lofiFilter);
        lofiOsc2.connect(lofiFilter);
        lofiFilter.connect(lofiGain);
        lofiFilter.connect(lofiDelay);
        lofiDelay.connect(lofiDelayGain);
        lofiDelayGain.connect(lofiGain);
        lofiGain.connect(gainNodeRef.current);
        
        lofiOsc1.start();
        lofiOsc2.start();
        audioSourcesRef.current.push(lofiOsc1, lofiOsc2);
        break;

      case 'nature':
        // Enhanced nature sounds with multiple frequency bands
        const bufferSize = 4 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
          const output = noiseBuffer.getChannelData(channel);
          for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * 0.5;
          }
        }
        
        const natureSource = ctx.createBufferSource();
        const lowPass = ctx.createBiquadFilter();
        const highPass = ctx.createBiquadFilter();
        const natureGain = ctx.createGain();
        
        natureSource.buffer = noiseBuffer;
        natureSource.loop = true;
        lowPass.type = 'lowpass';
        lowPass.frequency.setValueAtTime(2000, ctx.currentTime);
        highPass.type = 'highpass';
        highPass.frequency.setValueAtTime(200, ctx.currentTime);
        natureGain.gain.setValueAtTime(0.06, ctx.currentTime);
        
        natureSource.connect(highPass);
        highPass.connect(lowPass);
        lowPass.connect(natureGain);
        natureGain.connect(gainNodeRef.current);
        
        natureSource.start();
        audioSourcesRef.current.push(natureSource);
        break;

      case 'whitenoise':
        // Enhanced white noise with better frequency distribution
        const noiseBufferSize = 4 * ctx.sampleRate;
        const whiteNoiseBuffer = ctx.createBuffer(2, noiseBufferSize, ctx.sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
          const output = whiteNoiseBuffer.getChannelData(channel);
          for (let i = 0; i < noiseBufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }
        }
        
        const whiteNoiseSource = ctx.createBufferSource();
        const whiteNoiseFilter = ctx.createBiquadFilter();
        const whiteNoiseGain = ctx.createGain();
        
        whiteNoiseSource.buffer = whiteNoiseBuffer;
        whiteNoiseSource.loop = true;
        whiteNoiseFilter.type = 'lowpass';
        whiteNoiseFilter.frequency.setValueAtTime(8000, ctx.currentTime);
        whiteNoiseGain.gain.setValueAtTime(0.08, ctx.currentTime);
        
        whiteNoiseSource.connect(whiteNoiseFilter);
        whiteNoiseFilter.connect(whiteNoiseGain);
        whiteNoiseGain.connect(gainNodeRef.current);
        
        whiteNoiseSource.start();
        audioSourcesRef.current.push(whiteNoiseSource);
        break;

      case 'ambient':
        // Enhanced ambient with multiple harmonic layers
        const ambientOsc1 = ctx.createOscillator();
        const ambientOsc2 = ctx.createOscillator();
        const ambientOsc3 = ctx.createOscillator();
        const ambientGain = ctx.createGain();
        const ambientFilter = ctx.createBiquadFilter();
        
        ambientOsc1.type = 'sine';
        ambientOsc2.type = 'triangle';
        ambientOsc3.type = 'sine';
        ambientOsc1.frequency.setValueAtTime(110, ctx.currentTime);
        ambientOsc2.frequency.setValueAtTime(165, ctx.currentTime);
        ambientOsc3.frequency.setValueAtTime(220, ctx.currentTime);
        
        ambientFilter.type = 'lowpass';
        ambientFilter.frequency.setValueAtTime(1500, ctx.currentTime);
        ambientGain.gain.setValueAtTime(0.04, ctx.currentTime);
        
        ambientOsc1.connect(ambientFilter);
        ambientOsc2.connect(ambientFilter);
        ambientOsc3.connect(ambientFilter);
        ambientFilter.connect(ambientGain);
        ambientGain.connect(gainNodeRef.current);
        
        ambientOsc1.start();
        ambientOsc2.start();
        ambientOsc3.start();
        audioSourcesRef.current.push(ambientOsc1, ambientOsc2, ambientOsc3);
        break;
    }
    
    isGeneratingRef.current = false;
  };

  const pauseAudio = () => {
    if (audioContextRef.current?.state === 'running') {
      audioContextRef.current.suspend();
    }
  };

  const resumeAudio = () => {
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const stopAudio = () => {
    audioSourcesRef.current.forEach(source => {
      try {
        if ('stop' in source) {
          (source as AudioBufferSourceNode | OscillatorNode).stop();
        }
      } catch (e) {
        // Source might already be stopped
      }
    });
    audioSourcesRef.current = [];
  };

  const togglePlayPause = () => {
    if (!isPlaying) {
      if (audioSourcesRef.current.length === 0) {
        const currentAudioType = playlists[selectedPlaylist].tracks[currentTrack].audioType;
        generateAudio(currentAudioType);
      } else {
        resumeAudio();
      }
      setIsPlaying(true);
    } else {
      pauseAudio();
      setIsPlaying(false);
    }
  };

  const nextTrack = () => {
    stopAudio();
    setCurrentTrack((prev) => 
      prev < playlists[selectedPlaylist].tracks.length - 1 ? prev + 1 : 0
    );
    setIsPlaying(false);
  };

  const prevTrack = () => {
    stopAudio();
    setCurrentTrack((prev) => 
      prev > 0 ? prev - 1 : playlists[selectedPlaylist].tracks.length - 1
    );
    setIsPlaying(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        isMuted ? (volume[0] / 100) * 0.3 : 0,
        audioContextRef.current?.currentTime || 0
      );
    }
  };

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current && !isMuted) {
      gainNodeRef.current.gain.setValueAtTime(
        (volume[0] / 100) * 0.3, // Scale down for comfortable listening
        audioContextRef.current?.currentTime || 0
      );
    }
  }, [volume, isMuted]);

  // Reset track when playlist changes
  useEffect(() => {
    stopAudio();
    setCurrentTrack(0);
    setIsPlaying(false);
  }, [selectedPlaylist]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  if (!isUnlocked) {
    return null; // Don't show anything when locked
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-9 w-9 rounded-full p-0 transition-all duration-200",
            isPlaying 
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25" 
              : "bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          <Music className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-80 p-4 bg-card/95 backdrop-blur-xl border border-border shadow-xl z-50"
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Music className="h-4 w-4 text-purple-500" />
              <span className="font-semibold text-sm">Study Playlist</span>
            </div>
            <div className="flex space-x-1">
              {playlists.map((playlist, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPlaylist(index)}
                  className={cn(
                    "p-1.5 h-auto rounded-lg",
                    selectedPlaylist === index && `bg-gradient-to-r ${playlist.color} text-white`
                  )}
                >
                  <playlist.icon className="h-3 w-3" />
                </Button>
              ))}
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Current Track */}
          <div className="text-center space-y-1">
            <h4 className="text-sm font-medium text-foreground">
              {playlists[selectedPlaylist].tracks[currentTrack].name}
            </h4>
            <p className="text-xs text-muted-foreground">
              {playlists[selectedPlaylist].name}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-3">
            <Button variant="ghost" size="sm" onClick={prevTrack} className="h-8 w-8 p-0">
              <SkipBack className="h-3.5 w-3.5" />
            </Button>
            
            <Button 
              size="sm" 
              onClick={togglePlayPause}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full w-8 h-8 p-0"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </Button>
            
            <Button variant="ghost" size="sm" onClick={nextTrack} className="h-8 w-8 p-0">
              <SkipForward className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={toggleMute} className="h-6 w-6 p-0">
              {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
            </Button>
            <Slider
              value={isMuted ? [0] : volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-6 text-right">
              {isMuted ? 0 : volume[0]}
            </span>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StudyPlaylist;