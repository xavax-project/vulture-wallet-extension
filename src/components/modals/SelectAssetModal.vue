<template>
    <div class="flexBox" style="height: 100%; width: 100%;">
        <div class="flexBox" style="flex-grow: 1; padding-left: 8px; padding-right: 8px; width: 100%;
        flex-direction: column; align-items: center; margin-top: 30px; box-sizing: border-box; font-size: 18px;
        overflow-wrap: break-word">
            <div style="width: 100%; margin-bottom: 5px;">
                <div style="font-size: 26px;">Select Asset</div>
                <hr>
            </div>
            <div class="outline" style=" text-align: left; font-size: 18px; height: auto; text-align: center; width: 90%;">
                <div class="flexBox"  v-if="vultureWallet.tokenStore != null &&
                vultureWallet.tokenStore.tokenList.get(vultureWallet.accountStore.currentlySelectedNetwork.networkUri)?.length > 0"
                style="align-items: center;">
                  <div style="margin-top: 10px; margin-bottom: 5px; font-size: 15px;">
                    <span style="color: var(--accent_color);">{{vultureWallet.tokenStore.tokenList.get(vultureWallet.accountStore.currentlySelectedNetwork.networkUri)?.length}}</span> tokens
                  </div>
                  <span v-for="(token, index) in vultureWallet.tokenStore.tokenList.get(vultureWallet.accountStore.currentlySelectedNetwork.networkUri)" v-bind:key="token">
                    <TokenModule :token="token" :tokenIndex="index" :selected="index == selectedTokenArrayIndex ? true : false"
                    @module-click="selectToken($event, 'ERC20')"/>
                  </span>
                    <DefaultButton @button-click="selectToken(-1)" :buttonText="'Select \'' + vultureWallet.accountStore.currentlySelectedNetwork.networkAssetPrefix + '\''"
                    buttonHeight="35px"  buttonWidth="154px" fontSize="18px" style="margin-bottom: 15px; margin-top: 10px;"/>
                </div>
            </div>
        </div>

        <div class="flexBox" style="flex-grow: 0; margin-bottom: 15px; width: 100%; flex-direction: row; align-self: center; justify-content: space-evenly;">
            <DefaultButton buttonHeight="40px" buttonWidth="154px" buttonText="Return" @button-click="quitModal()"/>
        </div>
            
    </div>
</template>

<script lang="ts">
import DefaultButton from "../building_parts/DefaultButton.vue";
import DefaultInput from "../building_parts/DefaultInput.vue"
import DropdownSelection from "../building_parts/DropdownSelection.vue";
import TokenModule from "../TokenModule.vue";
import { VultureWallet, createNewAccount, WalletType, DefaultNetworks} from "../../vulture_backend/wallets/vultureWallet";
import { AbstractToken } from "../../vulture_backend/types/abstractToken";
import { VultureMessage } from "../../vulture_backend/vultureMessage";
import { defineComponent, PropType, reactive, ref, Ref } from 'vue';

export default defineComponent({
  name: "SelectTokenModal",
  components: {
    DropdownSelection,
    DefaultButton,
    DefaultInput,
    TokenModule,
  },
  props: {
    vultureWallet: {
        type: Object as PropType<VultureWallet>,
        required: true,
    },
    selectedTokenArrayIndex: Number
  },
  setup(props, context) {

    function quitModal() {
        context.emit("quit-modal");
    }
    function selectToken(arrayIndexOfToken: number) {
        context.emit("select-token", arrayIndexOfToken);
        quitModal();
    }
    return {
        quitModal: quitModal,
        selectToken: selectToken,
    }
  }
});
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

.outline {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 12px;
    border-width: 1px;
    border-style: solid;
    border-color: var(--bg_color_2);
    padding: 12px;
    padding-top: 5px;
    padding-bottom: 5px;
    margin: 10px;
    margin-top: 0px;

    flex-wrap: wrap;

    min-height: 380px;
    max-height: 380px;
    
    overflow: hidden;
    overflow-y: scroll;

    border-radius: 4px;
}

.vultureLogo {
    fill: var(--bg_color);
    filter: drop-shadow(0px 0px 5px rgb(2,2,2));
}
.styled {
    color: var(--accent_color);
}
.welcomeText {
    font-size: 16px;
    text-align: center;
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
