import { AbstractToken } from "../../../src/vulture_backend/types/abstractToken";
import { AccountData, Network } from "../../../src/vulture_backend/wallets/vultureWallet";

export class MethodResponse {
    method: string;
    params: any;

    constructor(method: string, params: any) {
        this.method = method;
        this.params = params;
    }
}

export interface VultureNetwork {
    currentAddress: string,
    networkURI: string,

    getAddress(): void;
    generateAddress(derivationPath: string, accountIndex: number): void,
    updateAccountsToNetwork(accounts: AccountData[], network: Network): void,
    transferAssets(recipent: string, amount: string, token?: AbstractToken): void;
    estimateTxFee(recipent: string, amount: string, token?: AbstractToken): void;
    validateAddress(address: string): void;
    getTokenData(tokenAddress: string, tokenType: string): Promise<void>;
    getBalanceOfToken(tokenAddress: string, tokenType: string, arrayIndexOfToken?: number): Promise<void>;
    getAddressState(): void;
    subscribeToAddressUpdates(): void;
}

export interface AccountActionHandler {
    address: string,
    networkURI: string,

    updateAccountsToNetwork(accounts: AccountData[], network: Network): Promise<void>,
    generateAddress(derivationPath: string, accountIndex: number): Promise<void>,
    transferAssets(recipentAddress: string, amount: string, token?: AbstractToken): Promise<void>;
    estimateTxFee(recipent: string, amount: string, token?: AbstractToken): Promise<void>;
    getAddress(): Promise<void>;
}

export interface AccountInfoHandler {
    address: string,
    networkURI: string,

    subscribeToAddressEvents(): Promise<void>;
    getBalanceOfToken(tokenAddress: string, tokenType: string, arrayIndexOfToken?: number): Promise<void>;
    validateAddress(address: string): Promise<void>;
    getTokenData(tokenAddress: string, tokenType: string): Promise<void>;
    setAddress(address: string): Promise<void>;
    getAddress(): Promise<void>;
    getBalance(): Promise<void>;
}