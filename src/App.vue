<template>
<span :style="'--accent_color: ' +  currentAccentColor">
  <div v-if="walletState == state.WALLET">
  <OverviewModule v-if="vultureWallet.accountStore != null" :address="address"
    :assetPrefix="assetPrefix"
    :assetAmount="assetAmount"
    :accountName="vultureWallet.currentWallet.accountData.accountName"
    @select-account="setModal(modals.SELECT_NEW_ACCOUNT)"
    @select-network="setModal(modals.SELECT_NEW_NETWORK)"
  />
  <Navbar @switch-tab="setTab($event)"/>

  <SendTab style="position: absolute; width: 360px;" v-bind:class="currentTab == 'send' ? 'show' : 'hide'"
  @send-button-click="transferAssets($event)"
  @select-new-asset="setModal(modals.SELECT_NEW_ASSET)"
  :selectedTokenArrayIndex="selectedTokenArrayIndex"
  :vultureWallet="vultureWallet"/>

  <WalletTab style="position: absolute; width: 360px;" v-bind:class="currentTab == 'wallet' ? 'show' : 'hide'"
  :vultureWallet="vultureWallet"
  @add-custom-token="addToken($event)"
  @token-view-modal="tokenViewModal($event.index, $event.type)"/>

  <AccountsTab v-if="vultureWallet.accountStore != null" v-bind:class="currentTab == 'accounts' ? 'show' : 'hide'" style="position: absolute; width: 360px; height: 345px;"
  :allAccounts="vultureWallet.accountStore.allAccounts"
  :vultureWallet="vultureWallet"
  
  @create-new-account="setModal(modals.CREATE_NEW_ACCOUNT)"
  @modify-account="modifyAccount($event)"/>

  <SettingsTab v-bind:class="currentTab == 'settings' ? 'show' : 'hide'" style="position: absolute; width: 360px; height: 345px;"
  :vultureWallet="vultureWallet"
  @reset-wallet="resetWallet()"/>

  <Modal v-bind:class="currentModal == modals.NONE ? 'hide' : 'show'"
  :modalType="currentModal"
  :vultureWallet="vultureWallet"
  :selectedAccountIndex="selectedAccountIndex"
  :recipentAddress="recipentAddress"
  :amountToSend="amountToSend"
  :tokenTypeToAdd="tokenTypeToAdd"
  :arrayIndexOfSelectedToken="arrayIndexOfSelectedToken"
  :selectedTokenArrayIndex="selectedTokenArrayIndex"
  @quit-modal="quitModal()"
  @on-wallet-reset="onWalletReset()"
  @select-token="selectToken($event)"
  @reset-selected-token="resetSelectedToken()"/>

</div>

<div v-if="walletState == state.PASSWORD_LOCKED">
  <UnlockWallet @decrypted-vault="initWallet($event)" :encryptedVault="vault"/>
</div>

<div v-if="walletState == state.ONBOARDING">
  <Onboarding style="position: absolute; width: 360px;"/>
</div>
</span>

</template>

<script lang="ts">
import OverviewModule from "./components/OverviewModule.vue";
import DefaultButton from "./components/building_parts/DefaultButton.vue";
import UnlockWallet from "./components/UnlockWallet.vue";
import AccountsTab from "./components/AccountsTab.vue";
import SettingsTab from "./components/SettingsTab.vue";
import Onboarding from "./components/Onboarding.vue";
import WalletTab from "./components/WalletTab.vue";
import SendTab from "./components/SendTab.vue";
import Navbar from "./components/Navbar.vue";
import Modal from "./components/modals/Modal.vue";


import { provide } from 'vue';

import { doesWalletExist, VultureWallet, loadVault, Vault, loadAccounts,
         deleteWallet, VultureAccountStore, AccountData} from "./vulture_backend/wallets/vultureWallet";
import { Modals, WalletStates } from "./uiTypes";
import { reactive, ref } from '@vue/reactivity';
import { VultureMessage } from './vulture_backend/vultureMessage';

