import { Network } from "../wallets/vultureWallet";



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

/** ## TokenStore
 * The structure of the token save-data. The token store contains:
 * 
 * * User-added list of tokens (Such as ERC20 tokens, usually used with networks without native tokens).
 * * User-added list of NFTs (Such as ERC721 tokens).
 * 
 * *note: Automatic NFT detection would require
 * going through every tx an address has been referenced in, this might be prioritized later...* 
 * 
 * The `TokenStore` is useful when dealing with many a multi-account system. Every network added will have
 * its own `TokenStore`.
 * 
 */
export interface TokenStore {
    userAddedFungibleTokenList: AbstractToken[];
    userAddedNFTList: AbstractToken[];
}