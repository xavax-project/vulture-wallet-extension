import { cryptoWaitReady } from '@polkadot/util-crypto';

import { WsProvider, Keyring, ApiPromise} from '@polkadot/api';

import { decodeAddress, encodeAddress } from "@polkadot/keyring";
import { hexToU8a, isHex } from "@polkadot/util";
import { KeyringPair } from '@polkadot/keyring/types';

import { VultureNetwork, MethodResponse } from '../InetworkAPI';
import { VultureMessage } from '../../../../src/vulture_backend/vultureMessage';
import { AccountData, Network } from '../../../../src/vulture_backend/wallets/vultureWallet';
import { AbstractToken } from '../../../../src/vulture_backend/types/abstractToken';
import { erc20Abi } from './ink_contract_abis/erc20Abi';
import { getERC20Info, getERC20Balance } from './contractFunctions';

const { ContractPromise } = require('@polkadot/api-contract');
import { AccountActionHandler } from "../InetworkAPI";


export class SubstrateInitData {
    seedPhrase: string;
    derivationPath: string;
    wsNetworkURI: string;
    ss58Format: string;
    keyringType: string;

    constructor(seed: string, derivationPath: string, websocketNetworkURI: string, addressFormat: string, keyringType: string) {
        this.derivationPath = derivationPath;
        this.wsNetworkURI = websocketNetworkURI;
        this.ss58Format = addressFormat;
        this.seedPhrase = seed;
        this.keyringType = keyringType;
    }
}

export class SubstrateActions implements AccountActionHandler {
    
    isCryptoWasmReady: boolean = false;

    address: string = "";
    ss58Format?: string;

    networkURI: string;

    seed: string;
    derivationPath: string;
    keyringType: string;

    keyring?: Keyring;
    keypair?: KeyringPair;

    wsProvider?: WsProvider;
    networkAPI?: ApiPromise;

    constructor(initData: SubstrateInitData) {
        this.networkURI = initData.wsNetworkURI;
        this.seed = initData.seedPhrase;
        this.ss58Format = initData.ss58Format;
        this.keyringType = initData.keyringType;
        this.derivationPath = initData.derivationPath;
        cryptoWaitReady().then((ready) => {
            console.log("Cryptography Web-Assembly status: " + ready);
            this.isCryptoWasmReady = ready;

            this.keyring = new Keyring({
                type: this.keyringType == "sr25519" ? 'sr25519' : 'sr25519',
                ss58Format: Number(this.ss58Format),
            });
            this.keypair = this.keyring.addFromUri(this.seed + this.derivationPath);
            this.address = this.keypair.address;

            this.wsProvider = new WsProvider(this.networkURI);
            this.wsProvider.isReady.then(() => {
                ApiPromise.create({provider: this.wsProvider}).then((api) => {
                    this.networkAPI = api;
                    postMessage(new MethodResponse(
                        VultureMessage.SET_CURRENT_WALLET,
                        {
                            success: true,
                            address: this.address
                        }
                    ));
                });
            });
        }).catch((error) => {
            console.error(error);
            postMessage(new MethodResponse(
                VultureMessage.SET_CURRENT_WALLET,
                {
                    success: false,
                    error: error,
                }
            ));
        });
    }

    async generateAddress(derivationPath: string, accountIndex: number) {
        if(this.isCryptoWasmReady){
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
    async getAddress() {
        throw new Error('Method not implemented.');
    }
    async estimateTxFee(recipent: string, amount: string, token?: AbstractToken) {
        if(this.isCryptoWasmReady) {
            
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
    async updateAccountsToNetwork(accounts: AccountData[], network: Network) {
        if(this.isCryptoWasmReady) {
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
    async transferAssets(recipent: string, amount: string, token?: AbstractToken) {
        if(this.isCryptoWasmReady) {
            if(token != null) {
              //If the method caller specified a token, we are sending the token and not the native asset.
              //This only works on substrate networks with the Ink! smart contract pallete.
  
              let contract = new ContractPromise(this.networkAPI!, erc20Abi, token.address);
              
              contract.tx.transfer({value: 0, gasLimit: -1}, recipent, amount).signAndSend(this.keypair!, ({events = [], status = {}}) => {
                if((status as any).isInBlock) {
  
                    events.forEach(({event: {data, method, section}, phase}) => {
                        if(method == 'ExtrinsicSuccess') {
  

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
}