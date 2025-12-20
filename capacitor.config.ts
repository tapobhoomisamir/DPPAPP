import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.tapobhoomi.app.calendar',
  appName: 'DPPAPPCalendar',
  webDir: 'www',
  plugins: {
    CapacitorHttp: {
      enabled: true, 
    },
  },
};

export default config;
