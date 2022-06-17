
import { AbstractToken } from "../../src/vulture_backend/types/abstractToken";
import { VultureMessage } from "../../src/vulture_backend/vultureMessage";
import { VultureRequest } from "../../src/vulture_backend/vultureRPC";
import { NetworkType } from "../../src/vulture_backend/wallets/vultureWallet";

import { VultureNetwork } from './apis/InetworkAPI';
import { SubstrateNetwork } from './apis/substrate/substrateNetwork';

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

    //Generate an address from a URI (URI in this case is the derivation path index & the account index (which account in the back-end the address
    //corresponds to))
    if(event.data && event.data.method === VultureMessage.GET_ADDRESS_FROM_URI) {
        if(currentWallet != null) {
            currentWallet.generateAddress(event.data.params.keyring.addressURI, event.data.params.keyring.accountIndex);
        }else {
            console.error("Wallet hasn't been setup in vulture_worker yet!");
        }
    }

    //Update the given accounts (the address encoding format) to a new network, and send the new addresses to the wallet backend.
    if(event.data && event.data.method === VultureMessage.UPDATE_ACCOUNTS_TO_NETWORK) {
        if(currentWallet != null) {
            currentWallet.updateAccountsToNetwork(event.data.params.accounts, event.data.params.network);
        }else {
            console.error("Wallet hasn't been setup in vulture_worker yet!");
        }
    }

    //Send assets
    if(event.data && event.data.method === VultureMessage.TRANSFER_ASSETS) {
        if(currentWallet != null){
            
            currentWallet.transferAssets(event.data.params.recipent, event.data.params.amount, event.data.params.token == null ? null : event.data.params.token);
        } else {
            console.error("Wallet hasn't been setup in vulture_worker yet!");
        }
    }
    //Estimate tx fees
    if(event.data && event.data.method === VultureMessage.ESTIMATE_TX_FEE) {
        if(currentWallet != null){
            currentWallet.estimateTxFee(event.data.params.recipent, event.data.params.amount, event.data.params.token == null ? null : event.data.params.token);
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
    }
    //Get information about a token and return the data.
    if(event.data && event.data.method === VultureMessage.GET_TOKEN_DATA) {
        if(currentWallet != null) {
            currentWallet.getTokenData(event.data.params.tokenAddress, event.data.params.tokenType);
        }else {
            console.error("Wallet hasn't been setup in vulture_worker yet!");
        }
    }
    //Get the balance of a token and return it.
    if(event.data && event.data.method === VultureMessage.GET_TOKEN_BALANCE) {
        if(currentWallet != null) {
            //currentWallet.getBalanceOfToken(event.data.params.tokenAddress, event.data.params.tokenType, event.data.params.arrayIndexOfToken);
        }else {
            console.error("Wallet hasn't been setup in vulture_worker yet!");
        }
    }
    //Query the account state.
    if(event.data && event.data.method === VultureMessage.GET_ACCOUNT_STATE) {
        if(currentWallet != null) {
            currentWallet.getAddressState();
        }else {
            console.error("Wallet hasn't been setup in vulture_worker yet!");
        }
    }
    //Subscribe to getting the account state.
    if(event.data && event.data.method === VultureMessage.SUBSCRIBE_TO_ACC_EVENTS) {
        if(currentWallet != null) {
            currentWallet.subscribeToAddressUpdates();
        }else {
            console.error("Wallet hasn't been setup in vulture_worker yet!");
        }
    }

    //Not used anywhere right now, this is simply exploring seed-phrase caching.
    //The raw seed-phrase will never be cached without any encryption when the user
    //isn't using the wallet.
    if(event.data && event.data.method === VultureMessage.SET_VAULT) {
        vault.seed = event.data.vault.seed;
    }
});

