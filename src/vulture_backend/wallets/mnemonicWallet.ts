import { WalletType, VultureAccount, Network, AccountData } from "./IvultureWallet";
import SafeEventEmitter from "@metamask/safe-event-emitter";

//import { KeyringPair } from "@polkadot/keyring/types";
//import { cryptoWaitReady } from '@polkadot/util-crypto';

import { BigNumber } from "bignumber.js";
import { VultureMessage } from "../vultureMessage";



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
                networkType: this.currentNetwork.networkType
            }
        });
    }


    async transferAssets(destination: String, amountWhole: number) {
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
    async estimateTxFee(destination: string, amountWhole: number) {


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
        this.worker.postMessage({
            method: VultureMessage.ESTIMATE_TX_FEE,
            params: {
                recipent: destination,
                amount: new BigNumber(amountWhole).times(new BigNumber(10).pow(this.currentNetwork.networkAssetDecimals)).toString()
            }
        });
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