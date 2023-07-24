# Talon Planner (talon-planner)

City of Heroes Planner

## Purpose

- Why the name? I'm a Trick Arrow fan since the very beginning.
  And not because it's arrows. But because I enjoy debuffing and busy-ness.
- It's fun learning and creating new things.
- To get the ball moving on updating a planner.
  To hopefully demonstrate how much easier it is.
- We owe a big thanks to [City of Data 2.0](https://cod.uberguy.net/).
  For we use their json.
- This has been architected and thought-out as far as a quick way
  to demonstrate, and a full foundation.
- Wanted something that could handle various platforms, is responsive, and perhaps, become a PWA for [offline] mobile.
- I am unable to commit long term to this.

Once AGAIN...
This was never meant to replace any existing planner.
This was to hopefully take the next step in "planners," being multi-platform. I am thankful and still use other planners. This community is awesome.

## Breakin Eggs

- Had to break some great Quasar features.
  - Custom styling; instead of using styling of prebuilt components. -- To squeeze the spacing.
  - Custom breakpoints; More Boostrap and even non-bootstrap. -- To have a view at every size.
- Using Tauri.
  - Initially wanted a web first, mobile device second, and desktop as an afterthought. But after some thinking, wanted a desktop app; so some shifting happened.
  - I imagine this makes development onboarding harder/longer. Compared to using supported frameworks like Electron. And versus using a more closer related language.

## Links

Non City of Heroes related Links.

- [Quasar](https://quasar.dev)
- [Tauri](https://tauri.app)

## Updating

### Data

We download the zip file from [City of Data 2.0](https://cod.uberguy.net/)
and unzip it into the `public\json\homecoming` folder.

### Images

Icons were download from various sites.
They are placed into the `public\icon` folder.

## Commands

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

## PROD Tauri Build

Builds Quasar SPA about 2mins.
Non-installer with debug about 20mins.
Non-installer w/o debug about 22mins.
Installer about XXmins.

```sh
# Use LLD link built into cargo.  May not work on macOS.
[build]
rustflags = ["-C", "link-arg=-fuse-ld=lld"]
```
