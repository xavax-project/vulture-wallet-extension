
import { VultureMessage } from "../../src/vulture_backend/vultureMessage";
import { VultureRequest } from "../../src/vulture_backend/vultureRPC";

import { cryptoWaitReady } from '@polkadot/util-crypto';

import { WsProvider, Keyring, ApiPromise } from '@polkadot/api';
//
import { decodeAddress, encodeAddress } from "@polkadot/keyring";
import { hexToU8a, isHex } from "@polkadot/util";



//import {  } from '@polkadot/types-codec/utils';


/* --- Note # xavax # we are one @
    Due to the fact that google can't decide what they want to do with CSP and manifestV3 is hot garbage,
    I'm forced to handle all WASM things in the service_worker/web-workers instead. It's probably for the
    better anyways (somehow? I suppose because of the sandboxed environment they are running in...)

    That, along with being an intermediary message-passing and data-caching tool, is what the vulture_worker.js
    is and does. o7
*/

var isCryptoReady = false;
//Initialize WASM.
cryptoWaitReady().then((ready) => {
    isCryptoReady = true;
});

var vault = {
    seed: ''
};


var currentKeypair;
var currentWsProvider;
var currentApi;

self.addEventListener("message", (event) => {
    if(event.data && event.data.method === VultureMessage.SET_CURRENT_WALLET) {
        if(currentWsProvider != null) {
            currentWsProvider.disconnect();
        }
        if(isCryptoReady == false) {
            cryptoWaitReady().then((ready) => {
                isCryptoReady = true;

                const keyring = new Keyring({type: event.data.params.keyring.type});
                currentKeypair = keyring.addFromUri(event.data.params.keyring.uri);
                currentWsProvider = new WsProvider(event.data.params.network);
                currentWsProvider.isReady.then((ready) => {
                    ApiPromise.create({provider: currentWsProvider}).then((api) => {
                        currentApi = api;
                        console.log("Substrate Api has been generated succesfully!");
                        postMessage({method: VultureMessage.SET_CURRENT_WALLET, params: {
                            success: true,
                            address: currentKeypair.address,
                        }});
                        console.log("Vulture Worker succesfully generated keypair");
                    });
                });
            });
        }

        /* //NOTE : Due to webpack being a bitch to use with web-workers/webpack,
        //          I'll create my own API for substrate & AZERO in the future, in native js(ts).
        //          For now, you'll have to manually edit the generated bundle by webpack to fix a bug.
        let socket = new WebSocket(event.data.params.network);
        let r = ApiPromise;
        socket.onopen = function(event) {
            let req = new VultureRequest("state_getMetadata");
            socket.send(req.getJson());
            socket.onmessage = function(event) {
                let d = new TextDecoder().decode(hexToU8a(event.data.result));
                console.log(d);
            }
        }
         */
        //let response = req.postJsonRPC(event.data.params.network);
        //console.log(response);
    }

    if(event.data && event.data.method === VultureMessage.GET_ADDRESS_FROM_URI) {
        const keyring = new Keyring({type: event.data.params.keyring.type});
        currentKeypair = keyring.addFromUri(event.data.params.keyring.uri);
        postMessage({method: VultureMessage.GET_ADDRESS_FROM_URI, params: {
            success: true,
            address: currentKeypair.address,
            accountIndex: event.data.params.keyring.accountIndex,
        }});
        console.log("Vulture Worker succesfully generated keypair");
    }

    //Set Network
    if(event.data && event.data.method === VultureMessage.SET_NETWORK) {

        if(currentWsProvider != null) {
            currentWsProvider.disconnect();
        }

        currentWsProvider = new WsProvider(event.data.params.network.networkUri);
        currentWsProvider.isReady.then((ready) => {
            ApiPromise.create({provider: currentWsProvider}).then((api) => {
                currentApi = api;
                postMessage({method: VultureMessage.SET_NETWORK, params: {
                    success: true,
                }});
                console.log("Switched Substrate Network succesfully...");  
            });
        });
    }
    //Send assets
    if(event.data && event.data.method === VultureMessage.TRANSFER_ASSETS) {
        if(vault.seed != null && currentApi != null){
            currentApi.tx.balances.transferKeepAlive(event.data.params.recipent, event.data.params.amount).signAndSend(currentKeypair, ({events = [], status}) => {
                if(status.isInBlock) {

                    events.forEach(({event: {data,method,section}, phase}) => {
                        if(method == 'ExtrinsicSuccess') {
                            postMessage({method: VultureMessage.TRANSFER_ASSETS, params: {
                                status: status.type,
                                blockHash: status.asInBlock.toHex(),
                                method: method,
                            }});
                        }
                    });
                }else if(status.isFinalized) {
                    postMessage({method: VultureMessage.TRANSFER_ASSETS, params: {
                        status: status.type,
                        blockHash: status.asFinalized.toHex()
                    }});
                }else {
                    postMessage({method: VultureMessage.TRANSFER_ASSETS, params: {
                        status: status.type,
                    }});
                }
            });
        }
    }
    //Estimate tx fees
    if(event.data && event.data.method === VultureMessage.ESTIMATE_TX_FEE) {
        if(vault.seed != null && currentApi != null){
            currentApi.tx.balances.transferKeepAlive(event.data.params.recipent, event.data.params.amount).paymentInfo(currentKeypair).then((info) => {
                postMessage({method: VultureMessage.ESTIMATE_TX_FEE, params: {
                    success: true,
                    result: info.toJSON(),
                    fee: info.partialFee.toHuman()
                }});
            });
        }
    }
    //Verify valid address
    if(event.data && event.data.method === VultureMessage.IS_ADDRESS_VALID) {
        if(vault.seed != null && currentApi != null){
            let result = false;
            try {
                encodeAddress(
                    isHex(event.data.params.address)
                        ? hexToU8a(event.data.params.address)
                        : decodeAddress(event.data.params.address)
                );
                result = true;
            }catch(error) {
                result = false;
            }
            postMessage({method: VultureMessage.IS_ADDRESS_VALID, params: {
                success: true,
                isValid: result,
            }});
        }
    }
    //Query the account state.
    if(event.data && event.data.method === VultureMessage.GET_ACCOUNT_STATE) {
        if(vault.seed != null && currentApi != null){
            currentApi.query.system.account(currentKeypair.address).then((result) => {
                postMessage({method: VultureMessage.GET_ACCOUNT_STATE, params: {
                    success: true,
                    result: result.toJSON(),
                }});
            });
        }
    }
    //Subscribe to getting the account state.
    if(event.data && event.data.method === VultureMessage.SUB_TO_ACCOUNT_STATE) {
        if(vault.seed != null && currentApi != null){
            currentApi.query.system.account(currentKeypair.address, (result) => {
                postMessage({method: VultureMessage.SUB_TO_ACCOUNT_STATE, params: {
                    success: true,
                    result: result.toJSON(),
                }});
            });
        }
    }
    if(event.data && event.data.method === VultureMessage.SET_VAULT) {
        vault.seed = event.data.vault.seed;
    }
});
