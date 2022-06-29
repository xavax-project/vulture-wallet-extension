<template>

    <!-- (new modal system will fix this clusterfk, don't worry). -->
    <div class="flexBox" style="height: 100%; width: 100%;">
        
        <!--  ERC20   -->
        <div class="flexBox" style="flex-grow: 1; padding-left: 15px; padding-right: 15px; width: 100%;
        flex-direction: column; align-items: center; margin-top: 30px; box-sizing: border-box; font-size: 18px;
        overflow-wrap: break-word;"
         v-if="vultureWallet.tokenStore != null && vultureWallet.tokenStore.tokenList.get(vultureWallet.accountStore.currentlySelectedNetwork.networkUri)?.length > 0
         && tokenType == 'ERC20'">

            <div style="width: 100%; margin-bottom: 5px;">
                <div style="font-size: 26px;">Token: 
                    {{token.name}}
                </div>
                <hr>
            </div>
                <div style="width: 100%; text-align: left; margin-top: 15px; font-size: 22px;">
                    Account
                    "<span style="color: var(--accent_color)">
                        {{vultureWallet.currentWallet.accountData.accountName}}
                    </span>"
                    <br>
                    Has
                    
                    <span style="color: var(--accent_color);"> 
                        {{token.balance}}
                    </span>

                    <span style="font-size: 16px; color: var(--accent_color);">
                        {{token.symbol}}
                    </span>
                    <br>
                    On
                    <span style="color: var(--accent_color);">
                        {{vultureWallet.accountStore.currentlySelectedNetwork.networkName}}
                    </span>
                </div>

                <div style="width: 100%; text-align: left; margin-top: 20px; font-size: 22px;">
                    Token Address:
                    <span style="color: var(--accent_color); font-size: 15px;">
                        {{token.address}}
                    </span>
                    <br>
                    <hr style="margin-top: 20px;">
                </div>
                <div style="display: flex; flex-direction: column; width: 100%; text-align: center; margin-top: 20px; align-items: center;">
                   <hr class="red" style="width: 100%; margin-bottom: 10px;">
                    <DefaultButton buttonHeight="25px" buttonWidth="150px" fontSize="17px" buttonText="Remove From List" @button-click="removeTokenFromList()"/>
                    <i style="font-size: 13px;  color: var(--fg_color_2); margin-top: 10px; margin-bottom: 5px;" >
                        Remove this token from token list. You will have to<br> re-add it to see it again in the wallet.
                    </i>
                    <hr class="red" style="width: 100%;">
                </div>

        </div>

        <!--    ERC721    -->
        <div class="flexBox" style="flex-grow: 1; padding-left: 15px; padding-right: 15px; width: 100%;
        flex-direction: column; align-items: center; margin-top: 30px; box-sizing: border-box; font-size: 18px;
        overflow-wrap: break-word;"
         v-if="vultureWallet.tokenStore != null && vultureWallet.tokenStore.NFTList.get(vultureWallet.accountStore.currentlySelectedNetwork.networkUri)?.length > 0
         && tokenType == 'ERC721'">

            <div style="width: 100%; margin-bottom: 5px;">
                <div style="font-size: 26px;">
                    {{token.name}}
                </div>
                <hr>
            </div>
                <div style="width: 100%; text-align: left; margin-top: 15px; font-size: 22px;">
                    Account
                    "<span style="color: var(--accent_color)">
                        {{vultureWallet.currentWallet.accountData.accountName}}
                    </span>"
                    <br>
                    Has
                    
                    <span style="color: var(--accent_color);"> 
                        {{token.balance}}
                    </span>

                    <span style="color: var(--accent_color);">
                        &nbsp;{{token.symbol}}
                    </span>
                    <br>
                    On
                    <span style="color: var(--accent_color);">
                        {{vultureWallet.accountStore.currentlySelectedNetwork.networkName}}
                    </span>
                </div>

                <div style="width: 100%; text-align: left; margin-top: 20px; font-size: 22px;">
                    Token Address:
                    <span style="color: var(--accent_color); font-size: 15px;">
                        {{token.address}}
                    </span>
                        {{token.metadataURI}}
                    <br>
                    <hr style="margin-top: 20px;">
                </div>
                <div style="display: flex; flex-direction: column; width: 100%; text-align: center; margin-top: 20px; align-items: center;">
                   <hr class="red" style="width: 100%; margin-bottom: 10px;">
                    <DefaultButton buttonHeight="25px" buttonWidth="150px" fontSize="17px" buttonText="Remove From List" @button-click="removeTokenFromList()"/>
                    <i style="font-size: 13px;  color: var(--fg_color_2); margin-top: 10px; margin-bottom: 5px;" >
                        Remove this token from token list. You will have to<br> re-add it to see it again in the wallet.
                    </i>
                    <hr class="red" style="width: 100%;">
                </div>

        </div>

        <div class="flexBox" style="flex-grow: 0; margin-bottom: 15px; width: 100%; flex-direction: row; align-self: center; justify-content: space-evenly;">
            <DefaultButton buttonHeight="40px" buttonWidth="150px" buttonText="Return" @button-click="quitModal()"/>
            <!--
            <DefaultButton buttonHeight="40px" buttonWidth="150px" buttonText="Save" @button-click="saveAccount()"/>
            -->
        </div>
    </div>
</template>

<script lang="ts">
import DefaultButton from "../building_parts/DefaultButton.vue";
import DefaultInput from "../building_parts/DefaultInput.vue"
import DropdownSelection from "../building_parts/DropdownSelection.vue";
import { VultureWallet, createNewAccount, WalletType, DefaultNetworks} from "../../vulture_backend/wallets/vultureWallet";
import { defineComponent, PropType, reactive } from 'vue';
import { AbstractToken } from '@/vulture_backend/types/abstractToken';

export default defineComponent({
  name: "TokenViewModal",
  components: {
    DropdownSelection,
    DefaultButton,
    DefaultInput,
  },
  props: {
    vultureWallet: {
        type: Object as PropType<VultureWallet>,
        required: true,
    },
    arrayIndexOfToken: Number,
    tokenType: String,
  },
  setup(props, context) {

    let token: AbstractToken = reactive({
      address: '',
      decimals: 0,
      name: '!Error!',
      symbol: '',
      logoURI: '',
      balance: '0'
    });

    switch(props.tokenType) {
        case "ERC20": {
            token = props.vultureWallet.tokenStore.tokenList.get(props.vultureWallet.accountStore.currentlySelectedNetwork.networkUri)![props.arrayIndexOfToken!]
            break;
        }
        case "ERC721": {
            token = props.vultureWallet.tokenStore.NFTList.get(props.vultureWallet.accountStore.currentlySelectedNetwork.networkUri)![props.arrayIndexOfToken!];
            break;
        }
        default: {
            console.log("Token Type: " + props.tokenType + " is not available!");
        }
    }

    function quitModal() {
        context.emit("quit-modal");
    }
    function removeTokenFromList() {
        (props.vultureWallet as VultureWallet).removeTokenFromList(props.arrayIndexOfToken!, props.tokenType!);
        context.emit("reset-selected-token");
        quitModal();
    }

    

    return {
        quitModal: quitModal,
        removeTokenFromList: removeTokenFromList,
        token: token,
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
.red {
    background-color: var(--incorrect_color);
    box-shadow: 0px 0px 4px var(--incorrect_color);
}
</style>
