import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, Waves, Cloud, TreePine, Flame } from 'lucide-react';
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
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const noiseBufferRef = useRef<AudioBuffer | null>(null);

  const playlists = [
    {
      name: "Lo-Fi Study Beats",
      icon: Music,
      color: "from-purple-500 to-pink-500",
      audioType: 'lofi' as const,
      tracks: [
        { name: "Midnight Study", duration: "3:24", audioType: 'lofi' as const },
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

  // Generate different types of audio
  const generateAudio = (audioType: 'lofi' | 'nature' | 'whitenoise' | 'ambient') => {
    initAudioContext();
    if (!audioContextRef.current || !gainNodeRef.current) return;

    // Stop any existing audio
    stopAudio();

    const ctx = audioContextRef.current;

    switch (audioType) {
      case 'lofi':
        // Create a simple lo-fi beat with low-pass filtered noise and a subtle bass
        const lofiOsc = ctx.createOscillator();
        const lofiGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        lofiOsc.type = 'sawtooth';
        lofiOsc.frequency.setValueAtTime(220, ctx.currentTime); // A3 note
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        lofiGain.gain.setValueAtTime(0.1, ctx.currentTime);
        
        lofiOsc.connect(filter);
        filter.connect(lofiGain);
        lofiGain.connect(gainNodeRef.current);
        
        lofiOsc.start();
        oscillatorRef.current = lofiOsc;
        break;

      case 'nature':
        // Create nature sounds using filtered white noise
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        
        const whiteNoise = ctx.createBufferSource();
        const bandpass = ctx.createBiquadFilter();
        const natureGain = ctx.createGain();
        
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        bandpass.type = 'bandpass';
        bandpass.frequency.setValueAtTime(1000, ctx.currentTime);
        bandpass.Q.setValueAtTime(0.5, ctx.currentTime);
        natureGain.gain.setValueAtTime(0.05, ctx.currentTime);
        
        whiteNoise.connect(bandpass);
        bandpass.connect(natureGain);
        natureGain.connect(gainNodeRef.current);
        
        whiteNoise.start();
        break;

      case 'whitenoise':
        // Create white noise
        const whiteNoiseBufferSize = 2 * ctx.sampleRate;
        const whiteNoiseBuffer = ctx.createBuffer(1, whiteNoiseBufferSize, ctx.sampleRate);
        const whiteOutput = whiteNoiseBuffer.getChannelData(0);
        
        for (let i = 0; i < whiteNoiseBufferSize; i++) {
          whiteOutput[i] = Math.random() * 2 - 1;
        }
        
        const whiteNoiseSource = ctx.createBufferSource();
        const whiteNoiseGain = ctx.createGain();
        
        whiteNoiseSource.buffer = whiteNoiseBuffer;
        whiteNoiseSource.loop = true;
        whiteNoiseGain.gain.setValueAtTime(0.1, ctx.currentTime);
        
        whiteNoiseSource.connect(whiteNoiseGain);
        whiteNoiseGain.connect(gainNodeRef.current);
        
        whiteNoiseSource.start();
        break;

      case 'ambient':
        // Create ambient drone with multiple oscillators
        const freq1 = ctx.createOscillator();
        const freq2 = ctx.createOscillator();
        const ambientGain = ctx.createGain();
        
        freq1.type = 'sine';
        freq2.type = 'sine';
        freq1.frequency.setValueAtTime(110, ctx.currentTime); // A2
        freq2.frequency.setValueAtTime(165, ctx.currentTime); // E3
        ambientGain.gain.setValueAtTime(0.05, ctx.currentTime);
        
        freq1.connect(ambientGain);
        freq2.connect(ambientGain);
        ambientGain.connect(gainNodeRef.current);
        
        freq1.start();
        freq2.start();
        oscillatorRef.current = freq1; // Store reference for cleanup
        break;
    }
  };

  const stopAudio = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch (e) {
        // Oscillator might already be stopped
      }
      oscillatorRef.current = null;
    }
  };

  const togglePlayPause = () => {
    if (!isPlaying) {
      const currentAudioType = playlists[selectedPlaylist].tracks[currentTrack].audioType;
      generateAudio(currentAudioType);
      setIsPlaying(true);
    } else {
      stopAudio();
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
    return (
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-slate-100 to-gray-200 dark:from-slate-900 dark:to-gray-800 opacity-60">
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="text-center space-y-2">
            <Flame className="h-8 w-8 mx-auto text-orange-500" />
            <div className="text-sm font-semibold text-foreground">Study Playlist Locked</div>
            <div className="text-xs text-muted-foreground">Unlock with 7-day streak</div>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Music className="h-6 w-6 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-muted-foreground">Study Music & Sounds</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {playlists.map((playlist, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/50 text-center">
                  <playlist.icon className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-sm font-medium text-muted-foreground">{playlist.name}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-pink-950/30 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
              <Music className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-foreground">Study Playlist</CardTitle>
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 text-xs">
                7-Day Reward
              </Badge>
            </div>
          </div>
          <div className="flex space-x-1">
            {playlists.map((playlist, index) => (
              <Button
                key={index}
                variant={selectedPlaylist === index ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedPlaylist(index)}
                className={cn(
                  "p-2 h-auto",
                  selectedPlaylist === index && `bg-gradient-to-r ${playlist.color} text-white`
                )}
              >
                <playlist.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Track */}
        <div className="text-center space-y-2">
          <h4 className="font-semibold text-foreground">
            {playlists[selectedPlaylist].tracks[currentTrack].name}
          </h4>
          <p className="text-sm text-muted-foreground">
            {playlists[selectedPlaylist].name} • {playlists[selectedPlaylist].tracks[currentTrack].duration}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          <Button variant="ghost" size="sm" onClick={prevTrack}>
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button 
            size="sm" 
            onClick={togglePlayPause}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full w-10 h-10 p-0"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button variant="ghost" size="sm" onClick={nextTrack}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={toggleMute}>
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Slider
            value={isMuted ? [0] : volume}
            onValueChange={setVolume}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-8 text-right">
            {isMuted ? 0 : volume[0]}
          </span>
        </div>

        {/* Track List */}
        <div className="max-h-32 overflow-y-auto space-y-1">
          {playlists[selectedPlaylist].tracks.map((track, index) => (
            <div
              key={index}
              onClick={() => setCurrentTrack(index)}
              className={cn(
                "flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors",
                currentTrack === index 
                  ? "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40" 
                  : "hover:bg-muted/50"
              )}
            >
              <span className={cn(
                "text-sm",
                currentTrack === index ? "font-semibold text-purple-700 dark:text-purple-300" : "text-foreground"
              )}>
                {track.name}
              </span>
              <span className="text-xs text-muted-foreground">{track.duration}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyPlaylist;