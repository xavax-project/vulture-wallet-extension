import localforage from "localforage";
import { VultureMessage } from "../vultureMessage";
import { encrypt } from "@metamask/browser-passworder";
import { MnemonicSubstrateWallet } from "./mnemonicSubstrateWallet";
import SafeEventEmitter from "@metamask/safe-event-emitter";

/* --- Note # xavax # we are one @
    IvultureWallet.ts contains interfaces that are used by the Vulture wallet.

    The accounts-system that Vulture uses is as follows:
    The user can create multiple accounts, each account will increment the derivation path to derive
    a new account (always hardened accounts).

    Each account can also be manually set to use different networks that are based on Substrate, (Aleph Zero by default).
*/



/*@---------------------------------Wallet Interfaces/Enums-------------------------------@*/

export interface Vault {
    seed: string
}

/** ## AccountData
* The relevant Data each VultureAccount has, for example the address, derivation path, name, assetAmount, etc.
*/
export interface AccountData {
    /** ## accountName 
    * An arbitrary name given by the user whenever they create an account! :)
    */
    accountName: string,
    /** ## address 
    * The address of this account.
    */
    address: string,
    /** ## derivationPath 
    * the Derivation path of this account, vulture uses
    * `//hard-value/soft-value`, where we increment the hard-value
    * every account.
    */
    derivationPath: string;
    /** ## freeAmount 
    * The free amount of native assets this account holds (on the current network
    * the acccount is connected to).
    * 
    * Precise up to 9 decimals.
    * 
    * This amount is Whole, meaning not a fraction of a whole unit of whatever asset the
    * VultureAccount network is connected to.
    */
    /** ## accountIndex 
    * The hard-value number in the derivation path.
    */
    accountIndex: number;
    freeAmountWhole: number;
    freeAmountSmallestFraction: string;
    accountNonce: number;
    network: Network;
    walletType: WalletType;
}


/** ## WalletType
* The WalletType signifies whether a wallet account is derived from a MnemonicPhrase, or Hardware wallets such as
* Ledger or Trezor.
*/
export enum WalletType {
    MnemonicPhrase,
    Ledger,
    Trezor
}
export enum NetworkType {
    SolanaRuntime,
    Avalanche,
    Substrate,
    EVM,
}

export interface Network {
    /** ## networkUri
     * The Websocket URI to the network node. 
     */
    networkUri: string;
    networkAssetPrefix: string;
    networkName: string;
    networkAssetDecimals: number;
    /** ## networkColor
    * A hex value of the color-theme of the network (mainly here for front-end visual purposes)...
    */
    networkColor: string;
    networkType: NetworkType;
}

/** ## VultureAccount
 * the Vulture wallet will create accounts where the derivation-path is incremented with every account. A VultureAccount
 * represents an account in its entire form, i.e address, derivation path, the amount the address has, the network it is
 * connected to, as well as methods that can be called to do things such as transfer assets.
 */
export interface VultureAccount {

    /** ## accountEvents
    * Due to the fact that a lot of computations happen in service & web workers, we use events
    * to communicate the result of certain computations.
    * 
    * An example would be estimating a transaction fee, the flow of such a task would be something
    * like this:
    * 
    * ### Example:
    * 
    * ```
    * let account: VultureAccountImplementor;
    * let currentFee: number = 0;
    * 
    * //Setup a once event callback for estimating a tx fee
    * account.ccountEvents.once(vultureMessage.ESTIMATE_TX_FEE, (fee) => {
    *       console.log("Fee in precise Whole units: " + fee);
    *       currentFee = fee; 
    * });
    * 
    * //Call the estimateTxFee(); Method that exists in VultureAccount implementors/
    * account.estimateTxFee('Destination', '1.42');
    * ```
    */
    accountEvents: SafeEventEmitter;

    /** ## accountData
    * The relevant Data each VultureAccount has, for example the address, derivation path, name, assetAmount, etc.
    */
    accountData: AccountData

