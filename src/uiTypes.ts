export enum Modals{
    NONE,
    CREATE_NEW_ACCOUNT,
    SELECT_NEW_ACCOUNT,
    TRANSFER_ASSETS,
    MODIFY_ACCOUNT,
}
export enum WalletStates {
  LOADING,
  ONBOARDING,
  WALLET,
  PASSWORD_LOCKED,
}

export enum TxState{
  NONE,
  SENDING,
  PENDING,
  SUCCESS,
  FAILED,
}