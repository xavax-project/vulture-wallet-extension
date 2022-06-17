
<template>
    <div class="flexBox box">
        <div class="flexBox" style="position: absolute; width: 100%; box-sizing: border-box; padding-left: 20px; padding-right: 20px; top: 20px; align-items: center;" :key="updateKey">
            <MinimalInput @on-enter="address($event)" inputPlaceholder="Address" inputWidth="315px" inputHeight="38px" fontSize="12px" inputName="Recipent Address"/>
            <div class="flexBox" style="width: 100%; flex-direction: row; align-items: flex-end; justify-content: space-between;">
              <MinimalInput @on-enter="amount($event)" inputPlaceholder="0" inputType="number" inputWidth="147px" inputHeight="38px" fontSize="16px" inputName="Amount"/>
            <div v-if="vultureWallet.accountStore != null && vultureWallet.accountStore.currentlySelectedNetwork != null">
              <div class="inputName">Asset</div>

              <div @click="selectAsset()" class="assetBox clickyAssetBox" v-if=" vultureWallet.accountStore.currentlySelectedNetwork.smartContractCapable != null &&
              vultureWallet.accountStore.currentlySelectedNetwork.smartContractCapable == true">

                <!-- display info about Native asset, since that's whats selected if selectedTokenArrayIndex is -1 -->
                <span v-if="vultureWallet.currentWallet && selectedTokenArrayIndex == -1">{{vultureWallet.accountStore.currentlySelectedNetwork.networkAssetPrefix}}</span>
                <!-- display info about the selected token, since that's whats selected if selectedTokenArrayIndex is >=0 -->
                <span v-if="vultureWallet.currentWallet && selectedTokenArrayIndex >= 0 &&
                  vultureWallet.tokenStore != null &&
                  vultureWallet.tokenStore.tokenList.get(vultureWallet.accountStore.currentlySelectedNetwork.networkUri)?.length > 0">                  
                  {{vultureWallet.tokenStore.tokenList.get(vultureWallet.accountStore.currentlySelectedNetwork.networkUri)[selectedTokenArrayIndex].symbol}}
                </span>
                <span style="font-family: fonticonA; font-size: 18px;"> &#xf044;</span>
              </div>
              <div v-else>
                <div class="assetBox">
                  {{vultureWallet.accountStore.currentlySelectedNetwork.networkAssetPrefix}}
                </div>
              </div>

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
import { AbstractToken } from '@/vulture_backend/types/abstractToken';
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
    selectedTokenArrayIndex: Number, // -1 is native, [0..n] is a non-native token.
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

        if(props.selectedTokenArrayIndex == -1) {
          if((currentAmount.value + fee) < (props.vultureWallet as VultureWallet).currentWallet.accountData.freeAmountWhole) {
            insufficientFunds.value = false;
          }else {
            insufficientFunds.value = true;
          }
        }else {
                    let tokenArray = (props.vultureWallet as VultureWallet).tokenStore.tokenList.get((props.vultureWallet as VultureWallet).accountStore.currentlySelectedNetwork.networkUri);
          if(tokenArray != undefined) {
            if((tokenArray as AbstractToken[])[props.selectedTokenArrayIndex] != null) {
              console.log((tokenArray as AbstractToken[])[props.selectedTokenArrayIndex].balance);
              if(currentAmount.value < Number((tokenArray as AbstractToken[])[props.selectedTokenArrayIndex].balance)) {
              insufficientFunds.value = false;
              }else {
                insufficientFunds.value = true;
              }
            }else {
              console.error("Token not found!");
            }
          }
        }

      });
      if(invalidAddress.value == false) {
        // If we are sending native assets.
        if(props.selectedTokenArrayIndex == -1) {
          (props.vultureWallet as VultureWallet).currentWallet.estimateTxFee(currentAddress.value, currentAmount.value);
        }else{
        // If we are sending some token. This is quite messy, will have to refactor to something easier on the eyes later.
          let tokenArray = (props.vultureWallet as VultureWallet).tokenStore.tokenList.get((props.vultureWallet as VultureWallet).accountStore.currentlySelectedNetwork.networkUri);
          if(tokenArray != undefined) {
            if((tokenArray as AbstractToken[])[props.selectedTokenArrayIndex] != null) {
              (props.vultureWallet as VultureWallet).currentWallet.estimateTxFee(currentAddress.value, currentAmount.value, (tokenArray as AbstractToken[])[props.selectedTokenArrayIndex]);
            }else {
              console.error("Token not found!");
            }
          }
        }
      }
    }
    function sendButton() {
      context.emit('send-button-click', {amount: currentAmount.value, recipent: currentAddress.value, tokenArrayIndex: props.selectedTokenArrayIndex});
      amount(0);
      updateKey.value++;
    }
    function canSend() {
      if(insufficientFunds.value == false && invalidAddress.value == false && currentAmount.value > 0) {
        return true;
      }
      return false;
    }
    function selectAsset() {
      context.emit("select-new-asset");
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
      selectAsset: selectAsset,
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

  width: 135px;

  user-select: none;

  border-color: var(--bg_color_2);
  border-width: 2px;
  border-style: solid;
  border-bottom-color: var(--accent_color);
  border-bottom-width: 2px;
  border-radius: 10px;
}
.clickyAssetBox {
  cursor: pointer;
  transition-duration: 125ms;
  border-radius: 0px;

  width: 135px;

  border-color: var(--bg_color_2);
  border-width: 2px;
  border-style: solid;
  border-bottom-color: var(--accent_color);
  border-bottom-width: 2px;
  border-radius: 10px;
}
.inputName {
  text-align: left;
  font-size: 14px;
  margin: 5px;
  color: var(--fg_color_2);
}
.clickyAssetBox:hover {
  text-shadow: 0px 0px 5px var(--accent_color);
  color: var(--accent_color);

  transition-duration: 125ms;
}
.clickyAssetBox:active {
  filter: brightness(70%);
}
.box {
    height: 320px;
    flex-direction: column;
}
</style>