    /** ## transferAssets();
     * docs: Todo
     */
    transferAssets(destination: string, amountWhole: number): Promise<void>;
    /** ## estimateTxFee();
     * docs: Todo
     */
    estimateTxFee(destination: string, amountWhole: number): Promise<void>;
    /** ## updateAccountState();
     * docs: Todo
     */
    /** ## updateAccountState();
     * docs: Todo
     */
    isAddressValid(address: string): Promise<void>;
    updateAccountState(): Promise<void>;   
}

/** # VultureAccountStore
 * Stores information about all accounts the wallet has, not including
 * a seed-phrase/private key.
 */
export interface VultureAccountStore {
    allAccounts: AccountData[],
    nextAccountDerivIndex: number,
    currentlySelected: number
}

/*@---------------------------------Wallet Classes-------------------------------@*/

export class DefaultNetworks {
    public AlephZeroTestNet: Network = {
        networkUri: 'wss://ws.test.azero.dev',
        networkAssetPrefix: 'TZERO',
        networkName: 'Aleph Zero Testnet',
        networkAssetDecimals: 12,
        networkColor: '#4dff97',
        networkType: NetworkType.Substrate,
    }
    public AlephZero: Network = {
        networkUri: 'wss://ws.azero.dev',
        networkAssetPrefix: 'AZERO',
        networkName: 'Aleph Zero',
        networkAssetDecimals: 12,
        networkColor: '#4dff97',
        networkType: NetworkType.Substrate,
    }
    public Kusama: Network = {
        networkUri: 'wss://kusama-rpc.polkadot.io',
        networkAssetPrefix: 'KSM',
        networkName: 'Kusama',
        networkAssetDecimals: 12,
        networkColor: '#cd0061',
        networkType: NetworkType.Substrate,
    }
    public allNetworks: Map<string, Network> = new Map([
        [
            this.AlephZero.networkName,
            this.AlephZero
        ],
        [
            this.AlephZeroTestNet.networkName,
            this.AlephZeroTestNet
        ],
        [
            this.Kusama.networkName,
            this.Kusama
        ],
    ]);
    constructor() {}
}

export class VultureWallet {
    public currentWallet!: VultureAccount;
    public allAccounts: AccountData[] = [];
    public nextDerivIndex: number = 0;
    public vault!: Vault;
    public selectedWalletIndex!: number;

    constructor(vault?: Vault, accountStore?: VultureAccountStore) {
        if(vault && accountStore)
        {
            this.selectedWalletIndex = accountStore.currentlySelected;
            this.vault = vault;
            this.nextDerivIndex = accountStore.nextAccountDerivIndex;
            this.allAccounts = accountStore.allAccounts;
            if(accountStore.allAccounts[accountStore.currentlySelected - 1].walletType == WalletType.MnemonicPhrase) {
                this.currentWallet = new MnemonicSubstrateWallet(vault.seed, accountStore.allAccounts[accountStore.currentlySelected - 1]);
            }else {
                console.error("Error: Ledger wallets not currently supported!");
            }
        }
    }

    initWallet(vault: Vault, accountStore: VultureAccountStore) {
        this.vault = vault;
        this.nextDerivIndex = accountStore.nextAccountDerivIndex;
        this.selectedWalletIndex = accountStore.currentlySelected;
        this.allAccounts = accountStore.allAccounts;
        if(accountStore.allAccounts[accountStore.currentlySelected - 1].walletType == WalletType.MnemonicPhrase) {
            this.currentWallet = new MnemonicSubstrateWallet(vault.seed, accountStore.allAccounts[accountStore.currentlySelected - 1]);
        }else {
            console.error("Error: Ledger wallets not currently supported!");
        }
    }

