import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aworthy.lms',
  appName: 'A Worthy',
  webDir: 'dist',
  server: {
    // Use the live URL in production so the app always loads the latest version
    // Comment this out and use webDir for a fully offline/bundled app
    url: 'https://lms.a-worthy.com',
    cleartext: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: '#0B0F1A',
      showSpinner: false,
      launchFadeOutDuration: 300,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0B0F1A',
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
  ios: {
    contentInset: 'automatic',
    scheme: 'A Worthy',
    backgroundColor: '#0B0F1A',
  },
  android: {
    backgroundColor: '#0B0F1A',
    allowMixedContent: false,
    captureInput: true,
  },
};

export default config;
