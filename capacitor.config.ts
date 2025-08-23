import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ayeshaacademypurnea.app',
  appName: 'Ayesha Academy',
  webDir: 'public', // still required but won't be used
  server: {
    url: 'https://ayeshaacademypurneaapp.netlify.app', // your live URL
    cleartext: true, // only needed for HTTP (not required for HTTPS)
  },
};

export default config;
