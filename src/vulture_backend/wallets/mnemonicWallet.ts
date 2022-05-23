import { WalletType, VultureAccount, Network, AccountData } from "./vultureWallet";
import SafeEventEmitter from "@metamask/safe-event-emitter";

//import { KeyringPair } from "@polkadot/keyring/types";
//import { cryptoWaitReady } from '@polkadot/util-crypto';

import { BigNumber } from "bignumber.js";
import { VultureMessage } from "../vultureMessage";
import { AbstractToken } from "../types/abstractToken";



export class MnemonicWallet implements VultureAccount {

    public worker = new Worker('vulture_worker-bundle.js');

    public accountEvents = new SafeEventEmitter();
    public accountData: AccountData;
    public currentNetwork: Network;
    isWalletActive: boolean = false;

    constructor(seedPhrase: string, accountData: AccountData, network: Network) {
        this.accountData = accountData;
        this.currentNetwork = network;
        this.worker.onmessage = (event) => {
            if(event.data.method == VultureMessage.SET_CURRENT_WALLET) {
                if(event.data.params.success == true) {
                    this.isWalletActive = true;
                    this.accountData.address = event.data.params.address;
                    
                    this.updateAccountState();     
                }else {
                    console.error("Error: Vulture worker failed to setup Substrate wallet!");
                }
            }

        };
        this.worker.postMessage({
            method: VultureMessage.SET_CURRENT_WALLET,
            params: {
                keyring: {
                    type: 'sr25519',
                    uri: seedPhrase + "//" + this.accountData.accountIndex,

                    seed: seedPhrase,
                    index: this.accountData.accountIndex
                },
                networkURI: network.networkUri,
                networkType: this.currentNetwork.networkType,
                addressFormat: this.currentNetwork.addressFormat != undefined ? this.currentNetwork.addressFormat : null,
            }
        });
    }


