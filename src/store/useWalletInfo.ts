import { defineStore } from "pinia";


/* --- NOTE:
    Vulture will switch to Pinia statemanagement, the back-end components will contain data which won't be used in the UI,
    the Pinia state however is intended to contain all the data that is exclusively used by the UI;

    The reason for this is to lessen confusion and create a clearer boundry between the vulture back-end and front-end.

    This will mainly be a thing in v0.1.7 - v0.1.8 of Vulture.
*/

export const useWalletInfo = defineStore("WalletDataStore", {
    state: () => ({
        walletAddress: "",
        walletBalance: "",
    }),
    getters: {

    },
    actions: {
        setAddress(address: string) {
            this.walletAddress = address;
        },
        setBalance(balance: string) {
            this.walletBalance = balance;
        }
    }
});