<template>
    <div class="flexBox" style="height: 100%; width: 100%;">
        <div class="flexBox" style="flex-grow: 1; padding-left: 15px; padding-right: 15px; width: 100%;
        flex-direction: column; align-items: center; margin-top: 30px; box-sizing: border-box; font-size: 20px;
        overflow-wrap: break-word;">
            
            <div style="width: 100%; text-align: center; margin-bottom: 15px; margin-top: 0px;  font-size: 24px;">
                Transfer Assets<br>
                <hr>
            </div>

            <div style="width: 100%; text-align: left; margin-top: 20px;">
                Recipent: <span style="color: var(--accent_color); font-size: 15px;">{{recipentAddress}}</span> <br>
                <hr>
            </div>

            <div style="width: 100%; text-align: left; margin-top: 20px;">
                Asset: <span style="color: var(--accent_color)">{{amountToSend}} <span style="font-size: 13px;">{{asset}} </span></span> <br>
            </div>

        </div>
        <div class="flexBox" style="flex-grow: 0; margin-bottom: 15px; width: 100%; flex-direction: row; align-self: center; justify-content: space-evenly;">
            <DefaultButton buttonHeight="40px" buttonWidth="150px" buttonText="Return" @button-click="quitModal()"/>
            <DefaultButton buttonHeight="40px" buttonWidth="150px" buttonText="Send" @button-click="quitModal()"/>
        </div>
    </div>
</template>

<script lang="ts">
import DefaultButton from "../building_parts/DefaultButton.vue";
import DefaultInput from "../building_parts/DefaultInput.vue";
import DropdownSelection from "../building_parts/DropdownSelection.vue";
import AccountModule from "../AccountModule.vue"

import { VultureWallet, createNewAccount, WalletType, DefaultNetworks, Network, NetworkType} from "../../vulture_backend/wallets/IvultureWallet";
import { PropType, reactive, ref } from 'vue';

export default {
  name: "TransferAssetsModal",
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
    recipentAddress: String,
    amountToSend: String,
  },
  setup(props: any, context: any) {

    let accountName: string;
    const networks = new DefaultNetworks();

    let asset = ref('');
    asset.value = (props.vultureWallet as VultureWallet).currentWallet.accountData.network.networkAssetPrefix;

    let accountAmount = ref(0);
    accountAmount.value = (props.vultureWallet as VultureWallet).allAccounts.length;
    let selectedNetwork = reactive({network: networks.AlephZero});

    function quitModal() {
        context.emit("quit-modal");
    }


    return {
        asset,
        networks,
        accountAmount,
        selectedNetwork,

        quitModal: quitModal,
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
</style>
