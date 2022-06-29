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
import BigNumber from 'bignumber.js';

const { ContractPromise } = require('@polkadot/api-contract');



export async function getERC20Balance(tokenAddress: string, contract: any, senderAddress: string) {
    let success: boolean = true;
    let tokenDecimals: number = -1;
    let tokenBalance: string = "0";

    let decimals = await contract.query.decimals(senderAddress, {value: 0, gasLimit: -1});
    try{
        if(decimals.result.isOk) {
            tokenDecimals = decimals.output.toHuman();
        }else {
            console.log("Error: Failed getting token total decimals (the amount of fractions the token is divided into) \n");
            success = false;
        }
    }catch {
        tokenDecimals = -1;
        console.log("Contract '" + tokenAddress + "'" + " Doesn't have decimals()");
        success = false;
    }

    try{
        let balance = await contract.query.balanceOf(senderAddress, {value: 0, gasLimit: -1}, senderAddress);
        if(balance.result.isOk) {
            if(decimals != -1) {
                tokenBalance = new BigNumber((balance.output.toHuman() as string).replaceAll(',', ''))
                .div(new BigNumber(10).pow(tokenDecimals)).toString();
            }else {
                tokenBalance = balance.output.toHuman();
            }
        }else {
            console.log("Error: Failed getting balance!");
            success = false;
            if(balance.result.asErr.toHuman().Module.error == 5) {
            }
        }
        
    }catch {
        console.log("Contract '" + tokenAddress + "'" + " Doesn't have balanceOf() - this is catastrophic for ERC20");
    }

    if(success) {
        postMessage(new MethodResponse(
            VultureMessage.GET_TOKEN_BALANCE,
            {
                tokenAddress: tokenAddress,
                senderAddress: senderAddress,
                tokenType: 'ERC20',
                success: true,
                balance: tokenBalance,
            }
        ));
    }else {
        postMessage(new MethodResponse(
            VultureMessage.GET_TOKEN_BALANCE,
            {
                balance: "Error",
                success: false,
            }
        ));
    }

}

export async function getERC721Balance(tokenAddress: string, contract: any, senderAddress: string) {
    let success: boolean = true;
    let tokenBalance: string = "0";

    try{
        let balance = await contract.query.balanceOf(senderAddress, {value: 0, gasLimit: -1}, senderAddress);
        if(balance.result.isOk) {
            tokenBalance = balance.output.toHuman();
        }else {
            console.log("Error: Failed getting balance for NFT!");
            success = false;
            tokenBalance = "NULL";
        }
        
    }catch {
        console.log("Contract '" + tokenAddress + "'" + " Doesn't have balanceOf() - this is catastrophic for ERC721");
    }

    if(success) {
        postMessage(new MethodResponse(
            VultureMessage.GET_TOKEN_BALANCE,
            {
                tokenAddress: tokenAddress,
                tokenType: 'ERC721',
                senderAddress: senderAddress,
                balance: tokenBalance,
                success: true,
            }
        ));
    }else {
        postMessage(new MethodResponse(
            VultureMessage.GET_TOKEN_BALANCE,
            {
                balance: "Error",
                success: false,
            }
        ));
    }
}

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
            success = false;
            error = "Invalid Contract";
        }
    }catch {
        success = false;
        error = "Invalid Contract";
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
            success = false;
            error = "Invalid Contract.";
            if(balance.result.asErr.toHuman().Module.error == 5) {
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
                error = "Contract Not Found";
            }
        }
    }catch {
        token.name = "No Name";
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
        token.symbol = "No Symbol";
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

export async function getERC721Metadata(tokenAddress: string, contract: any, senderAddress: string, tokenId: number) {

}

export async function getERC721Info(tokenAddress: string, contract: any, senderAddress: string) {
    
    let success: boolean = true;
    let error: string = "";
    let token: AbstractToken = {
        address: tokenAddress,
        decimals: -1,
        name: '',
        symbol: '',
        logoURI: '',
        balance: '0',
        metadataURI: '',
    }

    // Get token name.
    try {
        let nameData = await contract.query.name(senderAddress, {value: 0, gasLimit: -1});
        if(nameData.result.isOk) {
            token.name = nameData.output.toHuman();
        }else {
            console.log("Error: Failed getting token name");
            if(nameData.result.asErr.toHuman().Module.error == 5) {
                error = "Contract Not Found";
            }
        }
    }catch {
        token.name = "No Name";
        console.log("Contract '" + tokenAddress + "'" + " Doesn't have name()");
    }



    // Get token symbol.
    try {
        let nameData = await contract.query.symbol(senderAddress, {value: 0, gasLimit: -1});
        if(nameData.result.isOk) {
            token.symbol = nameData.output.toHuman();
        }else {
            console.log("Error: Failed getting token name");
            if(nameData.result.asErr.toHuman().Module.error == 5) {
                error = "Contract Not Found";
            }
        }
    }catch {
        token.symbol = "No Symbol";
        console.log("Contract '" + tokenAddress + "'" + " Doesn't have symbol()");
    }

    // Get balance the current account has.
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
            success = false;
            error = "Invalid Contract.";
            if(balance.result.asErr.toHuman().Module.error == 5) {
                error = "Contract Not Found";
            }
        }
    }catch {
        success = false;
        error = "Invalid Contract.";
        console.log("Contract '" + tokenAddress + "'" + " Doesn't have balanceOf() - this is catastrophic for ERC721");
    }

    // Get the metadata of the first token the account has, this isn't necessary but is used for UI purposes in the front-end.
    if(Number(token.balance) > 0) {
        let firstTokenId: number = Number.NaN;
        try {
            let firstTokenIdResponse = await contract.query.tokenByIndex(senderAddress, {value: 0, gasLimit: -1}, 0);
            if(firstTokenIdResponse.result.isOk) {
                firstTokenId = firstTokenIdResponse.output.toHuman();
            }else {
                console.log("Error: Failed getting token ID by index!");
                if(firstTokenIdResponse.result.asErr.toHuman().Module.error == 5) {
                    error = "Contract Not Found";
                }
            }
        }catch {
            console.log("Contract '" + tokenAddress + "'" + " Doesn't have tokenByIndex()");
        }
        if(firstTokenId != Number.NaN) {
            try {
                let tokenUri = await contract.query.tokenUri(senderAddress, {value: 0, gasLimit: -1}, firstTokenId);
                if(tokenUri.result.isOk) {
                    token.metadataURI = tokenUri.output.toHuman();
                }else {
                    console.log("Error: Failed getting token URI");
                    if(tokenUri.result.asErr.toHuman().Module.error == 5) {
                        error = "Contract Not Found";
                    }
                }
            }catch {
                console.log("Contract '" + tokenAddress + "'" + " Doesn't have tokenURI()");
            }
        }

    }

    // Get total supply.
    try {
        let totalSupplyData = await contract.query.totalSupply(senderAddress, {value: 0, gasLimit: -1});
        if(totalSupplyData.result.isOk) {
            token.totalSupply = totalSupplyData.output.toHuman();
        }else {
            console.log("Error: Failed getting token total supply! \n");
        }
    }catch {
        success = false;
        error = "Invalid Contract.";
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