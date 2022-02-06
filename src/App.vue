<template>
<div v-if="walletState == state.WALLET">
  <OverviewModule :address="address"
    :assetPrefix="assetPrefix"
    :assetAmount="assetAmount"
    @select-account="setModal(modals.SELECT_NEW_ACCOUNT)"
  />
  <Navbar @switch-tab="setTab($event)"/>

  <SendTab style="position: absolute; width: 360px;" v-bind:class="currentTab == 'send' ? 'show' : 'hide'"
  @send-button-click="transferAssets($event)"
  :vultureWallet="vultureWallet"/>

  <AccountsTab v-bind:class="currentTab == 'accounts' ? 'show' : 'hide'" style="position: absolute; width: 360px; height: 345px;"
  :allAccounts="vultureWallet.allAccounts"
  :vultureWallet="vultureWallet"
  
  @create-new-account="setModal(modals.CREATE_NEW_ACCOUNT)"
  @modify-account="modifyAccount($event)"/>

  <Modal v-bind:class="currentModal == modals.NONE ? 'hide' : 'show'"
  :modalType="currentModal"
  :vultureWallet="vultureWallet"
  :selectedAccountIndex="selectedAccountIndex"
  :recipentAddress="recipentAddress"
  :amountToSend="amountToSend"
  @quit-modal="quitModal()"/>

</div>

<div v-if="walletState == state.PASSWORD_LOCKED">
  <UnlockWallet @decrypted-vault="initWallet($event)" :encryptedVault="vault"/>
</div>

<div v-if="walletState == state.ONBOARDING">
  <Onboarding style="position: absolute; width: 360px;"/>
</div>

</template>

<script lang="ts">
import OverviewModule from "./components/OverviewModule.vue";
import DefaultButton from "./components/building_parts/DefaultButton.vue"
import UnlockWallet from "./components/UnlockWallet.vue"
import AccountsTab from "./components/AccountsTab.vue"
import Onboarding from "./components/Onboarding.vue"
import SendTab from "./components/SendTab.vue"
import Navbar from "./components/Navbar.vue"
import Modal from "./components/modals/Modal.vue";



import { doesWalletExist, VultureWallet, loadVault, Vault, loadAccounts,
         deleteWallet, VultureAccountStore, AccountData} from "./vulture_backend/wallets/IvultureWallet";
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
      Onboarding,
      SendTab,
      Navbar,
      Modal
    },
    setup() {
      let vultureWallet = reactive(new VultureWallet());
      let walletState = ref(WalletStates.LOADING);
      let currentModal  = ref(Modals.NONE);
      let vault = ref('');

      let modals = Modals;
      let state = WalletStates;

      /* --- Transfer Asset Variables & Functions --- */

      let recipentAddress = ref('');
      let amountToSend = ref('')

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
          loadVault().then((value) => {
            vault.value = value as any;
              walletState.value = WalletStates.PASSWORD_LOCKED;
            //if(vault == null) {
            //}
          });

        }else {
          walletState.value = WalletStates.ONBOARDING;
        }

      });
      
      function initWallet(vaultE: Vault) {
        loadAccounts().then((accounts)=> {
          //vultureWallet = new VultureWallet(vault, accounts as VultureAccountStore);
          vultureWallet.initWallet(vaultE, accounts as VultureAccountStore);
          walletState.value = WalletStates.WALLET;
          
          //Not extremely happy that I'm doing this, but vue seems to really like being a bitch about updating these set of values manually,
          //just a temporary work-around until I improve the state management & reactivity (the values should be reactive, kinda weird...)
          setInterval(()=> {
          if(vultureWallet.currentWallet != null) {
            assetAmount.value = String(vultureWallet.currentWallet.accountData.freeAmountWhole);
            assetPrefix.value = vultureWallet.currentWallet.accountData.network.networkAssetPrefix;
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
        selectedAccountIndex.value = accountIndex;
        currentModal.value = modals.MODIFY_ACCOUNT;
      }
      function quitModal() {
        currentModal.value = Modals.NONE;
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

        recipentAddress,
        amountToSend,

        selectedAccountIndex,

        initWallet: initWallet,
        transferAssets: transferAssets,
        setTransferValues: setTransferValues,
        setModal: setModal,
        quitModal: quitModal,
        modifyAccount: modifyAccount
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
    created() {

    },
}
</script>

<style>
@font-face {
    font-family: fonticonA;
    src: url("./assets/fonts/fa-solid-900.ttf");
}
@font-face {
    font-family: GardensC;
    src: url("./assets/fonts/GlacialIndifference-Regular.otf");
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
  
  --fg_color: rgb(255,255,255);
  --fg_color_2: rgb(150, 150, 150);

  --accent_color: rgb(77, 255, 151);

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

* {
  scrollbar-width: 5px;
  scrollbar-color: var(--bg_color_2);
}
*::-webkit-scrollbar {
  width: 5px;         
}

*::-webkit-scrollbar-track {
  background: var(--bg_color_2);
  border-radius: 5px;
}

*::-webkit-scrollbar-thumb {
  background-color: var(--bg_color);

  border-radius: 5px;
  border-width: 1px;
  border: 1px solid var(--bg_color);

}
</style>
