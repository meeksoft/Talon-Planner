# Talon Planner (talon-planner)

City of Heroes Planner

This was never meant to replace any existing planner.
This was to hopefully take the next step in "planners," being multi-platform.
A Proof-concept, that I wanted to try.
I am thankful and still use other planners; like Mids.
This community is awesome.

As a life long fan, will always be grateful to the community.
I think everyone will agree 100% how amazng the community is.
I enjoy making project like this, but am always unable to commit long term.
That being said, because the community has given so much, I want to give (however small) too.

[User Manual (Short Format)](/USERMANUAL.MD)

## Purpose

- Why the name? I'm a Trick Arrow fan since the very beginning.
  And not because it's arrows. But because I enjoy debuffing and busy-ness.
- It's fun learning and creating new things.
- To get the ball moving on "modernizing" a planner. AKA, cross platform.
- We owe a big thanks to [City of Data 2.0](https://cod.uberguy.net/).
  For we use their json.
- Because I focused on a quick way to demo. This has not been architected and thought-out fully. There is no good full foundation.
- Wanted something that could handle various platforms, is responsive, and perhaps, become a PWA for [offline] mobile.

Once AGAIN...
This was never meant to replace any existing planner.
This was to hopefully take the next step in "planners," being multi-platform.
I am thankful and still use other planners; like Mids.
This community is awesome.

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
- [Vue PWA Install](https://github.com/Bartozzz/vue-pwa-install)

## Updating

### Data

We download the zip file from [City of Data 2.0](https://cod.uberguy.net/)
and unzip it into the `public\json\homecoming` folder.
We then remove files we do not need.

### Images

Icons were download from various sites.
They are placed into the `public\icon` folder.

## Commands

- Install the dependencies: `yarn install` . We recommend using `yarn` to manage local packages.
- Start the app in development mode (hot-code reloading, error reporting, etc.): `quasar dev`
- Lint the files: `yarn lint`
- Format the files: `yarn format`
- Build the app for production: `quasar build`

## LOCAL Setup

- [Vue DevTools for Browser](https://github.com/vuejs/devtools)

### LOCAL PWA

_Warning_ When in develop mode (not production), having a Service Worker installed and running will mess with the HMR (Hot Module Reload). However, the browser can be configured to bypass for network instead of using the Service Worker’s cache. [Reference](https://quasar.dev/quasar-cli-webpack/developing-pwa/hmr-for-dev)

_Warning_ Do not run Lighthouse on your development build because at this stage the code is intentionally not optimized and contains embedded source maps (among many other things). [Reference](https://quasar.dev/quasar-cli-webpack/developing-pwa/build-commands/)

_Warnnig_ You may notice in some dev environments, that Workbox will not load your service workers during `quasar dev` if you are not using HTTPS to serve - even on localhost. [Reference](https://quasar.dev/quasar-cli-vite/developing-pwa/handling-service-worker)

- `dev:pwa`
- `build:pwa`

Builds PWA about 6mins.

#### LOCAL PWA SSL

We have `https` configured in the `quasar.config.js` for `devServer`.
We use localhost.pfx (it has the private key included.)
This is located in the `certs` folder.
If there are issues, please disable https in the config file.

FYI, PWA is on port 3225. And you will have to enter the https.
[https://localhost:3225/](https://localhost:3225/)

### LOCAL Debug

Two step process in VSCode. This is allow us to have break points:

1. Run `quasar dev`: This should default and run localhost:3223.
2. Run VSCode's debugger setting `Quasar App: chrome`: This should open a browser that connects to localhost:3223.
3. Add breakpoints, and debug. Intially breakpoint may not appear red.

### LOCAL Serve

If for some reason you need to run a build on LOCAL. AKA view a distribution.

1. _Requirement_ Have Quasar CLI package installed globally.
2. Use the VSCode task `Quasar Serve`
3. Visit [http://localhost:3223](http://localhost:3223)

## LOCAL Tauri Build

_You may need to run `tauri dev` before launching Debug_

July 27, 2023 times:

- Builds Quasar SPA about 2mins.
- Non-installer with debug about 20mins.
- Non-installer w/o debug about 22mins.
- Installer about 20mins.

Aug 6, 2023 times (reduced amount of json files):

- All times rougly 6mins.

```sh
# Use LLD link built into cargo.  May not work on macOS.
[build]
rustflags = ["-C", "link-arg=-fuse-ld=lld"]
```

### SSG

Using [Quasar v2 SSG App Extension](https://github.com/freddy38510/quasar-app-extension-ssg)

Issues with `build:ssg` when `quasar.config.js` `pwa` is **true**.

Builds Quasar SSG about 22mins.

We haven't been directly building with SSG, instead building PWA.

## Optimization

This _needs_ to be worked on, seriously.
Load speed, caching, number of requests, build speed, etc.
Should we use a database?

July 27,2023 big issues:

- We have over 5K requests to load the json.
- We rely heavily on the browser's `disk cache`.
- Each json file needs to be "processed" when building SSG or Desktop App.
- Loading json from CDN takes over 12mins.
- Loading json from Desktop App is about 30seconds.

### Temp Solutions so far

- Reduce the number of unused files (even if they will be in the future) from the public folder.
- Added "lazy loading" and an option to download the database [aka JSON] into the app.