    async switchWallet(index: number) {
        //this is kinda fked, I'll update it to something more elegant later...
        localforage.getItem("vultureAccounts").then((value) => {
            if(value != null) {
                let store = value as VultureAccountStore;
                store.currentlySelected = index;
                this.selectedWalletIndex = index;

                localforage.setItem("vultureAccounts", JSON.parse(JSON.stringify(store))).catch((err) => {
                    console.error(err);
                });

                this.currentWallet = new MnemonicSubstrateWallet(this.vault.seed, this.allAccounts[index - 1]);    
 
            }else {
                console.error("Failed loading vultureAccounts!");
                return false;
            }
        });

    }
    switchNetwork() {
        navigator.serviceWorker.onmessage = (event) => {
            if(event.data.method == VultureMessage.SET_NETWORK) {
                this.currentWallet.updateAccountState();
            }
        };
        navigator.serviceWorker.controller?.postMessage({
            method: VultureMessage.SET_NETWORK,
            params: {
                network: JSON.parse(JSON.stringify(this.currentWallet.accountData.network)),
            },
        });
    }
    saveAccounts() {
        localforage.getItem("vultureAccounts").then((value) => {
            if(value != null) {
                let val: VultureAccountStore = value as VultureAccountStore;
                val.allAccounts = this.allAccounts;
                localforage.setItem("vultureAccounts", JSON.parse(JSON.stringify(val))).catch((err) => {
                    console.error(err);
                });
            }else {
                console.error("Can't save accounts if you don't have one...");
            }
        });
    }
    createAccount(network: Network, accountName: string, walletType: WalletType) {
        createNewAccount(network, accountName, walletType).then((account) => {
            navigator.serviceWorker.onmessage = (event) => {
                if(event.data.method == VultureMessage.GET_ADDRESS_FROM_URI && event.data.params.success == true) {
                    this.allAccounts[event.data.params.accountIndex - 1].address = event.data.params.address;
                    this.saveAccounts();
                }
            };

            //WASM makes it necessary to use postMessage for all sr25519 cryptography, makes things more
            //complicated to read and more asynchronous in nature but it's either that or use a native
            //js sr25519 package (no audited ones exist...).

            this.allAccounts.push(account);
            this.nextDerivIndex = account.accountIndex + 1;

            navigator.serviceWorker.controller?.postMessage({
                method: VultureMessage.GET_ADDRESS_FROM_URI,
                params: {
                    keyring: {
                        type: 'sr25519',
                        uri: this.vault.seed + account.derivationPath,
                        accountIndex: this.allAccounts.length,
                    }
                }
            });
        });
    }
    popAccount() {
        removeLatestAccount().then((success) => {
            if(success) {
                //If the selected account is the one we are popping, select the previous account
                if(this.selectedWalletIndex == this.allAccounts.length) {
                    this.selectedWalletIndex--;
                    this.switchWallet(this.selectedWalletIndex);
                }
                this.allAccounts.pop();
                this.nextDerivIndex--;
            }
        })
    }

}

/*@---------------------------------Wallet functions-------------------------------@*/

/** # doesWalletExist()
 *  Returns true or false depending on if a wallet has been created, Wallet meaning VultureAccountStore, not Seed-phrase.
 *  Although
 */
export async function doesWalletExist() {
    return localforage.getItem("vultureAccounts").then((value) => {
        if(value != null) {
            return true;
        } else {
            return false;
        }
    });
}

/** # deleteWallet()
 *  Deletes the wallet and all its data from storage. The user will need to
 *  create a new wallet.
 */
export async function deleteWallet() {
    await localforage.removeItem("vault");
    await localforage.removeItem("vultureAccounts");
}

/** # createVault()
 *  Creates a `Vault` and saves it to localstorage (encrypted) and also caches it
 *  in the service worker for 3 minutes (un-encrypted).
 * 
 * ## Note:
 * `createVault()` will not override the existing vault, if one already exists the function will
 * simply print an error.
 */
