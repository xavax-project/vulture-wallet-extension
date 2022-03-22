import { Network } from "../wallets/IvultureWallet";



/** ## AbstractToken
 * An abstract representation of ERC20/Native tokens/assets which can be used to represent tokens on
 * any smart-contract blockchain, ex `Avalanche C-Chain`, or `Aleph Zero`, or native assets that reside
 * within blockchains, such as `Avalanche X-Chain`.
 * 
 * This interface is primarily used to represent tokens that an account has and can send.
 */
export interface AbstractToken {
    chainId?: number
    chainName?: string
    network: Network

    address: string,
    decimals: number,
    name: string,
    symbol: string,
    logoURI: string,
} 