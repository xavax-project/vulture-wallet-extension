
<template>
    <div class="flexBox box">
        <div class="flexBox" style="position: absolute; width: 100%; box-sizing: border-box; padding-left: 20px; padding-right: 20px; top: 20px; align-items: center;" :key="updateKey">
            <MinimalInput @on-enter="address($event)" inputPlaceholder="Address" inputWidth="315px" inputHeight="38px" fontSize="12px" inputName="Recipent Address"/>
            <div class="flexBox" style="width: 100%; flex-direction: row; align-items: flex-end; justify-content: space-between;">
              <MinimalInput @on-enter="amount($event)" inputPlaceholder="0" inputType="number" inputWidth="150px" inputHeight="38px" fontSize="12px" inputName="Amount"/>
              <div class="assetBox">
                <span v-if="vultureWallet.currentWallet">{{vultureWallet.accountStore.currentlySelectedNetwork.networkAssetPrefix}}</span>
                <span style="font-family: fonticonA; font-size: 18px;"> &#xf142;</span>
              </div>
            </div>
            
            <span v-if="insufficientFunds" style="font-size: 14px;  color: var(--fg_color_2); margin-bottom: 5px;">Insufficient Funds!</span>
            <span v-if="invalidAddress && currentAddress != ''" style="font-size: 14px;  color: var(--fg_color_2); margin-bottom: 5px;">Invalid Recipent Address!</span>
            <span v-if="canSend()" style="font-size: 14px;  color: var(--fg_color_2); margin-bottom: 5px;">Estimated Fee: <span style="color: var(--accent_color">{{ estimatedFee.toFixed(7) }}</span></span>

        </div>
        <div style="position: absolute; width: 100%; box-sizing: border-box; padding-left: 25px; padding-right: 25px; top: 285px;">
            <DefaultButton :buttonDisabled="!canSend()"
            @button-click="sendButton()" buttonText="Send" buttonHeight="40px" buttonWidth="100%"/>
        </div>
    </div>
</template>

<script lang="ts">
import { PropType, reactive, ref } from 'vue';
import { VultureWallet } from '@/vulture_backend/wallets/vultureWallet';

import DefaultButton from "./building_parts/DefaultButton.vue";
import MinimalInput from "./building_parts/MinimalInput.vue";
import { VultureMessage } from '@/vulture_backend/vultureMessage';
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

    let updateKey = ref(0);

    let currentAmount = ref(0);

    let currentAddress = ref('');

    let estimatedFee = ref(0);

    let insufficientFunds = ref(false);
    let invalidAddress = ref(true);

    function address(address: string) {
      currentAddress.value = address;
      (props.vultureWallet as VultureWallet).currentWallet.accountEvents.once(VultureMessage.IS_ADDRESS_VALID, (isValid) => {
          if(isValid) {
            invalidAddress.value = false;
          } else {
            invalidAddress.value = true;
          }
      });
      (props.vultureWallet as VultureWallet).currentWallet.isAddressValid(currentAddress.value);
    }
    
    function amount(amount: number) {
      currentAmount.value = amount;
      (props.vultureWallet as VultureWallet).currentWallet.accountEvents.once(VultureMessage.ESTIMATE_TX_FEE, (fee) => {
        estimatedFee.value = fee;
        if((currentAmount.value + fee) < (props.vultureWallet as VultureWallet).currentWallet.accountData.freeAmountWhole) {
          insufficientFunds.value = false;
        }else {
          insufficientFunds.value = true;
        }
      });
      if(invalidAddress.value == false) {
        (props.vultureWallet as VultureWallet).currentWallet.estimateTxFee(currentAddress.value, currentAmount.value);
      }
    }
    function sendButton() {
      context.emit('send-button-click', {amount: currentAmount.value, recipent: currentAddress.value});
      amount(0);
      updateKey.value++;
    }
    function canSend() {
      if(insufficientFunds.value == false && invalidAddress.value == false && currentAmount.value > 0) {
        return true;
      }
      return false;
    }
    return {
      insufficientFunds,
      currentAddress,
      invalidAddress,
      currentAmount,
      estimatedFee,

      updateKey,

      canSend: canSend,
      amount: amount,
      address: address,
      sendButton: sendButton,
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.assetBox {
  font-size: 20px;
  padding: 8px;

  margin-bottom: 15px;


  border-radius: 0px;

  width: 142px;

  border-bottom-style: solid;
  border-width: 2px;
  border-color: var(--accent_color);
  user-select: none;

  cursor: pointer;

  transition-duration: 125ms;
}
.assetBox:hover {
  text-shadow: 0px 0px 5px var(--accent_color);
  color: var(--accent_color);

  transition-duration: 125ms;
}
.assetBox:active {
  filter: brightness(70%);
}
.box {
    height: 320px;
    flex-direction: column;
}
</style>
