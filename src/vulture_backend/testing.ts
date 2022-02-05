/*
import { ApiPromise, WsProvider, Keyring} from '@polkadot/api';
//import { cryptoWaitReady } from '@polkadot/util-crypto';
import { generateMnemonic } from 'bip39';

// Construct
//5GbiE1EYboaKtWStVd5ziMSrEM4jZLdTNRT4rPXWncy4smeU
export async function test() {

    //await cryptoWaitReady();

    let mnemonic = "chat trial mobile satoshi unfair mad mixed pulse milk awesome meat mixed holiday hope pause chunk conduct palace injury misery resist enrich armed amazing";
    const keyring = new Keyring({type: 'sr25519'});
    const pairOne = keyring.addFromUri(mnemonic + "//" + "0/0")
    console.log("address: ", pairOne.address);

    const wsProvider = new WsProvider("wss://ws.test.azero.dev");
    console.log(wsProvider);
    const api = await ApiPromise.create({ provider: wsProvider });
    
    let res = await api.query.system.account(pairOne.address);

    console.log(res.toU8a());

    //const txHash = await api.tx.balances.transfer("5GbiE1EYboaKtWStVd5ziMSrEM4jZLdTNRT4rPXWncy4smeU", 1).signAndSend(pairOne);
    //console.log(txHash.toJSON());
}
 */