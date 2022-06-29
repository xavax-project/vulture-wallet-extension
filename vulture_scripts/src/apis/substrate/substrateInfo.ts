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
import { erc721Abi } from './ink_contract_abis/erc721Abi';
import { getERC20Info, getERC20Balance, getERC721Info, getERC721Balance } from './contractFunctions';

const { ContractPromise } = require('@polkadot/api-contract');
import { AccountInfoHandler } from "../InetworkAPI";


export class SubstrateInfo implements AccountInfoHandler {
    
    isCryptoReady: boolean = false;

    address: string = "";
    derivationPath: string;

    networkURI: string;
    wsProvider?: WsProvider;
    networkAPI?: ApiPromise;

    addedTokens: AbstractToken[] = [];
    addedNFTs: AbstractToken[] = [];

    constructor(address: string, derivationPath: string, networkURI: string) {
        this.networkURI = networkURI;
        this.address = address;
        this.derivationPath = derivationPath;
        this.isCryptoReady = true;

        
        cryptoWaitReady().then((ready) => {
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
    async validateAddress(address: string) {
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
    async setAddress(address: string) {
        throw new Error('Method not implemented.');
    }
    async subscribeToAddressEvents() {
        if(this.isCryptoReady) {

            const unsub = await this.networkAPI?.query.system.account(this.address, async (result: any) => {
                postMessage({method: VultureMessage.SUBSCRIBE_TO_ACC_EVENTS, params: {
                    success: true,
                    result: result.toJSON(),
                }});
            });
            
            /*
            this.networkAPI?.query.system.account(this.address, async (result: any) => {
                postMessage({method: VultureMessage.SUBSCRIBE_TO_ACC_EVENTS, params: {
                    success: true,
                    result: result.toJSON(),
                }});
            });
            */
        }else {
            throw new Error("Cryptography WASM hasn't been initialized yet!");
        }
    }
    async getBalanceOfToken(tokenAddress: string, tokenType: string) {
        if(this.isCryptoReady) {
            switch(tokenType) {
                case 'ERC20': {
                    let erc20contract = new ContractPromise(this.networkAPI!, erc20Abi, tokenAddress);
                    await getERC20Balance(tokenAddress, erc20contract, this.address);
                    break;
                }
                case 'ERC721': {
                    let erc721contract = new ContractPromise(this.networkAPI!, erc721Abi, tokenAddress);
                    await getERC721Balance(tokenAddress, erc721contract, this.address);
                    break;
                }
                default: {
                    console.error("Tried getting balance of token, but the tokenType is invalid!");
                    postMessage({method: VultureMessage.GET_TOKEN_BALANCE, params: {
                        success: false,
                    }});
                }
            }
        }else {
            postMessage({method: VultureMessage.GET_TOKEN_BALANCE, params: {
                success: false,
            }});
            throw new Error("Cryptography WASM hasn't been initialized yet!");
        }
    }
    async addTokenToSubscription(tokenAddress: string, tokenType: string) {
        if(this.isCryptoReady) {
            switch(tokenType) {
                case 'ERC20': {

                    // This doesn't work for some reason... Fix!
                    //const unsub = await this.networkAPI?.query.contracts.contractInfoOf(tokenAddress, async (result: any) => {
                    //    await getERC20Balance(tokenAddress, erc20contract, this.address);
                    //});

                    // Due to the fact that contract subscriptions aren't available yet, this is a temporary work-around.
                    // Will poll the balance ever 2.5 seconds.
                    setInterval(async () => {
                        let erc20contract = new ContractPromise(this.networkAPI!, erc20Abi, tokenAddress);
                        await getERC20Balance(tokenAddress, erc20contract, this.address);
                    }, 2500);
                    break;
                }
                case 'ERC721': {
                    setInterval(async () => {
                        let erc721contract = new ContractPromise(this.networkAPI!, erc721Abi, tokenAddress);
                        await getERC721Balance(tokenAddress, erc721contract, this.address);
                    }, 2500);
                    break;
                }
                default: {
                    console.error("Tried getting balance of token, but the tokenType is invalid!");
                    postMessage({method: VultureMessage.SUBSCRIBE_TO_ACC_EVENTS, params: {
                        success: false,
                    }});
                }
            }
        }else {
            postMessage({method: VultureMessage.GET_TOKEN_BALANCE, params: {
                success: false,
            }});
            throw new Error("Cryptography WASM hasn't been initialized yet!");
        }
    }
    async getTokenData(tokenAddress: string, tokenType: string) {
        if(this.isCryptoReady) {
            try {
                switch(tokenType) {
                    case 'ERC20': {
                        let erc20Contract = new ContractPromise(this.networkAPI!, erc20Abi, tokenAddress);
                        await getERC20Info(tokenAddress, erc20Contract, this.address);
                        break;
                    }
                    case 'ERC721': {
                        let erc721Contract = new ContractPromise(this.networkAPI!, erc721Abi, tokenAddress);
                        await getERC721Info(tokenAddress, erc721Contract, this.address);
                        //console.error("NFT's are currently not supported! (ERC721)");
                        break;
                    }
                }
            }catch(error) {
                console.log(error);
                postMessage(new MethodResponse(
                    VultureMessage.GET_TOKEN_DATA,
                    {
                        tokenData: null,
                        error: "Contract Not Found",
                        success: false,
                    }
                ));
            }
        }
    }
    estimateFee(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    getAddress(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    getBalance(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}