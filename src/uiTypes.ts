// The current modal being displayed to the user.
export enum Modals{
  CREATE_NEW_ACCOUNT,
  SELECT_NEW_ACCOUNT,
  SELECT_NEW_NETWORK,
  ADD_CUSTOM_TOKEN,
  SELECT_NEW_ASSET,
  TRANSFER_ASSETS,
  MODIFY_ACCOUNT,
  RESET_WALLET,
  TOKEN_VIEW,
  NONE,
}
// The login state of the wallet.
export enum WalletStates {
  PASSWORD_LOCKED,
  ONBOARDING,
  LOADING,
  WALLET,
}
// The state of the current transaction the wallet is "working" on.
export enum TxState{
  SENDING,
  PENDING,
  SUCCESS,
  FAILED,
  NONE,
}