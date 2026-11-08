import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.rohubtravel.app",
  appName: "RoHub Travel",
  webDir: "out",
  android: {
    // The Piticot backend runs over plain HTTP on the local network.
    allowMixedContent: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 900,
      backgroundColor: "#ffffff",
      showSpinner: false,
    },
  },
};

export default config;
