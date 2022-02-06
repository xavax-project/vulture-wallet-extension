import { WalletType, VultureAccount, Network, AccountData } from "./IvultureWallet";
import SafeEventEmitter from "@metamask/safe-event-emitter";

//import { KeyringPair } from "@polkadot/keyring/types";
//import { cryptoWaitReady } from '@polkadot/util-crypto';

import { BigNumber } from "bignumber.js";
import { VultureMessage } from "../vultureMessage";



export class MnemonicSubstrateWallet implements VultureAccount {


    public accountEvents = new SafeEventEmitter();
    public accountData: AccountData;
    isWalletActive: boolean = false;

    constructor(seedPhrase: string, accountData: AccountData) {
        this.accountData = accountData;


        navigator.serviceWorker.onmessage = (event) => {
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
        navigator.serviceWorker.controller?.postMessage({
            method: VultureMessage.SET_CURRENT_WALLET,
            params: {
                keyring: {
                    type: 'sr25519',
                    uri: seedPhrase + "//" + this.accountData.accountIndex + "/" +"0",
                },
                network: this.accountData.network.networkUri
            }
        });
    }


    async transferAssets(destination: String, amountWhole: number) {
        navigator.serviceWorker.onmessage = (event) => {
            if(event.data.method == VultureMessage.TRANSFER_ASSETS) {
                this.accountEvents.emit(VultureMessage.TRANSFER_ASSETS, event.data.params);
            }
        };
        navigator.serviceWorker.controller?.postMessage({
            method: VultureMessage.TRANSFER_ASSETS,
            params: {
                recipent: destination,
                amount: new BigNumber(amountWhole).times(new BigNumber(10).pow(this.accountData.network.networkAssetDecimals)).toString()
            }
        });
    }
    async estimateTxFee(destination: string, amountWhole: number) {


        navigator.serviceWorker.onmessage = (event) => {
            if(event.data.method == VultureMessage.ESTIMATE_TX_FEE) {
                if(event.data.params.success == true) {
                    let fee = new BigNumber(event.data.params.result.partialFee)
                    .div(new BigNumber(10).pow(this.accountData.network.networkAssetDecimals)).toNumber();
                    this.accountEvents.emit(VultureMessage.ESTIMATE_TX_FEE, fee);
                }else {
                    console.error("Error: Vulture worker failed to get wallet state!");
                }
            }
        };
        navigator.serviceWorker.controller?.postMessage({
            method: VultureMessage.ESTIMATE_TX_FEE,
            params: {
                recipent: destination,
                amount: new BigNumber(amountWhole).times(new BigNumber(10).pow(this.accountData.network.networkAssetDecimals)).toString()
            }
        });
    }
    async isAddressValid(address: string) {
        navigator.serviceWorker.onmessage = (event) => {
            if(event.data.method == VultureMessage.IS_ADDRESS_VALID) {
                if(event.data.params.success == true) {
                    this.accountEvents.emit(VultureMessage.IS_ADDRESS_VALID, event.data.params.isValid);
                }else {
                    console.error("Error: Vulture worker failed to get wallet state!");
                }
            }
        };
        navigator.serviceWorker.controller?.postMessage({
            method: VultureMessage.IS_ADDRESS_VALID,
            params: {
                address: address,
            }
        });
    }
    //Subscribe to account state
    async updateAccountState() {
        navigator.serviceWorker.onmessage = (event) => {
            if(event.data.method == VultureMessage.GET_ACCOUNT_STATE) {
                if(event.data.params.success == true) {
                    let amount = new BigNumber(event.data.params.result.data.free);
                    let wholeAmount = amount.div(new BigNumber(10).pow(this.accountData.network.networkAssetDecimals));
                    
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
                    let wholeAmount = amount.div(new BigNumber(10).pow(this.accountData.network.networkAssetDecimals));

                    this.accountData.freeAmountWhole = wholeAmount.toNumber();
                    this.accountData.freeAmountSmallestFraction = amount.toString();
                    this.accountData.accountNonce = event.data.params.result.nonce;
                    console.log(event.data.params.result);
                }else {
                    console.error("Error: Vulture worker failed to get wallet state!");
                }
            }
        };
        navigator.serviceWorker.controller?.postMessage({
            method: VultureMessage.GET_ACCOUNT_STATE
        });
        navigator.serviceWorker.controller?.postMessage({
            method: VultureMessage.SUB_TO_ACCOUNT_STATE
        });
    }
}