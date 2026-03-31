import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'hp9zn2',
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });
    },
    baseUrl: "https://www.hml.lector.live/testesautomatizados/subscribe/login",

    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',

    chromeWebSecurity: false,
    video: true,
    videoCompression: 32,
    videoUploadOnPasses: false,
    defaultCommandTimeout: 10000,
    execTimeout: 120000,
    pageLoadTimeout: 60000,
    waitForAnimations: true
  }
});