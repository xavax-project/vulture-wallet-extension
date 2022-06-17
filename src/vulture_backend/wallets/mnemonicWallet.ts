import { WalletType, VultureAccount, Network, AccountData } from "./vultureWallet";
import SafeEventEmitter from "@metamask/safe-event-emitter";

//import { KeyringPair } from "@polkadot/keyring/types";
//import { cryptoWaitReady } from '@polkadot/util-crypto';

import { BigNumber } from "bignumber.js";
import { VultureMessage } from "../vultureMessage";
import { AbstractToken } from "../types/abstractToken";
import { SubstrateInitData } from "../../../vulture_scripts/src/apis/substrate/substrateActions";



export class MnemonicWallet implements VultureAccount {

    public actionWorker;
    public infoWorker;

    public accountEvents = new SafeEventEmitter();
    public accountData: AccountData;
    public currentNetwork: Network;
    public updateTokenBalance: any;
    isWalletActive: boolean = false;

    constructor(seedPhrase: string, accountData: AccountData, network: Network) {
        this.accountEvents.setMaxListeners(50);
        this.accountData = accountData;
        this.currentNetwork = network;

        // Create the two wallet back-end workers. These handle most of the hard work.
        this.actionWorker = new Worker('accountActionWorker-bundle.js', {
            type: 'module',
            credentials: 'same-origin'
        });
        this.infoWorker = new Worker('accountInfoWorker-bundle.js', {
            type: 'module',
            credentials: "same-origin"
        });

        // Callback for SET_CURRENT_WALLET from the action worker.
        this.actionWorker.onmessage = async (event) => {
            if(event.data.method == VultureMessage.SET_CURRENT_WALLET) {
                if(event.data.params.success == true) {
                    this.isWalletActive = true;
                    this.accountData.address = event.data.params.address;

                    // Initialize the AccountInfoWorker, which is a query/info focused keyless worker.
                    this.infoWorker.postMessage({
                        method: VultureMessage.SET_CURRENT_WALLET,
                        params: {
                            address: this.accountData.address,
                            derivationPath: this.accountData.derivationPath,
                            networkURI: this.currentNetwork.networkUri,
                            networkType: this.currentNetwork.networkType
                        },
                    });
                }
            }
        }
        // Callback for SET_CURRENT_WALLET from the info worker.
        this.infoWorker.onmessage = async (event) => {
            if(event.data.method == VultureMessage.SET_CURRENT_WALLET) {
                if(event.data.params.success == true) {
                    console.info("Information worker initialized.");

                    // Subscribe to account events after our info worker is initialized.
                    await this.subscribeToAccountEvents();

                    // This is quite temporary.
                    this.updateTokenBalance = setInterval(async () => {
                        this.accountEvents.emit(VultureMessage.GET_TOKEN_BALANCE);
                    }, 3000);
                }else {
                    console.error("Failed to initialize infoWorker: " + event.data.params.error);
                }
            }
        }


        // Call SET_CURRENT_WALLET for the actionWorker (this worker has the capability of signing txs).
        this.actionWorker.postMessage({
            method: VultureMessage.SET_CURRENT_WALLET,
            params: {
                initData: new SubstrateInitData(
                    seedPhrase,
                    this.accountData.derivationPath,
                    this.currentNetwork.networkUri,
                    this.currentNetwork.addressFormat == null ? "42" : this.currentNetwork.addressFormat,
                    "sr25519"
                ),
                networkType: this.currentNetwork.networkType
            } 
        });
    }
    async terminateWallet() {
        this.actionWorker.terminate();
        this.infoWorker.terminate();
        clearInterval(this.updateTokenBalance);
    }
    async transferAssets(destination: String, amountWhole: number, token?: AbstractToken) {
        // The event callback from the worker, containing the Transaction info.
        this.actionWorker.onmessage = (event) => {
            if(event.data.method == VultureMessage.TRANSFER_ASSETS) {
                // Emit the transation info data to accountEvents, so the front-end can use it!
                this.accountEvents.emit(VultureMessage.TRANSFER_ASSETS, event.data.params);
                this.accountEvents.emit(VultureMessage.GET_TOKEN_BALANCE);
            }
        };
        // Posting a tx request to the worker.
        this.actionWorker.postMessage({
            method: VultureMessage.TRANSFER_ASSETS,
            params: {
                recipent: destination,
                amount: new BigNumber(amountWhole).times(new BigNumber(10).pow(this.currentNetwork.networkAssetDecimals)).toString(),
                token: token == null ? null : JSON.parse(JSON.stringify(token))
            }
        });
    }
    async getTokenInformation(tokenAddress: string, tokenType: string) {
        this.infoWorker.onmessage = (event) => {
            if(event.data.method == VultureMessage.GET_TOKEN_DATA) {
                this.accountEvents.emit(VultureMessage.GET_TOKEN_DATA, event.data);
                if(event.data.params.success == false) {
                    console.error("Error: Vulture failed to get information about token with address:\n '" + tokenAddress + "'.");
                }
            }
        }
        this.infoWorker.postMessage({
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
     */
    async estimateTxFee(destination: string, amountWhole: number, token?: AbstractToken) {

        // The Event-Callback from the worker will contain the fee data.
        this.actionWorker.onmessage = (event) => {
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
        this.actionWorker.postMessage({
            method: VultureMessage.ESTIMATE_TX_FEE,
            params: {
                recipent: destination,
                amount: new BigNumber(amountWhole).times(new BigNumber(10).pow(token == null ? this.currentNetwork.networkAssetDecimals : token.decimals)).toString(),
                token: token == null ? null : JSON.parse(JSON.stringify(token)) // Due to the fact that the token is a proxy, need to stringify/parse. Temp solution.
            }
        });
        
    }
    async isAddressValid(address: string) {
        this.infoWorker.onmessage = async (event) => {
            if(event.data.method == VultureMessage.IS_ADDRESS_VALID) {
                if(event.data.params.success == true) {
                    this.accountEvents.emit(VultureMessage.IS_ADDRESS_VALID, event.data.params.isValid);
                }else {
                    console.error("Error: Vulture worker failed to get wallet state!");
                }
            }
        };
        this.infoWorker.postMessage({
            method: VultureMessage.IS_ADDRESS_VALID,
            params: {
                address: address,
            }
        });
    }
    //Subscribe to account state
    async updateAccountState() {
        this.infoWorker.postMessage({
            method: VultureMessage.GET_ACCOUNT_STATE
        });
    }

    async subscribeToAccountEvents() {
        this.infoWorker.addEventListener("message", async(event) => {
            
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
            if(event.data.method == VultureMessage.SUBSCRIBE_TO_ACC_EVENTS) {
                if(event.data.params.success == true) {

                    
                    //5 decimals is enuff (for this purpose of showing the amount)...
                    let amount = new BigNumber(event.data.params.result.data.free);
                    //Our Whole asset amount is the result divided by 10 to the power of the denomination/smallest fraction.
                    let wholeAmount = amount.div(new BigNumber(10).pow(this.currentNetwork.networkAssetDecimals));
                    
                    this.accountData.freeAmountWhole = wholeAmount.toNumber();
                    this.accountData.freeAmountSmallestFraction = amount.toString();
                    this.accountData.accountNonce = event.data.params.result.nonce;

                    //Update tokens as well.
                    this.accountEvents.emit(VultureMessage.GET_TOKEN_BALANCE);
                }else {
                    console.error("Error: Vulture worker failed to get wallet state!");
                }
            }
        });

        this.infoWorker.postMessage({
            method: VultureMessage.SUBSCRIBE_TO_ACC_EVENTS
        });
    }
}