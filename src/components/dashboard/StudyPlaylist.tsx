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

const StudyPlaylist = ({ isUnlocked }: StudyPlaylistProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playlists = [
    {
      name: "Lo-Fi Study Beats",
      icon: Music,
      color: "from-purple-500 to-pink-500",
      tracks: [
        { name: "Midnight Study", duration: "3:24" },
        { name: "Coffee Shop Vibes", duration: "4:12" },
        { name: "Rainy Day Focus", duration: "3:45" },
        { name: "Late Night Pages", duration: "4:01" }
      ]
    },
    {
      name: "Nature Sounds",
      icon: TreePine,
      color: "from-green-500 to-emerald-500",
      tracks: [
        { name: "Forest Rain", duration: "5:00" },
        { name: "Ocean Waves", duration: "6:30" },
        { name: "Mountain Stream", duration: "4:45" },
        { name: "Birds & Breeze", duration: "5:15" }
      ]
    },
    {
      name: "White Noise",
      icon: Waves,
      color: "from-blue-500 to-cyan-500",
      tracks: [
        { name: "Brown Noise", duration: "10:00" },
        { name: "Pink Noise", duration: "10:00" },
        { name: "Fan Sounds", duration: "8:30" },
        { name: "Static Calm", duration: "10:00" }
      ]
    },
    {
      name: "Ambient Focus",
      icon: Cloud,
      color: "from-indigo-500 to-purple-500",
      tracks: [
        { name: "Deep Space", duration: "7:20" },
        { name: "Ethereal Drones", duration: "6:45" },
        { name: "Minimal Synths", duration: "5:30" },
        { name: "Floating Pads", duration: "8:15" }
      ]
    }
  ];

  const [selectedPlaylist, setSelectedPlaylist] = useState(0);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => 
      prev < playlists[selectedPlaylist].tracks.length - 1 ? prev + 1 : 0
    );
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => 
      prev > 0 ? prev - 1 : playlists[selectedPlaylist].tracks.length - 1
    );
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    setCurrentTrack(0);
  }, [selectedPlaylist]);

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