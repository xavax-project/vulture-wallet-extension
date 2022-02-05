# Vulture Wallet - Extension
### Easy-To-Use, multi-chain wallet made for [Aleph Zero](alephzero.org)


Vulture is an easy-to-use multi-chain wallet made specifically for Aleph Zero. Vulture is completely open-source & non-custodial & made with love <3 By [Ira](https://twitter/diinkitheimp) and the [xavax.io](https://www.xavax.io) project.

#### Vulture is licensed under the permissive [MIT License](https://mit-license.org/).
___
## Things to note:
* Vulture is early, you can see the roadmap at the [vulture website](https://vulturewallet.net).
* Vulture aims to be multi-chain, with a focus on Aleph Zero. Multi-chain currently only works with
other substrate-based networks.
* Vulture aims to support the Ledger hard-ware wallet in the near-future, you will be able to use both non-hardware mnemonic accounts & Ledger accounts simultaneously.

___

## ~ For The Devs ~


### Build Requirements:
> You will need: `Nodejs, NPM, and Yarn`,

In order to build vulture, you'll need to have [Nodejs](https://nodejs.org/en/) `recommended: 16.13 or above`.

You will also need the `NPM` package manager, if it doesn't come with Nodejs (which it should), install it.

You will need the `yarn` package manager. To install yarn, simply use NPM:  `npm i -g yarn`.

> You will also need: `Vue/Vue cli`, **Must** be version 5.0.0 or above (currently in release candidate).

The front-end for Vulture is made using the Vue3 framework, since it requires Webpack5, you will need to install Vue3 with a version that is 5.0.0 or higher.
To install, run `npm i -g @vue/cli@5.0.0-rc.2` (When 5.0.0 is released, installing `@vue/cli` will be enough).

___

### Build Vulture:
*After you've cloned the repository*

To build Vulture you run:

`yarn build`

This will build the wallet into the `dist` folder, but there's a slight catch every time you build:

You need to manually
open & edit the `vulture_worker-bundle.js` file, search for the `document.baseURI ||` line, and delete it.

This error is due to a bug with how Webpack 5 loads WASM, this will likely be fixed soon by either a workaround or by the Webpack developers.


Building everytime you make a change is slow, so if you want to develop I recommend that you instead run:


`yarn serve`

This will launch a locally-hosted webserver where you can test the wallet in a web-page and make changes accordingally. You can enter inspect-mode and limit the resolution to imitate the extension-popup resolution.

Note: You will need to uncomment the specified line in `main.ts` when you serve to a page, make sure to comment it again before running `yarn build` (not catastrophic if you forget).

You will need to edit the `vulture_worker-bundle.js` file as well, but in the `public` folder instead. You will only have to edit the file once every time you run `yarn serve`.

### Scripts:
Vulture has a Service-worker which handles important things in the *background*, and also has all the WASM functionality of the wallet since WASM isn't allowed in the extension environment. Everytime you edit the script or If you want to build the scripts manually, you can run:

`yarn build-scripts`.

This will pack, build, and place the scripts in the `public` folder. Everytime you customize the script, you'll need to run `yarn build-scripts` again, even if you ran `yarn serve`.

Make sure to edit the built `vulture_worker-bundle.js` file and manually remove the `document.baseURI ||` line.

It's really sucky, I know; But *WASM + Webpack + Web-Workers + Extension environment* isn't a thing that can easily be glued together. For more technical details, read the initial blog-post about the wallet.
___

## Info
You can find more info at [vulturewallet.net](https://vulturewallet.net) and [xavax.io](https://www.xavax.io).

Follow [me](https://twitter/DiinkiTheImp) on twitter if you wanna!

Feel free to help-out by: tipping, forking the code and creating pull requests, giving feedback, and also creating issues on Github if any issues arrise!

**Tip address: AZERO**

`some azero address in the future`


### Hope you have a great time, all the time!~

