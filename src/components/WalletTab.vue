
<template>
    <div class="flexBox box">
        <div style="position: absolute; width: 100%; box-sizing: border-box; padding-left: 25px; padding-right: 25px; top: 285px;">
            <DefaultButton
            @button-click="test()" buttonText="Test Tx (look in console)" buttonHeight="40px" buttonWidth="100%"/>
        </div>
    </div>
</template>

<script lang="ts">
import { PropType, reactive, ref } from 'vue';
import { VultureWallet } from '@/vulture_backend/wallets/IvultureWallet';

import DefaultButton from "./building_parts/DefaultButton.vue";
import MinimalInput from "./building_parts/MinimalInput.vue";
import { VultureMessage } from '@/vulture_backend/vultureMessage';


export default {
  name: "WalletTab",
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
    function test() {
        (props.vultureWallet as VultureWallet).test();
    }
    return {
        test: test
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
