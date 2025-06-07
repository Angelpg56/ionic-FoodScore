import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'edu.angelpina.foodscore',
  appName: 'Ionic FoodScore',
  webDir: 'www',
  android: {
    allowMixedContent: true
  }
};

export default config;