//openWebApp();
export default {
    name: "Vulture Wallet",
    components: {
      OverviewModule,
      DefaultButton,
      UnlockWallet,
      AccountsTab,
      SettingsTab,
      Onboarding,
      WalletTab,
      SendTab,
      Navbar,
      Modal
    },
    setup() {

      // This setup() method *is* very messy, will move things out and do cleaning
      // Later when I decide to refactor. It is essentially entirely temporary.

      let vultureWallet = reactive(new VultureWallet());
      let walletState = ref(WalletStates.LOADING);
      let currentModal  = ref(Modals.NONE);
      let vault = ref('');

      let modals = Modals;
      let state = WalletStates;


      //Token variables, a bit messy to have this here, will refactor later. 
      let tokenTypeToAdd = ref('');
      let arrayIndexOfSelectedToken = ref(0);

      // The array index of the selected asset, -1 is native asset of the selected network.
      let selectedTokenArrayIndex = ref(-1);
      

      /* --- Transfer Asset Variables & Functions --- */

      let recipentAddress = ref('');
      let amountToSend = ref('')

      let currentAccentColor = ref('#4dff97');

      let selectedAccountIndex = ref(0);

      function setTransferValues(value: string, isAddress: boolean) {
        if(isAddress) {
          recipentAddress.value = value;
        }else {
          amountToSend.value = String(value);
        }
      }
      function transferAssets(data: any) {
        recipentAddress.value = data.recipent;
        amountToSend.value = String(data.amount);
        arrayIndexOfSelectedToken.value = data.tokenArrayIndex;
        setModal(modals.TRANSFER_ASSETS);
        //vultureWallet.currentWallet.transferAssets(recipentAddress.value, Number(amountToSend.value));
      }
      /* --- Transfer Asset Variables & Functions --- */


      let assetAmount = ref('Loading');
      let assetPrefix = ref('...');
      let address = ref(' ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~');
      doesWalletExist().then((value) => {
        if(value == true) {
          walletState.value = WalletStates.WALLET;
          loadVault().then((value: any) => {
            vault.value = value as any;
              walletState.value = WalletStates.PASSWORD_LOCKED;
            //if(vault == null) {
            //}
          });

        }else {
          walletState.value = WalletStates.ONBOARDING;
        }

      });
      
      async function initWallet(vaultE: Vault) {
        loadAccounts().then(async (accounts)=> {
          //vultureWallet = new VultureWallet(vault, accounts as VultureAccountStore);
          await vultureWallet.initWallet(vaultE, accounts as VultureAccountStore);
          walletState.value = WalletStates.WALLET;
          currentAccentColor.value = vultureWallet.accountStore.currentlySelectedNetwork.networkColor;
          
          //Not extremely happy that I'm doing this, but vue seems to really like being a bitch about updating these set of values manually,
          //just a temporary work-around until I improve the state management & reactivity (the values should be reactive, kinda weird...)
          setInterval(()=> {
          if(vultureWallet.currentWallet != null) {
            assetAmount.value = String(vultureWallet.currentWallet.accountData.freeAmountWhole);
            assetPrefix.value = vultureWallet.accountStore.currentlySelectedNetwork.networkAssetPrefix;
            address.value = vultureWallet.currentWallet.accountData.address;
          }
        }, 1000);
        });
      }

      /* --- Modal functions --- */
      function setModal(modal: Modals) {
        currentModal.value = modal;
      }
      function modifyAccount(accountIndex: number) {
        selectedTokenArrayIndex.value = -1;
        selectedAccountIndex.value = accountIndex;
        currentModal.value = modals.MODIFY_ACCOUNT;
      }
      function quitModal() {
        currentModal.value = Modals.NONE;
        currentAccentColor.value = vultureWallet.accountStore.currentlySelectedNetwork.networkColor;
      }

      function resetWallet() {
        currentModal.value = modals.RESET_WALLET
      }
      function onWalletReset() {
        currentModal.value = modals.NONE;
        walletState.value = WalletStates.ONBOARDING;
      }

      function addToken(tokenType: string) {
        setModal(Modals.ADD_CUSTOM_TOKEN);
        tokenTypeToAdd.value = tokenType;
      }
      function tokenViewModal(arrayIndexOfToken: number, tokenType: string) {
        arrayIndexOfSelectedToken.value = arrayIndexOfToken;
        tokenTypeToAdd.value = tokenType;
        setModal(Modals.TOKEN_VIEW);
      }

      function selectToken(arrayIndexOfToken: number) {
        selectedTokenArrayIndex.value = arrayIndexOfToken;
      }
      // I Use this function whenever the token should be reset to native, usually called when the user removes a token
      // from the list (through events).
      function resetSelectedToken() {
        selectedTokenArrayIndex.value = -1;
      }

      return {
        vultureWallet,
        walletState,
        currentModal,
        vault,
        assetAmount,
        assetPrefix,
        address,

        modals,
        state,
  
        arrayIndexOfSelectedToken,
        tokenTypeToAdd,

        recipentAddress,
        amountToSend,

        selectedAccountIndex,

        selectedTokenArrayIndex,

        currentAccentColor,

        initWallet: initWallet,
        transferAssets: transferAssets,
        setTransferValues: setTransferValues,
        setModal: setModal,
        tokenViewModal: tokenViewModal,
        quitModal: quitModal,
        resetWallet: resetWallet,
        modifyAccount: modifyAccount,
        onWalletReset: onWalletReset,
        addToken: addToken,
        selectToken: selectToken,
        resetSelectedToken: resetSelectedToken,
      }
    },
    data(){
      
      //console.log(vault);
      return {
        currentTab: 'send',
      }
    },
    props: {
    },
    methods: {
      setTab(tab: string) {
        this.currentTab = tab;
      },
    },
}
</script>

