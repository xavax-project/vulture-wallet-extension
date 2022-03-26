<template>
    <div class="flexBox" style="height: 100%; width: 100%;">
        <div class="flexBox" style="flex-grow: 1; padding-left: 15px; padding-right: 15px; width: 100%;
        flex-direction: column; align-items: center; margin-top: 5px; box-sizing: border-box; font-size: 24px;">
            
            <div style="width: 100%; text-align: center; margin-bottom: 10px; margin-top: 20px;">
                Select Account <br>
                <span style="font-size: 14px;  color: var(--fg_color_2); margin-bottom: 5px;">You have <span style="color: var(--accent_color)">{{accountAmount}}</span> accounts.</span>
                <hr>
            </div>

            <div class="itemList" style="top: 0px; height: 370px;">
              <div class="flexBox" style="width: 100%; align-items: center;" >
              
                <AccountModule style="margin-top: 10px;" v-for="(item, index) in vultureWallet.accountStore.allAccounts" v-bind:key="item"
                :accountIndex="index + 1"
                :accountType="item.walletType"
                :accountName="item.accountName"
                :selected="vultureWallet.selectedWalletIndex == (index + 1) ? true : false"
                @module-click="selectAccount($event)"/>

                <span style="font-size: 14px;  color: var(--fg_color_2); margin-bottom: 5px;">You can create new accounts in the<br> accounts tab.</span>
              </div>
            <!--
              <AccountModule accountIndex="2" accountType="Mnemonic" accountName="DeFi"/>
            -->
            </div>

        </div>
        <div class="flexBox" style="flex-grow: 0; margin-bottom: 15px; width: 100%; flex-direction: row; align-self: center; justify-content: space-evenly;">
            <DefaultButton buttonHeight="40px" buttonWidth="150px" buttonText="Return" @button-click="quitModal()"/>
        </div>
    </div>
</template>

<script lang="ts">
import DefaultButton from "../building_parts/DefaultButton.vue";
import DefaultInput from "../building_parts/DefaultInput.vue";
import DropdownSelection from "../building_parts/DropdownSelection.vue";
import AccountModule from "../AccountModule.vue"

import { VultureWallet, createNewAccount, WalletType, DefaultNetworks, Network, NetworkType} from "../../vulture_backend/wallets/vultureWallet";
import { PropType, reactive, ref } from 'vue';

export default {
  name: "SelectAccountModal",
  components: {
    DropdownSelection,
    AccountModule,
    DefaultButton,
    DefaultInput,
  },
  props: {
    vultureWallet: {
        type: Object as PropType<VultureWallet>,
        required: true,
    },
    nextAccountIndex: Number
  },
  setup(props: any, context: any) {

    let accountName: string;
    const networks = new DefaultNetworks();

    let accountAmount = ref(0);
    accountAmount.value = (props.vultureWallet as VultureWallet).accountStore.allAccounts.length;
    let selectedNetwork = reactive({network: networks.AlephZero});

    function quitModal() {
        context.emit("quit-modal");
    }
    function setName(name: string) {
        accountName = name;
    }
    function selectAccount(index: number) {
        (props.vultureWallet as VultureWallet).switchWallet(index);
        quitModal();
    }

    return {
        networks,
        accountAmount,
        selectedNetwork,

        selectAccount: selectAccount,
        quitModal: quitModal,
        setName: setName,
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
hr {
    margin-top: 5px;
    margin-bottom: 5px;
    border: none;
    height: 1px;
    background-color: var(--fg_color_2);
}
.itemList {
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  border-radius: 12px;

  border-width: 0px;
  height: 100%;
  width: 100%;

  align-items: center;

  outline-style: solid;
  outline-width: 1px;
  outline-color: var(--bg_color_2);
    

  justify-content: flex-start;
  overflow: hidden;
  overflow-y: scroll;
}
.vultureLogo {
    fill: var(--bg_color);
    filter: drop-shadow(0px 0px 5px rgb(2,2,2));
}
.styled {
    color: var(--accent_color);
}
.box {
    flex-direction: column;
    background-color: var(--bg_color);
    box-shadow: 0px 0px 7px rgb(7, 7, 7);
    border-width: 2px;
    border-color: var(--bg_color_2);
    border-style: solid;
    border-radius: 24px;
    z-index: 2;
}
* {
  scrollbar-width: 0px;
  scrollbar-color: rgba(34, 34, 34, 0) rgba(34, 34, 34, 0);
}
*::-webkit-scrollbar {
  width: 0px;         
}

*::-webkit-scrollbar-track {
  background: rgba(34, 34, 34, 0);
  border-radius: 0px;
}

*::-webkit-scrollbar-thumb {
  background-color: rgba(34, 34, 34, 0);
  border-radius: 0px;
  border: 0px solid rgba(34, 34, 34, 0);
}
</style>
