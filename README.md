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

## LOCAL Debug

Two step process in VSCode. This is allow us to have break points:

1. Run `quasar dev`: This should default and run localhost:9000. A browser will open, you can close it.
2. Run VSCode's debugger setting `Quasar App: chrome`: This should open a browser that connects to localhost:9000.
3. Add breakpoints, and debug. Intially breakpoint may not appear red.

### LOCAL Serve

If for some reason you need to run a build on LOCAL. AKA view a distribution.

1. _Requirement_ Have Quasar CLI package installed globally.
2. Use the VSCode task `Quasar Serve`
3. Visit [http://localhost:3223](http://localhost:3223)
