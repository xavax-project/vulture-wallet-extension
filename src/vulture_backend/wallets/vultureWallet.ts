import localforage from "localforage";
import { VultureMessage } from "../vultureMessage";
import { encrypt } from "@metamask/browser-passworder";
import { MnemonicWallet } from "./mnemonicWallet";
import SafeEventEmitter from "@metamask/safe-event-emitter";
import { AbstractToken, TokenStore } from "../types/abstractToken";
import { NetworkFeatures } from "../types/networkTypes";

/* --- Note # NEXEN # we are one @
    vultureWallet.ts contains interfaces that are used by the Vulture wallet.

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
    walletType: WalletType;

    /** ## tokens
     * Optional token/asset store.
     * 
     * It is important to note that the AbstractToken interface
     * is an abstract interface which also contains the network-information (tokens
     * are on a per-network basis). The AbstractToken interface may represent ERC20 tokens,
     * and also native assets that reside within blockchains. The Vulture back-end will handle
     * tokens differently depending on the currently selected network.
     */
    tokens?: AbstractToken[];
}


/** ## WalletType
* The WalletType signifies whether a wallet account is derived from a MnemonicPhrase, or Hardware wallets such as
* Ledger or Trezor.
*/
export enum WalletType {
    MnemonicPhrase,
    Ledger,
}
/** ## NetworkType
 * The network type of a network, the value in this enum represents how the wallet handles the data/accounts/cryptography
 * of the network. If the user adds a custom network (with a custom RPC), it is important that they select a network type
 * that's corret.
 * 
 * There may also be additional specific network types, such as `SubstrateNetworks`; this is due to the fact that substrate
 * networks may have different properties which are unique, and cannot be general.
 */
export enum NetworkType {
    Substrate,
    Solana,
    AVM, //Avalanche virtual machine
    PVM, //Platform virtual machine (also on avalanche)
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
    networkLogoUri?: string;
    networkType: NetworkType;
    /** # addressFormat
     * Some networks which are multi-chain, or use certain SDKs such as Substrate may
     * have multiple address encoding/formats to differentiate between the different
     * chains. In the case of Substrate, this is true with the `ss58` format.
     * 
     * ## Substrate:
     * If the networkType is substrate, the address format should be the `ss58` prefix
     * number, if left undefined, this will default to the default substrate address format.
     * A list of ss58 prefixes can be found in the [ss58 registry](https://github.com/paritytech/ss58-registry/blob/main/ss58-registry.json)
     * 
     */
    addressFormat?: string
    isTestnet: boolean,

    /** ## networkFeatures
     * An enum bitfield representing the features a network has. Interact with this enum as a **bitfield**!
     */
    networkFeatures: NetworkFeatures

}

/** ## VultureAccount
 * the Vulture wallet will create accounts where the derivation-path is incremented with every account. A VultureAccount
 * represents an account in its entire form, i.e address, derivation path, the amount the address has, the network it is
 * connected to, as well as methods that can be called to do things such as transfer assets.
 */
export interface VultureAccount {