<style>
@font-face {
    font-family: fonticonA;
    src: url("./assets/fonts/MaterialIconsRound-Regular.otf");
}
@font-face {
    font-family: GardensC;
    src: url("./assets/fonts/Assistant/Assistant-VariableFont_wght.ttf");
}
@font-face {
    font-family: ButtonFont;
    font-weight: 800;
    src: url("./assets/fonts/GlacialIndifference-Regular.otf");
}
#app {
  margin: 0px;
  padding: 0px;
  font-family: GardensC;
}
body {
  margin: 0px;
  padding: 0px;
  font-family: GardensC;
}
html {
  --bg_color: rgb(22, 22, 22);
  --bg_color_2: rgb(38, 38, 38);

  --incorrect_color: rgb(255, 0, 65);
  
  --fg_color: rgb(255,255,255);
  --fg_color_2: rgb(150, 150, 150);

/*
  --accent_color: #4dff97;
 */

  font-family: GardensC;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--fg_color);
  background-color: var(--bg_color);
  margin: 0px;
  padding: 0px;

  min-width: 360px;
  max-width: 360px;
  min-height: 560px;
  max-height: 560px;
}
::selection {
  background: var(--accent_color);
}
.flexBox {
  display: flex;
  box-sizing: border-box;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  flex-grow: 1;
}
.show {
  visibility: visible;
  transition-duration: 180ms;
  filter: opacity(1);
}
.hide {
  visibility: hidden;
  margin-top: 32px;
  transition-duration: 140ms;
  filter: opacity(0);
}

.showLoader {
  visibility: visible;
  transition-duration: 180ms;
  filter: opacity(1);
}
.hideLoader {
  visibility: hidden;
  transition-duration: 140ms;
  filter: opacity(0);
}

.vultureLoader {
  display: inline-block;
  width: 80px;
  height: 80px;
}
.vultureLoader:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 3px solid;

  border-color: var(--accent_color) var(--bg_color_2) var(--accent_color) var(--bg_color_2);
  
  animation: vultureLoaderFrames 0.87s infinite;
  box-shadow: 0px 0px 8px black inset;
}
@keyframes vultureLoaderFrames {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

a {
  color: var(--accent_color);
  transition-duration: 180ms;
}
a:hover {
  text-shadow: 0px 0px 3px var(--accent_color);
  transition-duration: 180ms;
  text-decoration: none;
}
a:active {
  filter: brightness(80%);
}

*::-webkit-scrollbar {
  width: 5px;         
}
*::-webkit-scrollbar-track {
  box-shadow: 0px 0px 0px rgba(0,0,0,1);
  background: rgb(16,16,16);
  border-radius: 5px;
}

*::-webkit-scrollbar-thumb {
  background-color: var(--bg_color_2);
  border-radius: 5px;
}
</style>
