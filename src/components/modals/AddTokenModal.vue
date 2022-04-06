<template>
    <div class="flexBox" style="height: 100%; width: 100%;">
        <div class="flexBox" style="flex-grow: 1; padding-left: 8px; padding-right: 8px; width: 100%;
        flex-direction: column; align-items: center; margin-top: 30px; box-sizing: border-box; font-size: 18px;
        overflow-wrap: break-word;">
            <DefaultInput @on-enter="setAddress($event)" inputWidth="100%" inputHeight="40px" fontSize="18px" inputName="Token Address" inputPlaceholder="Address"/>
            
            <div class="outline" style=" text-align: left; font-size: 18px; height: auto; text-align: center; width: 90%;">
                <div v-if="tokenDiscoveryStatus == 'EnterAddress'">    
                    Please enter a Token Address to add a token Manually. <br> <br>
                    Only add tokens you 
                    <span style="color: var(--accent_color); text-shadow: 0px 0px 5px var(--accent_color); ">
                    trust.
                    </span>
                </div>

                <div v-if="tokenDiscoveryStatus == 'InvalidAddress'">    
                    The token address entered is Invalid! <br>
                    <span style="color: rgb(255, 0, 65); font-size: 16px; text-shadow: 0px 0px 5px rgb(255, 0, 65); ">
                    Please fix (╬ Ò﹏Ó)
                    </span>
                </div>

                <div class="vultureLoader" v-if="showLoader == true"></div>

                <div v-if="tokenDiscoveryStatus == 'AddToken'" style="display: flex; margin-top: 70px; margin-bottom: 0px;">
                    <DefaultButton buttonHeight="40px" buttonWidth="150px" buttonText="Reset" @button-click="resetWallet()"/>
                </div>
            </div>

        </div>

        

        <div class="flexBox" style="flex-grow: 0; margin-bottom: 15px; width: 100%; flex-direction: row; align-self: center; justify-content: space-evenly;">
            <DefaultButton buttonHeight="40px" buttonWidth="150px" buttonText="Return" @button-click="quitModal()"/>
            <!--

            <DefaultButton buttonHeight="40px" buttonWidth="150px" buttonText="Add" @button-click="addToken()"/>
            -->
        </div>
            
    </div>
</template>

<script lang="ts">
import DefaultButton from "../building_parts/DefaultButton.vue";
import DefaultInput from "../building_parts/DefaultInput.vue"
import DropdownSelection from "../building_parts/DropdownSelection.vue";
import { VultureWallet, createNewAccount, WalletType, DefaultNetworks} from "../../vulture_backend/wallets/vultureWallet";
import { AbstractToken } from "../../vulture_backend/types/abstractToken";
import { VultureMessage } from "../../vulture_backend/vultureMessage";
import { PropType, reactive, ref, Ref } from 'vue';

export default {
  name: "AddTokenModal",
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
  },
  setup(props: any, context: any) {
    let currentAddress = ref("");
    let tokenDiscoveryStatus = ref("EnterAddress");
    
    let showLoader = ref(false);

    let token: AbstractToken | null = null;
    let currentToken = ref({token: token})

    function quitModal() {
        context.emit("quit-modal");
    }
    function setAddress(address: string) {
        currentAddress.value = address;
        if(currentAddress.value == "") {
            tokenDiscoveryStatus.value = "EnterAddress";
            showLoader.value = false;
            return;
        }
        (props.vultureWallet as VultureWallet).currentWallet.accountEvents.once(VultureMessage.IS_ADDRESS_VALID, (isValid) => {
            if(isValid == true) {
                tokenDiscoveryStatus.value = "Loading";
                showLoader.value = true;
                
                //Get the token information and display it if the address matches a token.
                (props.vultureWallet as VultureWallet).currentWallet.accountEvents.once(VultureMessage.GET_TOKEN_DATA, (tokenData) => {
                    if(tokenData.success == true) {
                        tokenDiscoveryStatus.value = "TokenFound";
                        showLoader.value = false;
                        // set currentToken.token to the token, 
                    }
                });
                (props.vultureWallet as VultureWallet).currentWallet.getTokenInformation(address, "ERC20");
                
            }else {
                tokenDiscoveryStatus.value = "InvalidAddress";
                showLoader.value = false;
            }
        });
        (props.vultureWallet as VultureWallet).currentWallet.isAddressValid(currentAddress.value);
    }
    function addToken() {
        
    }
    return {
        tokenDiscoveryStatus,
        showLoader,

        quitModal: quitModal,
        setAddress: setAddress,
        addToken: addToken
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

.outline {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 12px;
    border-width: 1px;
    border-style: solid;
    border-color: var(--bg_color_2);
    padding: 12px;
    margin: 10px;
    margin-top: 0px;
    
    overflow: hidden;
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
