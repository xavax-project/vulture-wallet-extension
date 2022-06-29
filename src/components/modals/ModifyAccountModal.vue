<template>
    <div class="flexBox" style="height: 100%; width: 100%;">
        <div class="flexBox" style="flex-grow: 1; padding-left: 15px; padding-right: 15px; width: 100%;
        flex-direction: column; align-items: center; margin-top: 30px; box-sizing: border-box; font-size: 18px;
        overflow-wrap: break-word;">

            <DefaultInput :startValue="accountName" @on-enter="setName($event)" inputWidth="100%" inputHeight="40px" fontSize="18px" inputName="Account Name" inputPlaceholder="Name"/>
            <div style="width: 100%; text-align: left; margin-top: 15px;">
                Account Index: <span style="color: var(--accent_color)">{{vultureWallet.accountStore.allAccounts[selectedAccount - 1].accountIndex}}</span>
            <hr>
            </div>
            <div style="width: 100%; text-align: left; margin-top: 20px;">
                Deposit Address ({{vultureWallet.accountStore.currentlySelectedNetwork.networkAssetPrefix}}):
                <span style="color: var(--accent_color); font-size: 15px;">{{vultureWallet.accountStore.allAccounts[selectedAccount - 1].address}}</span> <br>
                <i style="font-size: 13px;  color: var(--fg_color_2)">Address may vary depending on the selected network.</i>
                <hr>
            </div>
        </div>
        <div class="flexBox" style="flex-grow: 0; margin-bottom: 15px; width: 100%; flex-direction: row; align-self: center; justify-content: space-evenly;">
            <DefaultButton buttonHeight="40px" buttonWidth="150px" buttonText="Return" @button-click="quitModal()"/>
            <DefaultButton buttonHeight="40px" buttonWidth="150px" buttonText="Save" @button-click="saveAccount()"/>
        </div>
    </div>
</template>

<script lang="ts">
import DefaultButton from "../building_parts/DefaultButton.vue";
import DefaultInput from "../building_parts/DefaultInput.vue"
import DropdownSelection from "../building_parts/DropdownSelection.vue";
import { VultureWallet, createNewAccount, WalletType, DefaultNetworks} from "../../vulture_backend/wallets/vultureWallet";
import { defineComponent, PropType, reactive } from 'vue';

export default defineComponent({
  name: "ModifyAccount",
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
    selectedAccount: Number
  },
  setup(props, context) {


    let accountName: string = props.vultureWallet.accountStore.allAccounts[props.selectedAccount! - 1].accountName;
    const networks = new DefaultNetworks();
    let initialNetwork = props.vultureWallet.accountStore.currentlySelectedNetwork;

    function quitModal() {
        context.emit("quit-modal");
    }
    function setName(name: string) {
        accountName = name;
        props.vultureWallet.accountStore.allAccounts[props.selectedAccount! - 1].accountName = accountName;
    }
    function saveAccount() {

        props.vultureWallet.saveAccounts();
        quitModal();
    }

    

    return {
        accountName,
        networks,

        quitModal: quitModal,
        setName: setName,
        saveAccount: saveAccount,
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
</style>
