
import { VultureMessage } from "../../src/vulture_backend/vultureMessage";
import { VultureRequest } from "../../src/vulture_backend/vultureRPC";
import { NetworkType } from "../../src/vulture_backend/wallets/IvultureWallet";

import { VultureNetwork } from './api/networkApi';
import { SubstrateNetwork } from './api/substrateNetwork';

var vault = {
    seed: ''
};

var currentWallet: VultureNetwork | null = null;

self.addEventListener("message", (event) => {
    if(event.data && event.data.method === VultureMessage.SET_CURRENT_WALLET) {

        switch(event.data.params.networkType as NetworkType)  {
            case NetworkType.Substrate: {
                currentWallet = new SubstrateNetwork(
                    event.data.params.keyring.seed, //seed
                    "//" + event.data.params.keyring.index, //derivation path
                    event.data.params.networkURI, //network websocket URI
                    event.data.params.addressFormat != null ? event.data.params.addressFormat : undefined
                );
                break;
            }
            case NetworkType.Solana: {
                console.error("Solana is not currently supported by vulture!");
                break;
            }
            case NetworkType.AVM:  {
                console.error("Avalanche VM is not currently supported by vulture!");
                break;
            }
            case NetworkType.PVM:  {
                console.error("Avalanche PVM is not currently supported by vulture!");
                break;
            }
            case NetworkType.EVM:  {
                console.error("EVM is not currently supported by vulture!");
                break;
            }
            default: {
                console.error("Invalid Network selected!");
                break;
            }
        }
    }

    if(event.data && event.data.method === VultureMessage.GET_ADDRESS_FROM_URI) {
        if(currentWallet != null) {
            currentWallet.generateAddress("//" + event.data.params.keyring.index, event.data.params.keyring.accountIndex);
        }else {
            console.error("Wallet hasn't been setup in vulture_worker yet!");
        }
        /*
        const keyring = new Keyring({type: 'sr25519'});
        let kp = keyring.addFromUri(event.data.params.keyring.seed + "//" + event.data.params.keyring.index);
        postMessage({method: VultureMessage.GET_ADDRESS_FROM_URI, params: {
            success: true,
            address: kp.address,
            accountIndex: event.data.params.keyring.accountIndex,
        }});
        console.log("Vulture Worker succesfully generated keypair");
         */
    }

    //Send assets
    if(event.data && event.data.method === VultureMessage.TRANSFER_ASSETS) {
        if(currentWallet != null){
            currentWallet.transferAssets(event.data.params.recipent, event.data.params.amount);

            /*
            currentApi.tx.balances.transferKeepAlive(event.data.params.recipent, event.data.params.amount).signAndSend(currentKeypair, ({events = [], status}) => {
                if(status.isInBlock) {

                    events.forEach(({event: {data, method, section}, phase}) => {
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
             */
        } else {
            console.error("Wallet hasn't been setup in vulture_worker yet!");
        }
    }
    //Estimate tx fees
    if(event.data && event.data.method === VultureMessage.ESTIMATE_TX_FEE) {
        if(currentWallet != null){
            currentWallet.estimateTxFee(event.data.params.recipent, event.data.params.amount);
        }else {
            console.error("Wallet hasn't been setup in vulture_worker yet!");
        }
    }
    //Verify valid address
    if(event.data && event.data.method === VultureMessage.IS_ADDRESS_VALID) {
        if(currentWallet != null) {
            currentWallet.validateAddress(event.data.params.address);
        }else {
            console.error("Wallet hasn't been setup in vulture_worker yet!");
        }
        /*
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
         */
    }
    //Query the account state.
    if(event.data && event.data.method === VultureMessage.GET_ACCOUNT_STATE) {
        if(currentWallet != null) {
            currentWallet.getAddressState();
        }else {
            console.error("Wallet hasn't been setup in vulture_worker yet!");
        }
        /*
        if(vault.seed != null && currentApi != null){
            currentApi.query.system.account(currentKeypair.address).then((result) => {
                postMessage({method: VultureMessage.GET_ACCOUNT_STATE, params: {
                    success: true,
                    result: result.toJSON(),
                }});
            });
        }
         */
    }
    //Subscribe to getting the account state.
    if(event.data && event.data.method === VultureMessage.SUB_TO_ACCOUNT_STATE) {

        if(currentWallet != null) {
            currentWallet.subscribeToAddressUpdates();
        }else {
            console.error("Wallet hasn't been setup in vulture_worker yet!");
        }

        /*
        if(vault.seed != null && currentApi != null){
            currentApi.query.system.account(currentKeypair.address, (result) => {
                postMessage({method: VultureMessage.SUB_TO_ACCOUNT_STATE, params: {
                    success: true,
                    result: result.toJSON(),
                }});
            });
        }
        */
    }

    //Not used anywhere right now, this is simply exploring seed-phrase caching.
    //The raw seed-phrase will never be cached without any encryption when the user
    //isn't using the wallet however.
    if(event.data && event.data.method === VultureMessage.SET_VAULT) {
        vault.seed = event.data.vault.seed;
    }
});

