export enum Modals{
  CREATE_NEW_ACCOUNT,
  SELECT_NEW_ACCOUNT,
  TRANSFER_ASSETS,
  MODIFY_ACCOUNT,
  RESET_WALLET,
  NONE,
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