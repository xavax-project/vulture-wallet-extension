import { cryptoWaitReady } from '@polkadot/util-crypto';

import { WsProvider, Keyring, ApiPromise} from '@polkadot/api';

import { decodeAddress, encodeAddress } from "@polkadot/keyring";
import { hexToU8a, isHex } from "@polkadot/util";
import { KeyringPair } from '@polkadot/keyring/types';

import { VultureNetwork, MethodResponse } from './networkApi';
import { VultureMessage } from '../../../src/vulture_backend/vultureMessage';
import { AccountData, Network } from '../../../src/vulture_backend/wallets/vultureWallet';
import { AbstractToken } from '../../../src/vulture_backend/types/abstractToken';
import { erc20Abi } from '../ink_contract_abis/erc20Abi';
import BigNumber from 'bignumber.js';

const { ContractPromise } = require('@polkadot/api-contract');

export class SubstrateNetwork implements VultureNetwork {
    currentAddress: string = "";

    keyring?: Keyring;
    keypair?: KeyringPair;

    wsProvider?: WsProvider;
    networkAPI?: ApiPromise;

    seed: string;
    networkURI: string;

    isCryptoReady: boolean = false;
    addressFormat: string | null = null;

    /** ## SubstrateNetwork()
     * Derivation path format is:
     * 
     * `//hardIndex/softIndex`
     * 
     * For Vulture, please only use Hardened keys.
     */
    constructor(seed: string, derivationPath: string, websocketNetworkURI: string, addressFormat?: string) {
        this.seed = seed;
        this.networkURI = websocketNetworkURI;
        this.addressFormat = addressFormat ? addressFormat : null;
        cryptoWaitReady().then((ready) => {
            console.log("Crypto WASM: " + ready);
            this.isCryptoReady = true;

            this.keyring = new Keyring({
                type: 'sr25519',
                ss58Format: this.addressFormat != null ? Number(this.addressFormat) : undefined
            });
            this.keypair = this.keyring.addFromUri(this.seed + derivationPath);
            this.currentAddress = this.keypair.address;
            
            this.wsProvider = new WsProvider(this.networkURI);
            this.wsProvider.isReady.then((ready: any) => {
                ApiPromise.create({provider: this.wsProvider}).then((api) => {
                    this.networkAPI = api;

                    postMessage(new MethodResponse(
                        VultureMessage.SET_CURRENT_WALLET,
                        {
                            success: true,
                            address: this.currentAddress
                        },
                    ));
                });
            });

        }).catch((error) => {
            console.error(error);
        });
        
    }
    async getTokenData(tokenAddress: string, tokenType: string): Promise<void> {

        
        if(this.isCryptoReady) {
            let contract = new ContractPromise(this.networkAPI!, erc20Abi, tokenAddress);
            let success: boolean = true;
            let error: string = "";
            let token: AbstractToken = {
                address: tokenAddress,
                decimals: -1,
                name: '',
                symbol: '',
                logoURI: '',
                balance: '0',
            }

            try{
                let decimals = await contract.query.decimals(this.currentAddress, {value: 0, gasLimit: -1});
                if(decimals.result.isOk) {
                    token.decimals = decimals.output.toHuman();
                }else {
                    console.log("Error: Failed getting token total decimals (the amount of fractions the token is divided into) \n");
                }
            }catch {
                token.decimals = -1;
                console.log("Contract '" + tokenAddress + "'" + " Doesn't have decimals()");
            }
            
            try{
                let balance = await contract.query.balanceOf(this.currentAddress, {value: 0, gasLimit: -1}, this.currentAddress);
                if(balance.result.isOk) {
                    if(token.decimals != -1) {
                        token.balance = new BigNumber((balance.output.toHuman() as string).replaceAll(',', ''))
                        .div(new BigNumber(10).pow(token.decimals)).toString();
                    }else {
                        token.balance = balance.output.toHuman();
                    }
                }else {
                    console.log("Error: Failed getting balance!");
                    if(balance.result.asErr.toHuman().Module.error == 5) {
                        success = false;
                        error = "Contract Not Found";
                    }
                }
                
            }catch {
                console.log("Contract '" + tokenAddress + "'" + " Doesn't have balanceOf() - this is catastrophic for ERC20");
            }

            try {
                let nameData = await contract.query.name(this.currentAddress, {value: 0, gasLimit: -1});
                if(nameData.result.isOk) {
                    token.name = nameData.output.toHuman();
                }else {
                    console.log("Error: Failed getting token name");
                    if(nameData.result.asErr.toHuman().Module.error == 5) {
                        success = false;
                        error = "Contract Not Found";
                    }
                }
            }catch {
                token.name = "Token Has None";
                console.log("Contract '" + tokenAddress + "'" + " Doesn't have name()");
            }

            try {
                let symbolData = await contract.query.symbol(this.currentAddress, {value: 0, gasLimit: -1});
                if(symbolData.result.isOk) {
                    token.symbol = symbolData.output.toHuman();
                }else {
                    console.log("Error: Failed getting token symbol \n");
                }
            }catch {
                token.symbol = "Token Has None";
                console.log("Contract '" + tokenAddress + "'" + " Doesn't have symbol()");
            }
             
            try {
                let totalSupplyData = await contract.query.totalSupply(this.currentAddress, {value: 0, gasLimit: -1});
                if(totalSupplyData.result.isOk) {
                    if(token.decimals != -1) {
                        token.totalSupply = new BigNumber((totalSupplyData.output.toHuman() as string).replaceAll(',', ''))
                        .div(new BigNumber(10).pow(token.decimals)).toString()
                    }else {
                        token.totalSupply = totalSupplyData.output.toHuman();
                    }
                }else {
                    console.log("Error: Failed getting token total supply! \n");
                }
            }catch {
                token.totalSupply = undefined;
                console.log("Contract '" + tokenAddress + "'" + " Doesn't have totalSupply()");
            }
             

            if(success) {
                postMessage(new MethodResponse(
                    VultureMessage.GET_TOKEN_DATA,
                    {
                        tokenData: token,
                        success: true,
                    }
                ));
            }else {
                postMessage(new MethodResponse(
                    VultureMessage.GET_TOKEN_DATA,
                    {
                        tokenData: token,
                        error: error,
                        success: false,
                    }
                ));
            }
        }
    }
    updateAccountsToNetwork(accounts: AccountData[], network: Network): void {
        if(this.isCryptoReady) {
            let updatedAccounts: AccountData[];
            updatedAccounts = accounts;
            for(let i = 0; i < accounts.length; i++) {
                if(network.addressFormat != undefined) {
                    this.keyring!.setSS58Format(Number(network.addressFormat));
                }else {
                    this.keyring!.setSS58Format(42);
                }
                let kp = this.keyring!.addFromUri(this.seed + "//" + updatedAccounts[i].accountIndex);
                updatedAccounts[i].address = kp.address;
            }
            postMessage(new MethodResponse(
                VultureMessage.UPDATE_ACCOUNTS_TO_NETWORK,
                {
                    success: true,
                    updatedAccounts: updatedAccounts,
                }
            ));
        }
    }
    getAddress(): MethodResponse {
        throw new Error('Method not implemented.');
    }
    generateAddress(derivationPath: string, accountIndex: number) {
        if(this.isCryptoReady){
            let kp = this.keyring!.addFromUri(this.seed + derivationPath);
            postMessage(new MethodResponse(
                VultureMessage.GET_ADDRESS_FROM_URI,
                {
                    success: true,
                    address: kp.address,
                    accountIndex: accountIndex,
                }
            ));
        }else{
            throw new Error("Cryptography WASM hasn't been initialized yet!");
        }
    }
    transferAssets(recipent: string, amount: string, token?: AbstractToken) {
        if(this.isCryptoReady) {
          
          if(token != null) {
            //If the method caller specified a token, we are sending the token and not the native asset.
            //This only works on substrate networks with the Ink! smart contract pallete.

            let contract = new ContractPromise(this.networkAPI!, erc20Abi, token.address);
            console.log("_________________________________ \nAttempting to transfer: '" + token.name + "' Token to: " + recipent);
            
            contract.tx.transfer({value: 0, gasLimit: -1}, recipent, amount).signAndSend(this.keypair!, ({events = [], status = {}}) => {
              if((status as any).isInBlock) {

                  events.forEach(({event: {data, method, section}, phase}) => {
                      if(method == 'ExtrinsicSuccess') {

                      console.log("==== EVENT START ===");
                      console.log(method);
                      console.log("Block Hash Of Tx: " + (status as any).asInBlock.toHex());
                      console.log("==== EVENT END ===");
                        postMessage({method: VultureMessage.TRANSFER_ASSETS, params: {
                            success: true,
                            status: (status as any).type,
                            blockHash: (status as any).asInBlock.toHex(),
                            method: method,
                        }});
                      } else if(method == 'ExtrinsicFailed') {                            
                        postMessage({method: VultureMessage.TRANSFER_ASSETS, params: {
                            success: false,
                            status: (status as any).type,
                            blockHash: (status as any).asInBlock.toHex(),
                            method: method,
                        }});
                      }
                  });
                  console.log("_________________________________");

              }else if((status as any).isDropped) {
                  postMessage({method: VultureMessage.TRANSFER_ASSETS, params: {
                      success: false,
                      status: (status as any).type,
                  }});
                }else if((status as any).isFinalityTimeout) {
                  postMessage({method: VultureMessage.TRANSFER_ASSETS, params: {
                      success: false,
                      status: (status as any).type,
                  }});
                }else if((status as any).isInvalid) {
                  postMessage({method: VultureMessage.TRANSFER_ASSETS, params: {
                      success: false,
                      status: (status as any).type,
                  }});
                }

            });

          }else {
            //If the method caller hasn't specified a token, we are sending the native asset of the current network.
            this.networkAPI!.tx.balances.transferKeepAlive(recipent, amount).signAndSend(this.keypair!, ({events = [], status}) => {
                if(status.isInBlock) {

                    events.forEach(({event: {data, method, section}, phase}) => {
                        if(method == 'ExtrinsicSuccess') {
                          postMessage({method: VultureMessage.TRANSFER_ASSETS, params: {
                              success: true,
                              status: status.type,
                              blockHash: status.asInBlock.toHex(),
                              method: method,
                          }});
                        } else if(method == 'ExtrinsicFailed') {                            
                          postMessage({method: VultureMessage.TRANSFER_ASSETS, params: {
                              success: false,
                              status: status.type,
                              blockHash: status.asInBlock.toHex(),
                              method: method,
                          }});
                        }
                    });
                }else if(status.isDropped) {
                  postMessage({method: VultureMessage.TRANSFER_ASSETS, params: {
                      success: false,
                      status: status.type,
                  }});
                }else if(status.isFinalityTimeout) {
                  postMessage({method: VultureMessage.TRANSFER_ASSETS, params: {
                      success: false,
                      status: status.type,
                  }});
                }else if(status.isInvalid) {
                  postMessage({method: VultureMessage.TRANSFER_ASSETS, params: {
                      success: false,
                      status: status.type,
                  }});
                }
            });
          }
        }else {
            postMessage({method: VultureMessage.TRANSFER_ASSETS, params: {
                success: false,
            }});
            throw new Error("Cryptography WASM hasn't been initialized yet!");
        }
    }
    estimateTxFee(recipent: string, amount: string, token?: AbstractToken) {
        if(this.isCryptoReady) {
            
            if(token != null) {
                let contract = new ContractPromise(this.networkAPI!, erc20Abi, token.address);
                contract.tx.transfer({value: 0, gasLimit: -1}, recipent, amount).paymentInfo(this.keypair!).then((info: any) => {
                    postMessage({method: VultureMessage.ESTIMATE_TX_FEE, params: {
                        success: true,
                        result: info.toJSON(),
                        fee: info.partialFee.toHuman()
                    }});
                });
            }else {
                this.networkAPI!.tx.balances.transferKeepAlive(recipent, amount).paymentInfo(this.keypair!).then((info: any) => {
                    postMessage({method: VultureMessage.ESTIMATE_TX_FEE, params: {
                        success: true,
                        result: info.toJSON(),
                        fee: info.partialFee.toHuman()
                    }});
                });
            }

        }else {
            throw new Error("Cryptography WASM hasn't been initialized yet!");
        }
    }
    validateAddress(address: string) {
        if(this.isCryptoReady) {
            let result = false;
            try {
                encodeAddress(
                    isHex(address)
                        ? hexToU8a(address)
                        : decodeAddress(address)
                );
                result = true;
            }catch(error) {
                result = false;
            }
            postMessage({method: VultureMessage.IS_ADDRESS_VALID, params: {
                success: true,
                isValid: result,
            }});
        }else {
            throw new Error("Cryptography WASM hasn't been initialized yet!");
        }
    }
    getAddressState() {
        if(this.isCryptoReady) {
            this.networkAPI!.query.system.account(this.currentAddress).then((result) => {
                postMessage({method: VultureMessage.GET_ACCOUNT_STATE, params: {
                    success: true,
                    result: result.toJSON(),
                }});
            });
        }else {
            throw new Error("Cryptography WASM hasn't been initialized yet!");
        }
    }
    subscribeToAddressUpdates() {
        if(this.isCryptoReady) {
            this.networkAPI!.query.system.account(this.currentAddress, (result: any) => {
                postMessage({method: VultureMessage.SUB_TO_ACCOUNT_STATE, params: {
                    success: true,
                    result: result.toJSON(),
                }});
            });
        }else {
            throw new Error("Cryptography WASM hasn't been initialized yet!");
        }
    }
}
