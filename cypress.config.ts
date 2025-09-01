import { defineConfig } from &apos;cypress&apos;;

export default defineConfig({
}
  e2e: {
}
    baseUrl: &apos;http://localhost:5173&apos;,
    supportFile: &apos;cypress/support/e2e.ts&apos;,
    specPattern: &apos;cypress/e2e/**/*.cy.{js,jsx,ts,tsx}&apos;,
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    setupNodeEvents(on, config) {
}
      // implement node event listeners here
      on(&apos;task&apos;, {
}
        log(message) {
}
          console.log(message);
          return null;
        },
      });
    },
  },
  component: {
}
    devServer: {
}
      framework: &apos;react&apos;,
      bundler: &apos;vite&apos;,
    },
    specPattern: &apos;src/**/*.cy.{js,jsx,ts,tsx}&apos;,
  },
});