export function createVault(vault: Vault, password: string) {
    localforage.getItem("vault").then((value) => {
        if(value != null){
            console.error("Error: Tried creating a vault when a vault already exists!");
            return;
        }else {
            encrypt(password, vault).then( async (blob) => {
                localforage.setItem("vault", blob).catch((err) => {
                    console.error(err);
                    return;
                });
            });
            navigator.serviceWorker.controller?.postMessage({
                method: VultureMessage.SET_VAULT,
                vault: vault,
            });
        }
    });
}

/** loadVault()
 *  Loads the seed-phrase/Hardware-wallet transaport either from the vulture_worker.js service worker or from storage, if its not cached.
 *  Returns false if a seed-phrase doesn't exist all-together.
 * 
 * ## Note:
 * The value return is a `Vault` if found, and false if no Vault has been created (meaing no seed-phrase/hardware wallet).
 */
export async function loadVault() {

    let vault;

    vault = await localforage.getItem("vault").then((value) => {
        if(value != null) {
            return value as string;
        }else {
            console.log(value);
            return null;
        }
    });
    navigator.serviceWorker.onmessage = async (event) => {
        if(event.data.method == VultureMessage.REQUEST_VAULT) {
            if(event.data.params.vault != '') {
                vault = event.data.params.vault as Vault;
            }else {
                console.log("Worker vault cache is freed, loading from storage...");
            }
        }
    };
    navigator.serviceWorker.controller?.postMessage({
        method: VultureMessage.REQUEST_VAULT,
    });
    return vault;
}


export async function loadAccounts() {
    let store;
    store = await localforage.getItem("vultureAccounts").then((value) => {
        if(value != null) {
            return value as VultureAccountStore;
        }else {
            return null;
        }
    });
    return store;
}


/** # removeLatestAccount()
 * Accounts are pushed when added, and popped when removed. This makes managing the order of accounts
 * a lot easier. This function will remove the latest added account.
 * 
*/
export async function removeLatestAccount() {
    return localforage.getItem("vultureAccounts").then((value) => {
        if(value != null) {
            let val: VultureAccountStore = value as VultureAccountStore;
            if(val.allAccounts.length > 1) {
                val.allAccounts.pop();
                val.nextAccountDerivIndex--;
                localforage.setItem("vultureAccounts", val).catch((err) => {
                    console.error(err);
                });
                return true;
            } else {
                console.log("You can't remove your main account...");
                return false;
            }
        }else {
            console.log("Can't remove an account when u don't have one... Idiot?");
            return true;
        }
    });
}

/** # createNewAccount()
 * A function that creates and adds a new Vulture account to storage, this function is used to to
 * add/create new accounts, including the initial account, and also automatically save the account
 * in localstorage.
*/
export async function createNewAccount(network: Network, accountName: string, walletType: WalletType): Promise<AccountData> {
    return localforage.getItem("vultureAccounts").then((value) => {
        if(value != null) {
            let val: VultureAccountStore = value as VultureAccountStore;
            val.allAccounts.push({
                accountName: accountName,
                address: "",
                derivationPath: "//" + val.nextAccountDerivIndex + "/0",
                accountIndex: val.nextAccountDerivIndex,
                freeAmountWhole: 0,
                accountNonce: 0,
                network: network,
                freeAmountSmallestFraction: "0",
                walletType: walletType
            });
            val.nextAccountDerivIndex++;
            localforage.setItem("vultureAccounts", val).catch((err) => {
                console.error(err);
            });
            return val.allAccounts[val.allAccounts.length - 1];
        }else {
            let val: VultureAccountStore = {
                allAccounts: [{
                    accountName: accountName,
                    address: "",
                    derivationPath: "//0/0",
                    accountIndex: 0,
                    freeAmountWhole: 0,
                    accountNonce: 0,
                    network: network,
                    freeAmountSmallestFraction: "0",
                    walletType: walletType
                }],
                nextAccountDerivIndex: 1,
                currentlySelected: 1,
            }
            localforage.setItem("vultureAccounts", val).catch((err) => {
                console.error(err);
            });
            return val.allAccounts[val.allAccounts.length - 1];
        }
    });
}