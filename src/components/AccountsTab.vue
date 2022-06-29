<template>
    <div class="flexBox box">
        <div class="itemList" style="top: 5px;">
          <div class="flexBox" style="width: 100%; align-items: center;" >
            
            <AccountModule v-for="(item, index) in allAccounts" v-bind:key="item"
            :accountIndex="index + 1"
            :accountType="item.walletType"
            :accountName="item.accountName"
            :selected="vultureWallet.selectedWalletIndex == (index + 1) ? true : false"
            @module-click="modifyAccount($event)"/>

            <div class="flexBox" style="flex-grow: 0; margin-bottom: 15px; width: 70%; flex-direction: row; align-self: center; justify-content: space-evenly;">
              <DefaultButton :buttonDisabled="vultureWallet.accountStore.allAccounts.length > 1 ? false : true " @button-click="removeAccount()" style="margin-top: 5px; margin-bottom: 15px;"
               buttonWidth="100px" buttonHeight="30px" buttonText="Remove" fontSize="16px"/>
  
              <DefaultButton @button-click="createNewAccount()" style="margin-top: 5px; margin-bottom: 15px;"
               buttonWidth="100px" buttonHeight="30px" buttonText="Add" fontSize="16px"/>
            </div>
          </div>

          <!--
            <AccountModule accountIndex="2" accountType="Mnemonic" accountName="DeFi"/>
          -->
        </div>
    </div>
</template>

<script lang="ts">
import DefaultButton from "./building_parts/DefaultButton.vue";
import DefaultInput from "./building_parts/DefaultInput.vue";
import AccountModule from "../components/AccountModule.vue"

import { AccountData, VultureWallet } from '../vulture_backend/wallets/vultureWallet'
import { defineComponent, PropType } from '@vue/runtime-core';
import { ref } from 'vue';

export default defineComponent({
  name: "AccountsTab",
  components: {
    DefaultButton,
    AccountModule,
    DefaultInput
  },
  props: {
    allAccounts: {
      type: Array as PropType<AccountData[]>,
    },
    vultureWallet: {
      type: Object as PropType<VultureWallet>,
      required: true,
    }
  },
  methods: {
    createNewAccount() {
        this.$emit('create-new-account');
    }
  },
  setup(props, context) {

    function modifyAccount(index: number) {
      context.emit('modify-account', index);
    }

    function removeAccount() {
      props.vultureWallet.popAccount();
    }

    return {
      removeAccount: removeAccount,
      modifyAccount: modifyAccount,
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.box {
    height: 320px;
    flex-direction: column;
}
.itemList {
  position: absolute;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  border-radius: 0px;

  border-width: 0px;
  height: 100%;
  width: 100%;

  align-items: center;
    

  justify-content: flex-start;
  overflow: hidden;
  overflow-y: scroll;
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
