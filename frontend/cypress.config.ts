import { defineConfig } from "cypress";

export default defineConfig({
  viewportWidth: 1300,
  viewportHeight: 800,
  video: false,

  retries: {
    runMode: 1,
    openMode: 1,
  },

  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.ts")(on, config);
    },
    baseUrl: "http://localhost:3000",
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
