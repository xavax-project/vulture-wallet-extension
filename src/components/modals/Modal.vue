<template>
    <div class="flexBox box" style="position: absolute; height: 550px; width: 350px; top: 5px; left: 5px;">
        <CreateAccountModal v-if="modalType == modals.CREATE_NEW_ACCOUNT"
        @quit-modal="quitModal()" 
        :vultureWallet="vultureWallet"
        :nextAccountIndex="vultureWallet.nextDerivIndex"/>

        <ModifyAccountModal v-if="modalType == modals.MODIFY_ACCOUNT"
        @quit-modal="quitModal()" 
        :vultureWallet="vultureWallet"
        :selectedAccount="selectedAccountIndex"/>

        <SelectAccountModal v-if="modalType == modals.SELECT_NEW_ACCOUNT"
        @quit-modal="quitModal()" 
        :vultureWallet="vultureWallet"
        :nextAccountIndex="vultureWallet.nextDerivIndex"/>

        <SelectNetworkModal v-if="modalType == modals.SELECT_NEW_NETWORK"
        @quit-modal="quitModal()" 
        :vultureWallet="vultureWallet"
        :nextAccountIndex="vultureWallet.nextDerivIndex"/>

        <TransferAssetsModal v-if="modalType == modals.TRANSFER_ASSETS"
        @quit-modal="quitModal()" 
        :vultureWallet="vultureWallet"
        :recipentAddress="recipentAddress"
        :amountToSend="amountToSend"
        :addressOfTokenToTransfer="addressOfTokenToTransfer"/>

        <ResetWalletModal v-if="modalType == modals.RESET_WALLET"
        @quit-modal="quitModal()"
        @on-wallet-reset="hardWalletReset()"
        :vultureWallet="vultureWallet"/>


        <AddTokenModal v-if="modalType == modals.ADD_CUSTOM_TOKEN"
        @quit-modal="quitModal()" 
        :vultureWallet="vultureWallet"
        :tokenTypeToAdd="tokenTypeToAdd"/>

        <TokenViewModal v-if="modalType == modals.TOKEN_VIEW"
        @quit-modal="quitModal()"
        @reset-selected-token="resetSelectedToken()"
        :vultureWallet="vultureWallet"
        :tokenType="tokenTypeToAdd"
        :tokenAddress="addressOfTokenToView"/>

        <SelectAssetModal v-if="modalType == modals.SELECT_NEW_ASSET"
        @quit-modal="quitModal()"
        @select-token="selectToken($event)"
        :vultureWallet="vultureWallet"
        :selectedTokenAddress="addressOfTokenToTransfer"/>
        
    </div>
</template>

<script lang="ts">
import DefaultButton from "../building_parts/DefaultButton.vue";
import TokenViewModal from './TokenViewModal.vue';
import ResetWalletModal from './ResetWalletModal.vue';
import CreateAccountModal from './CreateAccountModal.vue';
import ModifyAccountModal from './ModifyAccountModal.vue';
import SelectAccountModal from './SelectAccountModal.vue';
import SelectNetworkModal from './SelectNetworkModal.vue';
import TransferAssetsModal from './TransferAssetsModal.vue';
import SelectAssetModal from './SelectAssetModal.vue';

import AddTokenModal from "./AddTokenModal.vue"

import { Modals } from "../../uiTypes";
import { defineComponent, PropType } from "@vue/runtime-core";
import { VultureWallet } from "../../vulture_backend/wallets/vultureWallet";


export default defineComponent({
  name: "Modal",
  components: {
    DefaultButton,
    ResetWalletModal,
    ModifyAccountModal,
    CreateAccountModal,
    SelectAccountModal,
    SelectNetworkModal,
    TransferAssetsModal,
    SelectAssetModal,
    TokenViewModal,
    AddTokenModal,
  },
  props: {
      modalType: {
          type: Number as PropType<Modals>,
          required: true,
      },
      vultureWallet: {
          type: Object as PropType<VultureWallet>,
          required: true,
      },
      selectedAccountIndex: Number,

      recipentAddress: String,
      amountToSend: String,

      tokenTypeToAdd: String,
      addressOfTokenToView: String,
      addressOfTokenToTransfer: String
  },
  setup(props, context) {
    let modals = Modals;

    function quitModal() {
        context.emit("quit-modal");
    }
    function selectToken(tokenAddress: string) {
        context.emit("select-token", tokenAddress);
    }
    function hardWalletReset() {
        context.emit("on-wallet-reset");
    }
    function resetSelectedToken() {
        context.emit("reset-selected-token");
    }

    return {
        modals,
        quitModal: quitModal,
        hardWalletReset: hardWalletReset,
        resetSelectedToken: resetSelectedToken,
        selectToken: selectToken,
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.vultureLogo {
    fill: var(--bg_color);
    filter: drop-shadow(0px 0px 5px rgb(2,2,2));
}
.styled {
    color: var(--accent_color);
}
.welcomeText {
    font-size: 16px;
    text-align: center;
}
.box {
    flex-direction: column;
    background-color: var(--bg_color);
    box-shadow: 0px 0px 7px rgb(7, 7, 7);
    border-width: 2px;
    border-color: var(--bg_color_2);
    border-style: solid;
    border-radius: 12px;
    z-index: 2;
}
</style>
