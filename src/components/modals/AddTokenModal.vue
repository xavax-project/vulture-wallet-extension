<template>

    <!-- TODO: seperate NFTs and ERC20 to seperate components. The modal system needs a bit of refactoring clearly -->

    <!---------------------------------- TOKEN BOX ---------------------------------->
    <div class="flexBox" style="height: 100%; width: 100%;">
        <div class="flexBox" style="flex-grow: 1; padding-left: 8px; padding-right: 8px; width: 100%;
        flex-direction: column; align-items: center; margin-top: 30px; box-sizing: border-box; font-size: 18px;
        overflow-wrap: break-word" v-if="tokenTypeToAdd == 'ERC20'">
            <DefaultInput @on-enter="setAddress($event)" inputWidth="315px" inputHeight="40px" fontSize="15px" inputName="Token Address" inputPlaceholder="Enter Token Address"/>
            
            <div class="outline" style=" text-align: left; font-size: 18px; height: auto; text-align: center; width: 90%;">
                <div v-if="tokenDiscoveryStatus == 'EnterAddress'">    
                    Please enter a Token Address.
                    Only add tokens that you've
                    <span style="color: var(--accent_color); text-shadow: 0px 0px 5px var(--accent_color); ">
                    verified.
                    </span>
                </div>

                <div v-if="tokenDiscoveryStatus == 'InvalidAddress'">    
                    The token address entered is Invalid! <br>
                    <span style="color: rgb(255, 0, 65); font-size: 16px; text-shadow: 0px 0px 5px rgb(255, 0, 65); ">
                    Please fix (╬ Ò﹏Ó)
                    </span>
                </div>

                <div v-if="tokenDiscoveryStatus == 'InvalidToken'" class="flexBox" style="width: 100%; flex-direction: column; width: 100%; align-items: center;">    
                    <span style="color: rgb(255, 0, 65); text-shadow: 0px 0px 5px rgb(255, 0, 65); margin-bottom: 5px;">
                    Error: <span style="color: var(--fg_color); text-shadow: 0px 0px 0px;"> {{error}} </span>
                    </span>
                    <hr>
                    <div style="display: flex; flex-direction: column; width: 100%; margin-top: 5px; margin-bottom: 5px;">
                    Maybe try a different one?
                        <div style="color: rgb(0, 180, 255); text-shadow: 0px 0px 7px rgb(0, 180, 255); font-size: 15px;">
                            (╥﹏╥)
                        </div>
                    </div>
                </div>

                <div class="flexBox" style="width: 100%;" v-if="tokenDiscoveryStatus == 'TokenFound'">
                    <div style="width: 100%; text-align: left; margin-top: 15px;">
                        Name: <span style="color: var(--accent_color)">{{currentToken.name}}</span>
                        [<span style="font-size: 14px; color: var(--accent_color);"> ${{currentToken.symbol}}</span> ]
                        <hr>
                    </div>
                    <div style="width: 100%; text-align: left; margin-top: 15px;">
                        Your Balance: <span style="color: var(--accent_color)">{{currentToken.balance}}</span> 
                        <hr>
                    </div>
                    <div style="width: 100%; text-align: left; margin-top: 15px;">
                        Supply: <span style="color: var(--accent_color)">{{currentToken.totalSupply}}</span> <br>
                        <i style="font-size: 13px;  color: var(--fg_color_2)">Total supply of the Token.</i>
                        <hr>
                    </div>
                    <div  style="width: 100%; text-align: left; margin-top: 20px;">
                        Address: <span style="color: var(--accent_color); font-size: 15px;">{{currentToken.address}}</span> <br>
                        <i style="font-size: 13px;  color: var(--fg_color_2)">Unique Address of the Token.</i>
                        <hr>
                    </div>
                </div>

                <div class="vultureLoader" v-if="showLoader == true"></div>
            </div>
        </div>

        <!---------------------------------- NFT BOX ---------------------------------->
        <div class="flexBox" style="flex-grow: 1; padding-left: 8px; padding-right: 8px; width: 100%;
        flex-direction: column; align-items: center; margin-top: 30px; box-sizing: border-box; font-size: 18px;
        overflow-wrap: break-word" v-if="tokenTypeToAdd == 'ERC721'">
            <DefaultInput @on-enter="setAddress($event)" inputWidth="315px" inputHeight="40px" fontSize="15px" inputName="NFT Address" inputPlaceholder="Enter NFT Address"/>
            
            <div class="outline" style=" text-align: left; font-size: 18px; height: auto; text-align: center; width: 90%;">
                <div v-if="tokenDiscoveryStatus == 'EnterAddress'">    
                    Please enter an NFT address.
                    Only add tokens that you've 
                    <span style="color: var(--accent_color); text-shadow: 0px 0px 5px var(--accent_color); ">
                    verified.
                    </span>
                </div>

                <div v-if="tokenDiscoveryStatus == 'InvalidAddress'">    
                    The token address entered is Invalid! <br>
                    <span style="color: rgb(255, 0, 65); font-size: 16px; text-shadow: 0px 0px 5px rgb(255, 0, 65); ">
                    Please fix (╬ Ò﹏Ó)
                    </span>
                </div>

                <div v-if="tokenDiscoveryStatus == 'InvalidToken'" class="flexBox" style="width: 100%; flex-direction: column; width: 100%; align-items: center;">    
                    <span style="color: rgb(255, 0, 65); text-shadow: 0px 0px 5px rgb(255, 0, 65); margin-bottom: 5px;">
                    Error: <span style="color: var(--fg_color); text-shadow: 0px 0px 0px;"> {{error}} </span>
                    </span>
                    <hr>
                    <div style="display: flex; flex-direction: column; width: 100%; margin-top: 5px; margin-bottom: 5px;">
                    Maybe try a different one?
                        <div style="color: rgb(0, 180, 255); text-shadow: 0px 0px 7px rgb(0, 180, 255); font-size: 15px;">
                            (╥﹏╥)
                        </div>
                    </div>
                </div>

                <div class="flexBox" style="width: 100%;" v-if="tokenDiscoveryStatus == 'TokenFound'">
                    <div style="width: 100%; text-align: left; margin-top: 15px;">
                        Name: <span style="color: var(--accent_color)">{{currentToken.name}}</span>
                        [<span style="font-size: 14px; color: var(--accent_color);"> ${{currentToken.symbol}}</span> ]
                        <hr>
                    </div>
                    <div style="width: 100%; text-align: left; margin-top: 15px;">
                        This account has: <span style="color: var(--accent_color)">{{currentToken.balance}}</span>
                        <span style="font-size: 14px; color: var(--accent_color);"> ${{currentToken.symbol}}</span> NFTs
                        <hr>
                    </div>
                    <div style="width: 100%; text-align: left; margin-top: 15px;">
                        Total Supply: <span style="color: var(--accent_color)">{{currentToken.totalSupply}}</span> <br>
                        <i style="font-size: 13px;  color: var(--fg_color_2)">Total supply of the NFT collection.</i>
                        <hr>
                    </div>
                    <div  style="width: 100%; text-align: left; margin-top: 20px;">
                        Address: <span style="color: var(--accent_color); font-size: 15px;">{{currentToken.address}}</span> <br>
                        <i style="font-size: 13px;  color: var(--fg_color_2)">Unique Address of the Token.</i>
                        <hr>
                    </div>
                </div>

                <div class="vultureLoader" v-if="showLoader == true"></div>
            </div>

        </div>

        

        <div class="flexBox" style="flex-grow: 0; margin-bottom: 15px; width: 100%; flex-direction: row; align-self: center; justify-content: space-evenly;">
            <DefaultButton buttonHeight="40px" buttonWidth="150px" buttonText="Return" @button-click="quitModal()"/>
            <span v-if="tokenDiscoveryStatus == 'TokenFound'">
                <DefaultButton buttonHeight="40px" buttonWidth="150px" buttonText="Add" @button-click="addToken()"/>
           </span>
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
import { defineComponent, PropType, reactive, ref, Ref } from 'vue';

