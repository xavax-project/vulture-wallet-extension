export const VultureMessage = {
    /* Vault caching */
    "REQUEST_VAULT": "REQUEST_VAULT",
    "SET_VAULT":  "SET_VAULT",

    /* Wallet Management & Queries */
    "SET_CURRENT_WALLET": "SET_CURRENT_WALLET",
    "GET_ADDRESS_FROM_URI" : "GET_ADDRESS_FROM_URI",
    "GET_ACCOUNT_STATE": "GET_ACCOUNT_STATE",
    "SUB_TO_ACCOUNT_STATE": "SUB_TO_ACCOUNT_STATE",
    "TRANSFER_ASSETS": "TRANSFER_ASSETS",

    //Will update the passed in key-pairs to be encoded in the correct cryptography & address format,
    //This method is used primarily when the user switches network (all accounts will need to be updated accordingally).
    "UPDATE_ACCOUNTS_TO_NETWORK": "UPDATE_ACCOUNTS_TO_NETWORK",

    /* Utilities */
    "IS_ADDRESS_VALID": "IS_ADDRESS_VALID",
    "ESTIMATE_TX_FEE": "ESTIMATE_TX_FEE"
}