<template>
    <div class="flexBox box">
        <div class="itemList" style="top: 5px;">
            <div class="container">
                Account Settings<br>
                <hr>
                <DefaultButton buttonText="Reset Wallet" buttonHeight="35px" buttonWidth="180px"
                @button-click="resetWallet()"
                />
            </div>
            <div class="container">
                About<br>
                <hr>
                <div style="font-size: 16px; color: var(--fg_color_2)">
                    Vulture is an open-source, non-custodial wallet developed by the xavax.io project.<br> <br>
                    <span style="color: var(--accent_color)">v0.1.6-beta</span>
                </div> 
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import DefaultButton from "./building_parts/DefaultButton.vue";
import DefaultInput from "./building_parts/DefaultInput.vue";
import AccountModule from "../components/AccountModule.vue"

import { AccountData, VultureWallet } from '../vulture_backend/wallets/IvultureWallet'
import { PropType } from '@vue/runtime-core';
import { ref } from 'vue';

export default {
  name: "SettingsTab",
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
  setup(props: any, context: any) {

    function resetWallet() {
        context.emit('reset-wallet');
    }

    return {
        resetWallet: resetWallet,
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
hr {
    margin-top: 8px;
    margin-bottom: 12px;
    border: none;
    height: 1px;
    width: 100%;
    background-color: var(--fg_color_2);
}
.box {
    height: 320px;
    flex-direction: column;
}
.container {
    display: flex;
    flex-direction: column;
    font-size: 20px;
    align-items: center;
    border-radius: 12px;
    border-width: 1px;
    border-style: solid;
    border-color: var(--bg_color_2);
    padding: 12px;
    margin: 12px;
    width: 80%;
    height: auto;
    overflow: hidden;
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

</style>
