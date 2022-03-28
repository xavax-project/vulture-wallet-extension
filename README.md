<h1 align="center">Vulture Wallet | Extension</h1>
<p align='center'>
<img src="./public/icons/VultureIcon2.png" alt="Example 1" width="8%"> 
</p>

### Sleek, open-source & non-custodial multi-chain crypto wallet made for Substrate and [Aleph Zero](https://alephzero.org).

*made with love <3 By [Ira](https://twitter/diinkitheimp) and the [xavax.io](https://www.xavax.io) project.*


<h3 align="center"> Things to Note: </h3>

* Vulture is early, you can see the roadmap at the [vulture website](https://vulturewallet.net).
* Vulture aims to be multi-chain, with a focus on Aleph Zero. Multi-chain currently only works with
other substrate-based networks.
* Vulture aims to support the Ledger hardware wallet in the near future, you will be able to use both non-hardware mnemonic accounts & Ledger accounts simultaneously.
<h3 align="center"> Branches: </h3>

Vulture has three main branches:

* `Dev` - The dev branch has frequent rolling updates, this version likely has new features that are buggy and unfinished, crazy branch dis branch!
* `Nightly` - The nightly branch contains a release candidate version of the next Vulture update, it might be buggy.
* `Master` - The master branch contains the version of Vulture as you can find in the Chrome Web Store or any web extension store.

Other branches that add very feature-specific things may arrise.


<h1 align="center"> ~ For The Devs ~ </h1>


<h2 align="center"> Build Requirements: </h2>

Requirements are: `Nodejs, NPM, Yarn, Vue cli (>5.0.0)`,

You can install yarn by running `npm i -g yarn`

You can install vue cli by running `npm i -g @vue/cli`

The NPM package manager comes with Nodejs.



<h2 align="center"> Build Vulture </h2>

*After you've cloned the repository into a directory, run `yarn install` in the directory to install all dependencies.*

To build Vulture you run:

`yarn build`

This will build the wallet into the `dist` folder, but there's a slight catch every time you build:

You need to manually
open & edit the `vulture_worker-bundle.js` file located in the `dist` and `public` folder, search for the `document.baseURI||` line, and delete it.

This error is due to a bug with how Webpack 5 loads WASM, this will likely be fixed soon by either a workaround or by the Webpack developers.


Building everytime you make a change is slow, so if you want to develop I recommend that you instead run:


`yarn serve`

This will launch a locally-hosted webserver where you can test the wallet in a web-page and make changes accordingally. You can enter inspect-mode and limit the resolution to imitate the extension-popup resolution.

You will need to edit the `vulture_worker-bundle.js` file as well, but in the `public` folder instead. You will only have to edit the file once every time you run `yarn serve`.

## Scripts:
Vulture has a Web-Worker which handles important things in the *background*, and also has all the WASM functionality of the wallet since WASM isn't allowed in the extension environment. Everytime you edit the script or If you want to build the scripts manually, you can run:

`yarn build-scripts`.

This will pack, build, and place the scripts in the `public` folder. Everytime you customize the script, you'll need to run `yarn build-scripts` again, even if you ran `yarn serve`.

Make sure to edit the built `vulture_worker-bundle.js` file and manually remove the `document.baseURI||` line.

It's really sucky, I know; But *WASM + Webpack + Web-Workers + Extension environment* isn't a thing that can easily be glued together. For more technical details, read the initial blog-post about the wallet.
___

## License
Vulture is licensed under the permissive [MIT License](https://mit-license.org/).


## Info


You can find more info at [vulturewallet.net](https://vulturewallet.net) and [xavax.io](https://www.xavax.io).

Follow [me](https://twitter.com/DiinkiTheImp) on twitter if you wanna!

Feel free to help-out by: tipping, forking the code and creating pull requests, giving feedback, and also creating issues on Github if any issues arrise!

**AZERO Tipping address:**

`some azero address in the future maybe`


<h2 align="center">hope you have a great time, all the time!~ </h2>