    async transferAssets(destination: String, amountWhole: number, token?: AbstractToken) {

        // The event callback from the worker, containing the Transaction info.
        this.worker.onmessage = (event) => {
            if(event.data.method == VultureMessage.TRANSFER_ASSETS) {
                // Emit the transation info data to accountEvents, so the front-end can use it!
                this.accountEvents.emit(VultureMessage.TRANSFER_ASSETS, event.data.params);
            }
        };
        // Posting a tx request to the worker.
        this.worker.postMessage({
            method: VultureMessage.TRANSFER_ASSETS,
            params: {
                recipent: destination,
                amount: new BigNumber(amountWhole).times(new BigNumber(10).pow(this.currentNetwork.networkAssetDecimals)).toString(),
                token: token == null ? null : JSON.parse(JSON.stringify(token))
            }
        });
        
        /* TODO: Delete after proper testing.          
        if(token) {
            console.error("Sending and receiving tokens is not supported yet!");
        }else {
            this.worker.onmessage = (event) => {
                if(event.data.method == VultureMessage.TRANSFER_ASSETS) {
                    this.accountEvents.emit(VultureMessage.TRANSFER_ASSETS, event.data.params);
                }
            };
            this.worker.postMessage({
                method: VultureMessage.TRANSFER_ASSETS,
                params: {
                    recipent: destination,
                    amount: new BigNumber(amountWhole).times(new BigNumber(10).pow(this.currentNetwork.networkAssetDecimals)).toString()
                }
            });
        }
         */
    }
    async getTokenInformation(tokenAddress: string, tokenType: string) {
        this.worker.onmessage = (event) => {
            if(event.data.method == VultureMessage.GET_TOKEN_DATA) {
                this.accountEvents.emit(VultureMessage.GET_TOKEN_DATA, event.data);
                if(event.data.params.success == false) {
                    console.error("Error: Vulture failed to get information about token with address:\n '" + tokenAddress + "'.");
                }
            }
        }

        this.worker.postMessage({
            method: VultureMessage.GET_TOKEN_DATA,
            params: {
                tokenAddress: tokenAddress,
                tokenType: tokenType,
            } 
        });
    }
    /** ## estimateTxFee()
     * This function will request an estimate transaction fee for the given transaction parameters.
     * The fee data will be sent as an event to `accountEvents` with the `VultureMessage` 'ESTIMATE_TX_FEE'.
     * 
     * 
     */
    async estimateTxFee(destination: string, amountWhole: number, token?: AbstractToken) {

        // The Event-Callback from the worker will contain the fee data.
        this.worker.onmessage = (event) => {
            if(event.data.method == VultureMessage.ESTIMATE_TX_FEE) {
                if(event.data.params.success == true) {
                    let fee = new BigNumber(event.data.params.result.partialFee)
                    .div(new BigNumber(10).pow(token == null ? this.currentNetwork.networkAssetDecimals : token.decimals)).toNumber();

                    // Emit the event containing the tx fee data to accountEvents (used by the front-end ^-^).
                    this.accountEvents.emit(VultureMessage.ESTIMATE_TX_FEE, fee);
                }else {
                    console.error("Error: Vulture worker failed to get wallet state!");
                }
            }
        };
        
        // Posting a request to estimate Tx Fee to the vulture worker.
        this.worker.postMessage({
            method: VultureMessage.ESTIMATE_TX_FEE,
            params: {
                recipent: destination,
                amount: new BigNumber(amountWhole).times(new BigNumber(10).pow(token == null ? this.currentNetwork.networkAssetDecimals : token.decimals)).toString(),
                token: token == null ? null : JSON.parse(JSON.stringify(token)) // Due to the fact that the token is a proxy, need to stringify/parse. Temp solution.
            }
        });

        /* TODO: Delete after enough testing.
        if(token) {
            console.error("Sending and receiving tokens is not supported yet!");
            console.log("Tried to send token: ", token.name);
    
            // The Event-Callback from the worker will contain the fee data.
            this.worker.onmessage = (event) => {
                if(event.data.method == VultureMessage.ESTIMATE_TX_FEE) {
                    if(event.data.params.success == true) {
    
                        let fee = new BigNumber(event.data.params.result.partialFee)
                        .div(new BigNumber(10).pow(this.currentNetwork.networkAssetDecimals)).toNumber();
    
                        // Emit the event containing the tx fee data to general accountEvents (used by the front-end ^-^).
                        this.accountEvents.emit(VultureMessage.ESTIMATE_TX_FEE, fee);
                    }else {
                        console.error("Error: Vulture worker failed to get wallet state!");
                    }
                }
            };
            
            // Posting a request to estimate Tx Fee to the vulture worker.
            this.worker.postMessage({
                method: VultureMessage.ESTIMATE_TX_FEE,
                params: {
                    recipent: destination,
                    amount: new BigNumber(amountWhole).times(new BigNumber(10).pow(token.decimals)).toString(),
                    token: token == null ? null : token
                }
            });
    
        }else {
    
            // The Event-Callback from the worker will contain the fee data.
            this.worker.onmessage = (event) => {
                if(event.data.method == VultureMessage.ESTIMATE_TX_FEE) {
                    if(event.data.params.success == true) {
                        let fee = new BigNumber(event.data.params.result.partialFee)
                        .div(new BigNumber(10).pow(this.currentNetwork.networkAssetDecimals)).toNumber();
                        this.accountEvents.emit(VultureMessage.ESTIMATE_TX_FEE, fee);
                    }else {
                        console.error("Error: Vulture worker failed to get wallet state!");
                    }
                }
            };
    
            // Posting a request to estimate Tx Fee to the vulture worker.
            this.worker.postMessage({
                method: VultureMessage.ESTIMATE_TX_FEE,
                params: {
                    recipent: destination,
                    amount: new BigNumber(amountWhole).times(new BigNumber(10).pow(this.currentNetwork.networkAssetDecimals)).toString()
                }
            });
        }
        
        */
        
    }
    async isAddressValid(address: string) {
        this.worker.onmessage = (event) => {
            if(event.data.method == VultureMessage.IS_ADDRESS_VALID) {
                if(event.data.params.success == true) {
                    this.accountEvents.emit(VultureMessage.IS_ADDRESS_VALID, event.data.params.isValid);
                }else {
                    console.error("Error: Vulture worker failed to get wallet state!");
                }
            }
        };
        this.worker.postMessage({
            method: VultureMessage.IS_ADDRESS_VALID,
            params: {
                address: address,
            }
        });
    }
    //Subscribe to account state
    async updateAccountState() {
        this.worker.onmessage = (event) => {
            if(event.data.method == VultureMessage.GET_ACCOUNT_STATE) {
                if(event.data.params.success == true) {
                    let amount = new BigNumber(event.data.params.result.data.free);
                    let wholeAmount = amount.div(new BigNumber(10).pow(this.currentNetwork.networkAssetDecimals));
                    
                    this.accountData.freeAmountWhole = wholeAmount.toNumber();
                    this.accountData.freeAmountSmallestFraction = amount.toString();
                    this.accountData.accountNonce = event.data.params.result.nonce;
                }else {
                    console.error("Error: Vulture worker failed to get wallet state!");
                }
            }

            //The event callback for SUB_TO_ACCOUNT_STATE
            if(event.data.method == VultureMessage.SUB_TO_ACCOUNT_STATE) {
                if(event.data.params.success == true) {
                    //5 decimals is enuff (for this purpose of showing the amount)...
                    let amount = new BigNumber(event.data.params.result.data.free);
                    //Our Whole asset amount is the result divided by 10 to the power of the denomination/smallest fraction.
                    let wholeAmount = amount.div(new BigNumber(10).pow(this.currentNetwork.networkAssetDecimals));

                    this.accountData.freeAmountWhole = wholeAmount.toNumber();
                    this.accountData.freeAmountSmallestFraction = amount.toString();
                    this.accountData.accountNonce = event.data.params.result.nonce;
                }else {
                    console.error("Error: Vulture worker failed to get wallet state!");
                }
            }
        };
        this.worker.postMessage({
            method: VultureMessage.GET_ACCOUNT_STATE
        });
        this.worker.postMessage({
            method: VultureMessage.SUB_TO_ACCOUNT_STATE
        });
    }
}