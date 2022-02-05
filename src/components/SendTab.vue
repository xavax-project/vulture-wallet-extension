
<template>
    <div class="flexBox box">
        <div class="flexBox" style="position: absolute; width: 100%; box-sizing: border-box; padding-left: 20px; padding-right: 20px; top: 20px; align-items: center;">
            <MinimalInput @on-enter="address($event)" inputPlaceholder="Address" inputWidth="315px" inputHeight="38px" fontSize="12px" inputName="Recipent Address"/>
            <div class="flexBox" style="width: 100%; flex-direction: row; align-items: flex-end; justify-content: space-between;">
              <MinimalInput @on-enter="amount($event)" inputPlaceholder="0" inputType="number" inputWidth="150px" inputHeight="38px" fontSize="12px" inputName="Amount"/>
              <div class="assetNameBox">
                <span v-if="vultureWallet.currentWallet">{{vultureWallet.currentWallet.accountData.network.networkAssetPrefix}}</span>
              </div>
            </div>
            <span v-if="insufficientFunds" style="font-size: 14px;  color: var(--fg_color_2); margin-bottom: 5px;">Insufficient Funds!</span>

        </div>
        <div style="position: absolute; width: 100%; box-sizing: border-box; padding-left: 25px; padding-right: 25px; top: 285px;">
            <DefaultButton :buttonDisabled="!canSend"
            @button-click="sendButton()" buttonText="Send" buttonHeight="40px" buttonWidth="100%"/>
        </div>
    </div>
</template>

<script lang="ts">
import { PropType, ref } from 'vue';
import { VultureWallet } from '@/vulture_backend/wallets/IvultureWallet';

import DefaultButton from "./building_parts/DefaultButton.vue";
import MinimalInput from "./building_parts/MinimalInput.vue";
export default {
  name: "SendTab",
  components: {
    DefaultButton,
    MinimalInput
  },
  props: {
      vultureWallet: {
      type: Object as PropType<VultureWallet>,
      required: true,
    },

  },
  setup(props: any, context: any) {

    let currentAmount = ref(0);

    let insufficientFunds = ref(false);
    let canSend = ref(false);

    let currentAddress = ref('');

    function address(address: string) {
      this.currentAddress = address;
      context.emit('address', this.currentAddress);
    }
    function amount(amount: number) {
      currentAmount.value = amount;
      if(currentAmount.value > (props.vultureWallet as VultureWallet).currentWallet.accountData.freeAmountWhole) {
        canSend.value = false;
        insufficientFunds.value = true;
      } else {
        if(currentAmount.value > 0) {
          canSend.value = true;
          insufficientFunds.value = false;
        }else {
          canSend.value = false;
        }
      }
      context.emit('amount', this.currentAmount);
    }
    function sendButton() {
        context.emit('send-button-click');
    }
    return {
      canSend,
      currentAmount,
      currentAddress,
      insufficientFunds,

      amount: amount,
      address: address,
      sendButton: sendButton,
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.assetNameBox {
  font-size: 20px;
  padding: 8px;

  margin-bottom: 15px;


  border-radius: 0px;

  width: 142px;

  border-bottom-style: solid;
  border-width: 2px;
  border-color: var(--accent_color);
}
.box {
    height: 320px;
    flex-direction: column;
}
</style>