    infoWorker: Worker;
    actionWorker: Worker;

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
    * account.accountEvents.once(vultureMessage.ESTIMATE_TX_FEE, (fee) => {
    *       console.log("Fee in precise Whole units: " + fee);
    *       currentFee = fee; 
    * });
    * 
    * //Call the estimateTxFee(); Method that exists in VultureAccount implementors/
    * account.estimateTxFee('Destination', '1.42');
    * ```
    */
    accountEvents: SafeEventEmitter;

    updateTokenBalance: any;

    /** ## accountData
    * The relevant Data each VultureAccount has, for example the address, derivation path, name, assetAmount, etc.
    */
    accountData: AccountData

    /** ## transferAssets();
     * docs: Todo
     */
    transferAssets(destination: string, amountWhole: number, token?: AbstractToken): Promise<void>;
    /** ## estimateTxFee();
     * docs: Todo
     */
    estimateTxFee(destination: string, amountWhole: number, token?: AbstractToken): Promise<void>;
    /** ## updateAccountState();
     * docs: Todo
     */
    /** ## updateAccountState();
     * docs: Todo
     */
    isAddressValid(address: string): Promise<void>;
    /** ## getTokenInformation();
     * Returns information about a token, the tokenAddress could point to an ERC20 or ERC721 token, or
     * a native token depending on the currently selected network.
     * 
     * 
     * tokenType refers to the type of the token, as stated above, this could be "ERC20", "ERC721", "NATIVE",
     * or more. The currently available tokenTypes are written below:
     * 
     * * "ERC20"
     * * "ERC721"
     * * "NATIVE"
     */
    getTokenInformation(tokenAddress: string, tokenType: string): Promise<void>;

    terminateWallet(): Promise<void>;
    updateAccountState(): Promise<void>;   
}

/** # VultureAccountStore
 * Stores information about all accounts the wallet has, not including
 * a seed-phrase/private key.
 */
export interface VultureAccountStore {
    allAccounts: AccountData[],
    nextAccountDerivIndex: number,
    currentlySelectedNetwork: Network,
    currentlySelectedAccount: number
}

/*@---------------------------------Wallet Classes-------------------------------@*/

export class DefaultNetworks {
    /* -- Main Networks -- */
    public AlephZero: Network = {
        networkUri: 'wss://ws.azero.dev',
        networkAssetPrefix: 'AZERO',
        networkName: 'Aleph Zero',
        networkAssetDecimals: 12,
        networkColor: '#00EAC7',
        networkType: NetworkType.Substrate,
        isTestnet: false,
        networkFeatures: (NetworkFeatures.STAKING),
    }
    public Kusama: Network = {
        networkUri: 'wss://kusama-rpc.polkadot.io',
        networkAssetPrefix: 'KSM',
        networkName: 'Kusama',
        networkAssetDecimals: 12,
        networkColor: '#e8026d',
        networkType: NetworkType.Substrate,
        networkFeatures: (NetworkFeatures.NONE),
        addressFormat: '2',
        isTestnet: false,
    }
    public Polkadot: Network = {
        networkUri: 'wss://kusama-rpc.polkadot.io',
        networkAssetPrefix: 'DOT',
        networkName: 'Polkadot',
        networkAssetDecimals: 10,
        networkColor: '#e6007a',
        networkType: NetworkType.Substrate,
        networkFeatures: (NetworkFeatures.NONE),
        addressFormat: '0',
        isTestnet: false,
    }
    /* 
    public AvalancheCChain: Network = {
        networkUri: 'https://api.avax.network:443',
        networkAssetPrefix: 'AVAX',
        networkName: 'Avax C-Chain',
        networkAssetDecimals: 18,
        networkColor: '#ff0043',
        networkType: NetworkType.EVM,
        isTestnet: false,
    }
     */
    /* -- Test Networks -- */
    public AlephZeroTestNet: Network = {
        networkUri: 'wss://ws.test.azero.dev',
        networkAssetPrefix: 'TZERO',
        networkName: 'Aleph Zero Testnet',
        networkAssetDecimals: 12,
        networkColor: '#4dff97',
        networkType: NetworkType.Substrate,
        networkFeatures: (NetworkFeatures.STAKING),
        isTestnet: true,
    }
    public AlephZeroSmartnet: Network = {
        networkUri: 'wss://ws-smartnet.test.azero.dev',
        networkAssetPrefix: 'SZERO',
        networkName: 'Aleph Zero Smartnet',
        networkAssetDecimals: 12,
        networkColor: '#4dff97',
        networkType: NetworkType.Substrate,
        networkFeatures: (NetworkFeatures.SMART_CONTRACTS),
        isTestnet: true,
    }
    public allNetworks: Map<string, Network> = new Map([
        [
            this.AlephZero.networkName,
            this.AlephZero
        ],
        [
            this.Kusama.networkName,
            this.Kusama
        ],
        [
            this.Polkadot.networkName,
            this.Polkadot
        ],
        /*
        [
            this.AvalancheCChain.networkName,
            this.AvalancheCChain
        ],
         */
        [
            this.AlephZeroTestNet.networkName,
            this.AlephZeroTestNet
        ],
        [
            this.AlephZeroSmartnet.networkName,
            this.AlephZeroSmartnet
        ],
    ]);
    public mainNets: Map<string, Network> = new Map([
        [
            this.AlephZero.networkName,
            this.AlephZero
        ],
        [
            this.Kusama.networkName,
            this.Kusama
        ],
        [
            this.Polkadot.networkName,
            this.Polkadot
        ],
    ]);
    public testNets: Map<string, Network> = new Map([
        [
            this.AlephZeroTestNet.networkName,
            this.AlephZeroTestNet
        ],
        [
            this.AlephZeroSmartnet.networkName,
            this.AlephZeroSmartnet
        ],
    ]);
}

export class VultureWallet {

    public currentWallet!: VultureAccount;
    public nextDerivIndex: number = 0;
    public vault!: Vault;
    public selectedWalletIndex!: number;

    public accountStore!: VultureAccountStore;

    public tokenStore!: TokenStore;

    constructor(vault?: Vault, accountStore?: VultureAccountStore) {

        if(vault && accountStore)
        {
            this.accountStore = accountStore;

            loadTokenStore(accountStore?.currentlySelectedNetwork).then((store) => {
                this.tokenStore = store;
            });

            this.selectedWalletIndex = accountStore.currentlySelectedAccount;
            this.vault = vault;
            this.nextDerivIndex = accountStore.nextAccountDerivIndex;
            if(accountStore.allAccounts[accountStore.currentlySelectedAccount - 1].walletType == WalletType.MnemonicPhrase) {
                this.currentWallet = new MnemonicWallet(vault.seed, accountStore.allAccounts[accountStore.currentlySelectedAccount - 1], accountStore.currentlySelectedNetwork);
            }else {
                console.error("Error: Ledger wallets not currently supported!");
            }
        }
    
    }

    async initWallet(vault: Vault, accountStore: VultureAccountStore) {

        // If we are switching/initializing to a new wallet, we must terminate the processes for the old one.
        if(this.currentWallet != null) {
            this.currentWallet.terminateWallet();
        }
        
        this.accountStore = accountStore;

        this.tokenStore = await loadTokenStore(this.accountStore.currentlySelectedNetwork);
        
        this.vault = vault;
        this.nextDerivIndex = accountStore.nextAccountDerivIndex;
        this.selectedWalletIndex = accountStore.currentlySelectedAccount;
        
        // If the currently selected account is available, if it isn't we fallback to using the first account.
        // The reason this check is necessary is due to updates possibly resetting the currentlySelectedAccount value. 
        if(accountStore.allAccounts[accountStore.currentlySelectedAccount - 1]) {
            if(accountStore.allAccounts[accountStore.currentlySelectedAccount - 1].walletType == WalletType.MnemonicPhrase) {
                this.currentWallet = new MnemonicWallet(vault.seed, accountStore.allAccounts[accountStore.currentlySelectedAccount - 1], accountStore.currentlySelectedNetwork);
            }else {
                console.error("Error: Ledger wallets not currently supported!");
            }
        }else {
            if(accountStore.allAccounts[0].walletType == WalletType.MnemonicPhrase) {
                this.accountStore.currentlySelectedAccount = 0;
                this.saveAccounts();
                this.currentWallet = new MnemonicWallet(vault.seed, accountStore.allAccounts[0], accountStore.currentlySelectedNetwork);
            }else {
                console.error("Error: Ledger wallets not currently supported!");
            }
        }
        
       //Set the callback for updating token balances here, it's wonky but I'll refactor the way this works eventually.
       this.currentWallet.accountEvents.on(VultureMessage.GET_TOKEN_BALANCE, () => {
            this.updateBalanceOfTokens();
       });
    }

    async switchWallet(index: number) {
        this.accountStore.currentlySelectedAccount = index;
        this.saveAccounts();
        this.initWallet(this.vault, this.accountStore);
    }
    async updateBalanceOfTokens() {
       this.currentWallet.infoWorker.onmessage = (event) => { // TODO: UPDATE TO METHOD
           if(event.data.method == VultureMessage.GET_TOKEN_BALANCE) {
               if(event.data.params.success == true) {
                   if(this.tokenStore.tokenList.get(this.accountStore.currentlySelectedNetwork.networkUri) != null) {
                       this.tokenStore.tokenList.get(this.accountStore.currentlySelectedNetwork.networkUri)![event.data.params.arrayIndexOfToken]
                       .balance = event.data.params.balance;
                   }
               }else {
                   console.error("Error getting balance of token " + event.data.params.tokenAddress);
                   if(this.tokenStore.tokenList.get(this.accountStore.currentlySelectedNetwork.networkUri) != null) {
                       this.tokenStore.tokenList.get(this.accountStore.currentlySelectedNetwork.networkUri)![event.data.params.arrayIndexOfToken]
                       .balance = "Error";
                   }
               }
           }
       };
       this.tokenStore.tokenList?.get(this.accountStore.currentlySelectedNetwork.networkUri)?.forEach((token, index) => { // TODO: UPDATE TO METHOD
           this.currentWallet.infoWorker.postMessage({
               method: VultureMessage.GET_TOKEN_BALANCE,
               params: {
                   tokenAddress: token.address,
                   arrayIndexOfToken: index,
                   tokenType: 'ERC20'
               },
           });
       });
    }
    switchNetwork(networkName: string) {
        const networks = new DefaultNetworks();
        //Switch the network
        if(networks.allNetworks.get(networkName)) {
            this.accountStore.currentlySelectedNetwork = networks.allNetworks.get(networkName) as Network;
            this.saveAccounts();
            this.updateAccountAddresses();
        }else {
            console.error("Network: " + networkName + " Doesn't exist!");
            return;
        }

        //initialize the wallet again but with the new network.
        this.initWallet(this.vault, this.accountStore);
    }    
    addTokenToList(token: AbstractToken, tokenType: string) {
        switch(tokenType) {
            case 'ERC20': {
                addTokenToStore(this.accountStore.currentlySelectedNetwork, false, token).then((store) => {
                    if(store != null) {
                        this.tokenStore = store;
                    }else {
                        console.error("Failed adding token, store not found!");
                    }
                });
                break;
            }
            case 'ERC721': {
                addTokenToStore(this.accountStore.currentlySelectedNetwork, true, token).then((store) => {
                    if(store != null) {
                        this.tokenStore = store;
                    }else {
                        console.error("Failed adding token, store not found!");
                    }
                });
                break;
            }
        }
    }
    removeTokenFromList(arrayIndexOfToken: number, tokenType: string) {
        switch(tokenType) {
            case 'ERC20': {
                removeTokenFromStore(this.accountStore.currentlySelectedNetwork, false, arrayIndexOfToken).then((store) => {
                    if(store != null) {
                        this.tokenStore = store;
                    }else {
                        console.error("Failed removing token, store not found!");
                    }
                });
                break;
            }
            case 'ERC721': {
                removeTokenFromStore(this.accountStore.currentlySelectedNetwork, true, arrayIndexOfToken).then((store) => {
                    if(store != null) {
                        this.tokenStore = store;
                    }else {
                        console.error("Failed removing token, store not found!");
                    }
                });
                break;
            }
        }
    }
    updateAccountAddresses() {
        this.currentWallet.actionWorker.onmessage = (event) => { // TODO: UPDATE TO METHOD
            if(event.data.method == VultureMessage.UPDATE_ACCOUNTS_TO_NETWORK) {
                if(event.data.params.success == true) {
                    this.accountStore.allAccounts = event.data.params.updatedAccounts;
                    this.saveAccounts();
                }else {
                    console.log("Failed updating accounts to use new network format!");
                }
            }
        };
        this.currentWallet.actionWorker.postMessage({ // TODO: UPDATE TO METHOD
            method: VultureMessage.UPDATE_ACCOUNTS_TO_NETWORK,
            params: {
                accounts: JSON.parse(JSON.stringify(this.accountStore.allAccounts)),
                network: JSON.parse(JSON.stringify(this.accountStore.currentlySelectedNetwork)),
            },
        });
    }
    saveAccounts() {
        localforage.setItem("vultureAccounts", JSON.parse(JSON.stringify(this.accountStore))).catch((err) => {
            console.error(err);
        });
    }
    createAccount(accountName: string, walletType: WalletType) {
        createNewAccount(accountName, walletType).then((account) => {
            this.currentWallet.actionWorker.onmessage = (event) => { // TODO: UPDATE TO METHOD
                if(event.data.method == VultureMessage.GET_ADDRESS_FROM_URI && event.data.params.success == true) {
                    this.accountStore.allAccounts[event.data.params.accountIndex - 1].address = event.data.params.address;
                    this.accountStore.nextAccountDerivIndex++;
                    this.nextDerivIndex = this.accountStore.nextAccountDerivIndex;
                    this.saveAccounts();
                }
            };

            //WASM makes it necessary to use postMessage for all sr25519 cryptography, makes things more
            //complicated to read and more asynchronous in nature but it's either that or use a native
            //js sr25519 package (no audited ones exist...).

            this.accountStore.allAccounts.push(account);

            this.currentWallet.actionWorker.postMessage({ // TODO: UPDATE TO METHOD
                method: VultureMessage.GET_ADDRESS_FROM_URI,
                params: {
                    keyring: {
                        accountIndex: this.accountStore.allAccounts.length,
                        addressURI: '//' + account.accountIndex,
                        index: account.accountIndex,
                        seed: this.vault.seed,
                    }
                }
            });
        });
    }
    popAccount() {
        removeLatestAccount().then((success) => {
            if(success) {
                //If the selected account is the one we are popping, select the previous account
                if(this.selectedWalletIndex == this.accountStore.allAccounts.length) {
                    this.selectedWalletIndex--;
                    this.switchWallet(this.selectedWalletIndex);
                }
                this.nextDerivIndex--;
                this.accountStore.allAccounts.pop();
                this.accountStore.nextAccountDerivIndex--;
                this.saveAccounts();
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

/** # loadTokenStore()
 *  Loads the token store for the given network. The token store is saved as
 * `tokenStore_*NETWORK_RPC_URI*`.
 * 
 * If a `TokenStore` doesn't currently exist for the current network it will be
 * generated by this function, and returned.
 */
export async function loadTokenStore(network: Network) {
    let store;
    store = await localforage.getItem("tokenStore").then((value) => {
        if(value != null) {
            return value as TokenStore;
        }else {
            let tokenStore: TokenStore = {
                tokenList: new Map<string, AbstractToken[]>(),
                NFTList: new Map<string, AbstractToken[]>(),
            }
            localforage.setItem("tokenStore", tokenStore);
            return tokenStore;
        }
    });
    return store;
}

export async function updateBalanceOfToken(network: Network, isNFT: boolean, token: AbstractToken) {

}

/** # addTokenToStore()
 *  Adds a token to the TokenStore of the current network. If the user has the token added it will show up
 *  on the front-end GUI.
 */
export async function addTokenToStore(network: Network, isNFT: boolean, token: AbstractToken){

    let res = await localforage.getItem("tokenStore").then((value) => {
        if(value != null) {
            let store = value as TokenStore;
            if(isNFT) {
                if(store.NFTList.get(network.networkUri)) {
                    store.NFTList.get(network.networkUri)?.push(JSON.parse(JSON.stringify(token)));
                    
                }else {
                    store.NFTList.set(network.networkUri, []);
                    store.NFTList.get(network.networkUri)?.push(JSON.parse(JSON.stringify(token)));
                }
            }else {
                if(store.tokenList.get(network.networkUri)) {
                    store.tokenList.get(network.networkUri)?.push(JSON.parse(JSON.stringify(token)));
                    
                }else {
                    store.tokenList.set(network.networkUri, []);
                    store.tokenList.get(network.networkUri)?.push(JSON.parse(JSON.stringify(token)));
                }
            }
            localforage.setItem("tokenStore", store);
            return store;
        }else {
            console.error("Current network does not have a token-store! Please create one with the `loadTokenStore();` function!");
            return null;
        }
    });
    return res;
}
/** # addTokenToStore()
 *  Adds a token to the TokenStore of the current network. If the user has the token added it will show up
 *  on the front-end GUI.
 */
 export async function removeTokenFromStore(network: Network, isNFT: boolean, tokenArrayIndex: number){

    let res = await localforage.getItem("tokenStore").then((value) => {
        if(value != null) {
            let store = value as TokenStore;
            if(isNFT) {
                if(store.NFTList.get(network.networkUri)) {
                    store.NFTList.get(network.networkUri)?.splice(tokenArrayIndex, 1);
                    
                }else {
                    store.NFTList.set(network.networkUri, []);
                    store.NFTList.get(network.networkUri)?.splice(tokenArrayIndex, 1);
                }
            }else {
                if(store.tokenList.get(network.networkUri)) {
                    store.tokenList.get(network.networkUri)?.splice(tokenArrayIndex, 1);
                    
                }else {
                    store.tokenList.set(network.networkUri, []);
                    store.tokenList.get(network.networkUri)?.splice(tokenArrayIndex, 1);
                }
            }
            localforage.setItem("tokenStore", store);
            return store;
        }else {
            console.error("Current network does not have a token-store! Please create one with the `loadTokenStore();` function!");
            return null;
        }
    });
    return res;
}

export async function createVault(vault: any, password: string) {
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
            this.currentWallet.worker.postMessage({
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
            return null;
        }
    });
    return vault;
}

export async function loadAccounts() {
    let store;
    store = await localforage.getItem("vultureAccounts").then((value) => {
        if(value != null) {
            let store = value as VultureAccountStore;

            /*--- Due to updating serialization, need to make sure the store contains this data! ---*/
            //Making sure that we have a default network.
            if(store.currentlySelectedNetwork == null) {
                store.currentlySelectedNetwork = new DefaultNetworks().AlephZero;
            }
            //Making sure that we have a nextAccountDerivIndex.
            if(store.nextAccountDerivIndex == null) {
                store.nextAccountDerivIndex = 1;
            }
            localforage.setItem("vultureAccounts", store);
            return store;
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

export function hardWalletReset() {
    localforage.removeItem("vultureAccounts");
    localforage.removeItem("tokenStore");
    localforage.removeItem("vault");
}

/** # createNewAccount()
 * A function that creates and adds a new Vulture account to storage, this function is used to to
 * add/create new accounts, including the initial account, and also automatically save the account
 * in localstorage.
*/
export async function createNewAccount(accountName: string, walletType: WalletType, network?: Network,): Promise<AccountData> {
    return localforage.getItem("vultureAccounts").then((value) => {
        if(value != null) {
            let val: VultureAccountStore = value as VultureAccountStore;
            val.allAccounts.push({
                accountName: accountName,
                address: "",
                derivationPath: "//" + val.nextAccountDerivIndex,
                accountIndex: val.nextAccountDerivIndex,
                freeAmountWhole: 0,
                accountNonce: 0,
                freeAmountSmallestFraction: "0",
                walletType: walletType
            });
            val.nextAccountDerivIndex++;
            localforage.setItem("vultureAccounts", val).catch((err) => {
                console.error(err);
            });
            return val.allAccounts[val.allAccounts.length - 1];
        }else {
            let selectedNetwork = network != null ? network : new DefaultNetworks().AlephZero;
            let val: VultureAccountStore = {
                allAccounts: [{
                    accountName: accountName,
                    address: "",
                    derivationPath: "//0",
                    accountIndex: 0,
                    freeAmountWhole: 0,
                    accountNonce: 0,
                    freeAmountSmallestFraction: "0",
                    walletType: walletType
                }],
                currentlySelectedNetwork: selectedNetwork,
                nextAccountDerivIndex: 1,
                currentlySelectedAccount: 1,
            }
            localforage.setItem("vultureAccounts", val).catch((err) => {
                console.error(err);
            });
            return val.allAccounts[val.allAccounts.length - 1];
        }
    });
}