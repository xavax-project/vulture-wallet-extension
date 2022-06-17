
import { VultureMessage } from "../../src/vulture_backend/vultureMessage";
import { NetworkType } from "../../src/vulture_backend/wallets/vultureWallet";

import { AccountActionHandler } from './apis/InetworkAPI';
import { SubstrateActions } from './apis/substrate/substrateActions';

/* -- Doc Note
 * accountActionWorker.ts is a worker which is initialized with an private key as well as info
 * of the current network; Afterwords the wallet may post requests for transactions which this
 * worker will perform on behalf of the user.
 * 
 * This worker is responsible for changing the state, as well as doing things which require
 * a signature, unlike accountInfoWorker.ts
 */

var wallet: AccountActionHandler | null = null;

self.addEventListener("message", async (event) => {
    if(event.data && event.data.method) {
        switch(event.data.method as string) {
            // Set the current active wallet/account/network. Called once on start, and when switching wallet/network.
            case VultureMessage.SET_CURRENT_WALLET: {
                switch(event.data.params.networkType as NetworkType) {
                    case NetworkType.Substrate: {
                        wallet = new SubstrateActions(event.data.params.initData);
                        break;
                    }
                    case NetworkType.EVM: {
                        console.error("Ethereum VM Support not yet added!");
                        break;
                    }
                    default: {
                        console.error("Network " + event.data.params.networkType + " not supported yet!");
                        break;
                    }
                }
                break;
            };
            // Generates and Returns an address with a given derivation path and returns it
            // along with a provided array index.
            case VultureMessage.GET_ADDRESS_FROM_URI: {
                await wallet?.generateAddress(event.data.params.addressURI, event.data.params.index);
                break;
            };
            // Translates a list of accounts to a different specified encoding (currently only substrate related)
            case VultureMessage.UPDATE_ACCOUNTS_TO_NETWORK: {
                await wallet?.updateAccountsToNetwork(event.data.params.accounts, event.data.params.network);
                break;
            }
            // Transfers assets
            case VultureMessage.TRANSFER_ASSETS: {
                await wallet?.transferAssets(event.data.params.recipent, event.data.params.amount,
                                 event.data.params.token == null ? null : event.data.params.token)
                break;
            }
            // Gets a transaction-fee estimate without signing/sending a transaction.
            case VultureMessage.ESTIMATE_TX_FEE: {
                await wallet?.estimateTxFee(event.data.params.recipent, event.data.params.amount, event.data.params.token == null ? null : event.data.params.token);
                break;
            }
            default: {
                console.log("Vulture accountActionWorker does not have a '" + event.data.method + "' event, which was called.");
                break;
            }
        }
    }
});