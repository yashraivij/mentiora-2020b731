import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b1ad43026cdf4cdabb79f848994a139d',
  appName: 'mentiora',
  webDir: 'dist',
  server: {
    url: 'https://b1ad4302-6cdf-4cda-bb79-f848994a139d.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;