export default defineComponent({
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
    tokenTypeToAdd: String,
  },
  setup(props, context) {
    let currentAddress = ref("");
    let tokenDiscoveryStatus = ref("EnterAddress");
    
    let showLoader = ref(false);

    let token: AbstractToken = {
      network: new DefaultNetworks().AlephZero,
      address: '',
      decimals: 0,
      balance: '0',
      name: '',
      symbol: '',
      logoURI: '',
      metadataURI: undefined
    };
    let error = ref("");
    let currentToken = ref(token);

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
        props.vultureWallet.currentWallet.accountEvents.once(VultureMessage.IS_ADDRESS_VALID, (isValid) => {
            if(isValid == true) {
                tokenDiscoveryStatus.value = "Loading";
                showLoader.value = true;
                
                //Get the token information and display it if the address matches a token.
                props.vultureWallet.currentWallet.accountEvents.once(VultureMessage.GET_TOKEN_DATA, (data) => {
                    if(data.params.success == true) {
                        tokenDiscoveryStatus.value = "TokenFound";
                        showLoader.value = false;
                        let selectedToken: AbstractToken = {
                          network: props.vultureWallet.accountStore.currentlySelectedNetwork,
                          address: address,
                          decimals: props.vultureWallet.accountStore.currentlySelectedNetwork.networkAssetDecimals, //this is temporary for now...
                          name: data.params.tokenData.name,
                          totalSupply: data.params.tokenData.totalSupply,
                          symbol: data.params.tokenData.symbol,
                          logoURI: data.params.tokenData.logoURI,
                          balance: data.params.tokenData.balance,
                          metadataURI: data.params.tokenData.metadataURI,
                        }
                        currentToken.value = selectedToken;
                        // set currentToken.token to the token, 
                    }else {
                        showLoader.value = false;
                        tokenDiscoveryStatus.value = "InvalidToken";
                        error.value = data.params.error;
                    }
                });
                props.vultureWallet.currentWallet.getTokenInformation(address, props.tokenTypeToAdd!);
                
            }else {
                tokenDiscoveryStatus.value = "InvalidAddress";
                showLoader.value = false;
            }
        });
        props.vultureWallet.currentWallet.isAddressValid(currentAddress.value);
    }
    function addToken() {
        if(tokenDiscoveryStatus.value == "TokenFound") {
            props.vultureWallet.addTokenToList(currentToken.value, props.tokenTypeToAdd!);
        }
        quitModal();
    }
    return {
        tokenDiscoveryStatus,
        showLoader,
        currentToken,
        error,

        quitModal: quitModal,
        setAddress: setAddress,
        addToken: addToken,
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
hr {
    margin-top: 5px;
    margin-bottom: 5px;
    width: 100%;
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

    max-height: 346px;
    
    overflow: hidden;
    overflow-y: auto;
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
