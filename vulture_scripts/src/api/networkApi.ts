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
    getAddressState(): void;
    subscribeToAddressUpdates(): void;
}