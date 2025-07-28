import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { User, Camera, Check, X, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Import cartoon animal avatars
import catAvatar from '@/assets/avatars/cat-avatar.png';
import dogAvatar from '@/assets/avatars/dog-avatar.png';
import foxAvatar from '@/assets/avatars/fox-avatar.png';
import rabbitAvatar from '@/assets/avatars/rabbit-avatar.png';
import bearAvatar from '@/assets/avatars/bear-avatar.png';

interface PublicProfile {
  username: string;
  avatar_url: string | null;
  display_name: string | null;
  streak_days: number;
}

interface ProfileDropdownProps {
  streakDays: number;
  firstName: string;
}

export function ProfileDropdown({ streakDays, firstName }: ProfileDropdownProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [publicProfile, setPublicProfile] = useState<PublicProfile | null>(null);
  const [editData, setEditData] = useState({
    username: '',
    display_name: '',
    avatar_url: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Check if user has unlocked profile feature (14+ day streak)
  const canCreateProfile = streakDays >= 14;

  useEffect(() => {
    if (user && canCreateProfile) {
      fetchPublicProfile();
    }
  }, [user, canCreateProfile]);

  const fetchPublicProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('public_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching public profile:', error);
        return;
      }

      if (data) {
        setPublicProfile(data);
        setEditData({
          username: data.username || '',
          display_name: data.display_name || '',
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (error) {
      console.error('Error in fetchPublicProfile:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !editData.username.trim()) {
      toast({
        title: "Error",
        description: "Username is required",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const profileData = {
        user_id: user.id,
        username: editData.username.trim(),
        display_name: editData.display_name.trim() || editData.username.trim(),
        avatar_url: editData.avatar_url.trim() || null,
        streak_days: streakDays
      };

      if (publicProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('public_profiles')
          .update(profileData)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Create new profile
        const { error } = await supabase
          .from('public_profiles')
          .insert(profileData);

        if (error) throw error;
      }

      await fetchPublicProfile();
      setIsEditing(false);
      
      toast({
        title: "Success!",
        description: "Your profile has been saved successfully",
      });
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: error.message?.includes('duplicate') 
          ? "This username is already taken" 
          : "Failed to save profile",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (publicProfile) {
      setEditData({
        username: publicProfile.username || '',
        display_name: publicProfile.display_name || '',
        avatar_url: publicProfile.avatar_url || ''
      });
    } else {
      setEditData({ username: '', display_name: '', avatar_url: '' });
    }
    setIsEditing(false);
  };

  if (!canCreateProfile) {
    // Regular profile display for users without 14-day streak
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="flex items-center space-x-2 px-4 py-2 bg-background/60 dark:bg-card/60 backdrop-blur-sm rounded-2xl border border-border shadow-sm hover:bg-background/80 transition-all duration-300"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
              <User className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground">{firstName}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-72 bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl" 
          align="end"
          sideOffset={8}
        >
          <div className="p-4 text-center space-y-3">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
              <Lock className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Profile Locked</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Reach a 14-day study streak to unlock your public profile!
              </p>
            </div>
            <div className="text-xs text-muted-foreground/80">
              Current streak: {streakDays} days • {14 - streakDays} days to go
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-50/80 to-blue-50/80 dark:from-emerald-950/30 dark:to-blue-950/30 backdrop-blur-sm rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300"
        >
          {publicProfile ? (
            <>
              <Avatar className="w-6 h-6">
                <AvatarImage src={publicProfile.avatar_url || undefined} />
                <AvatarFallback className="text-xs bg-gradient-to-br from-emerald-500 to-blue-500 text-white">
                  {publicProfile.username[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground">
                {publicProfile.display_name || publicProfile.username}
              </span>
              <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full animate-pulse" />
            </>
          ) : (
            <>
              <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-medium text-foreground">{firstName}</span>
              <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full animate-pulse" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 p-0 bg-card/95 backdrop-blur-xl border border-border shadow-2xl">
        <Card className="border-0 shadow-none bg-transparent">
          <CardContent className="p-4">
            {isEditing ? (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent">
                    {publicProfile ? 'Edit Profile' : 'Create Your Profile'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    14-day streak reward unlocked! 🎉
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Username</label>
                    <Input
                      value={editData.username}
                      onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                      placeholder="Choose a username"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Display Name</label>
                    <Input
                      value={editData.display_name}
                      onChange={(e) => setEditData({ ...editData, display_name: e.target.value })}
                      placeholder="How should others see you?"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Choose Avatar</label>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {[
                        { src: catAvatar, name: 'Cat' },
                        { src: dogAvatar, name: 'Dog' },
                        { src: foxAvatar, name: 'Fox' },
                        { src: rabbitAvatar, name: 'Rabbit' },
                        { src: bearAvatar, name: 'Bear' }
                      ].map((avatar, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setEditData({ ...editData, avatar_url: avatar.src })}
                          className={`w-12 h-12 rounded-full border-2 overflow-hidden transition-all ${
                            editData.avatar_url === avatar.src 
                              ? 'border-primary ring-2 ring-primary/20' 
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <img 
                            src={avatar.src} 
                            alt={`${avatar.name} avatar`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    onClick={handleSaveProfile} 
                    disabled={isLoading || !editData.username.trim()}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {isLoading ? 'Saving...' : 'Save'}
                  </Button>
                  <Button 
                    onClick={handleCancel} 
                    variant="outline"
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {publicProfile ? (
                  <>
                    <div className="text-center space-y-2">
                      <Avatar className="w-16 h-16 mx-auto">
                        <AvatarImage src={publicProfile.avatar_url || undefined} />
                        <AvatarFallback className="text-lg bg-gradient-to-br from-emerald-500 to-blue-500 text-white">
                          {publicProfile.username[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-lg">{publicProfile.display_name || publicProfile.username}</h3>
                        <p className="text-sm text-muted-foreground">@{publicProfile.username}</p>
                        <div className="flex items-center justify-center space-x-1 mt-1">
                          <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full animate-pulse" />
                          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            {streakDays} day streak
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => setIsEditing(true)} 
                      variant="outline" 
                      className="w-full"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent">
                          Create Your Profile
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          You've unlocked the profile feature with your 14-day streak!
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => setIsEditing(true)} 
                      className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Setup Profile
                    </Button>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}