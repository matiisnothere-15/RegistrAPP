import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ionic.registrapp',
  appName: 'registrapp',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
