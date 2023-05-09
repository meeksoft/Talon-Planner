# Talon Planner (talon-planner)

City of Heroes Planner

## Command Commands

- Install the dependencies: `yarn install` . We recommend using `yarn` to manage local packages.
- Start the app in development mode (hot-code reloading, error reporting, etc.): `quasar dev`
- Lint the files: `yarn lint`
- Format the files: `yarn format`
- Build the app for production: `quasar build`

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

## LOCAL Setup

- [Vue DevTools for Browser](https://github.com/vuejs/devtools)

### LOCAL PWA

_Warning_ When in develop mode (not production), having a Service Worker installed and running will mess with the HMR (Hot Module Reload). However, the browser can be configured to bypass for network instead of using the Service Worker’s cache. [Reference](https://quasar.dev/quasar-cli-webpack/developing-pwa/hmr-for-dev)

_Warning_ Do not run Lighthouse on your development build because at this stage the code is intentionally not optimized and contains embedded source maps (among many other things). [Reference](https://quasar.dev/quasar-cli-webpack/developing-pwa/build-commands/)

_Warnnig_ You may notice in some dev environments, that Workbox will not load your service workers during `quasar dev` if you are not using HTTPS to serve - even on localhost. [Reference](https://quasar.dev/quasar-cli-vite/developing-pwa/handling-service-worker)

- `dev:pwa`
- `build:pwa`
