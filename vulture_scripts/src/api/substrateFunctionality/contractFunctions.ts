import { cryptoWaitReady } from '@polkadot/util-crypto';

import { WsProvider, Keyring, ApiPromise} from '@polkadot/api';

import { decodeAddress, encodeAddress } from "@polkadot/keyring";
import { hexToU8a, isHex } from "@polkadot/util";
import { KeyringPair } from '@polkadot/keyring/types';

import { VultureNetwork, MethodResponse } from '.././networkApi';
import { VultureMessage } from '../../../../src/vulture_backend/vultureMessage';
import { AccountData, Network } from '../../../../src/vulture_backend/wallets/vultureWallet';
import { AbstractToken } from '../../../../src/vulture_backend/types/abstractToken';
import { erc20Abi } from '../../ink_contract_abis/erc20Abi';
import BigNumber from 'bignumber.js';

const { ContractPromise } = require('@polkadot/api-contract');



export async function getERC20Info(tokenAddress: string, contract: any, senderAddress: string) {

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

    let decimals = await contract.query.decimals(senderAddress, {value: 0, gasLimit: -1});
    try{
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
        let balance = await contract.query.balanceOf(senderAddress, {value: 0, gasLimit: -1}, senderAddress);
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
        let nameData = await contract.query.name(senderAddress, {value: 0, gasLimit: -1});
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
        let symbolData = await contract.query.symbol(senderAddress, {value: 0, gasLimit: -1});
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
        let totalSupplyData = await contract.query.totalSupply(senderAddress, {value: 0, gasLimit: -1});
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

export async function getERC721Info(tokenAddress: string) {

}