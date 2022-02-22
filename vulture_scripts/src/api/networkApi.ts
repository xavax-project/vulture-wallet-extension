import { AccountData, Network } from "../../../src/vulture_backend/wallets/IvultureWallet";

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
    transferAssets(recipent: string, amount: string): void;
    estimateTxFee(recipent: string, amount: string): void;
    validateAddress(address: string): void;
    getAddressState(): void;
    subscribeToAddressUpdates(): void;
}