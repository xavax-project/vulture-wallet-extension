<template>
    <div class="flexBox" style="height: 100%; width: 100%;">
        <div class="flexBox" style="flex-grow: 1; padding-left: 15px; padding-right: 15px; width: 100%;
        flex-direction: column; align-items: center; margin-top: 30px; box-sizing: border-box; font-size: 18px;">
            <DefaultInput @on-enter="setName($event)" inputWidth="100%" inputHeight="40px" fontSize="18px" inputName="Account Name" inputPlaceholder="'NFT Acc'"/>
            
            <div style="width: 100%; text-align: left; margin-bottom: 18px; margin-top: 20px;">
                Account Index: <span style="color: var(--accent_color)">{{nextAccountIndex}}</span> <br>
                <i style="font-size: 13px;  color: var(--fg_color_2)">The account will always be the same at the given index.</i>
                <hr>
            </div>
            <div style="width: 100%; text-align: left; margin-bottom: 18px;">
                Network: <span style="color: var(--accent_color)">{{selectedNetwork.network.networkName}}</span> <br>
                <i style="font-size: 13px;  color: var(--fg_color_2)">You can switch network at any time.</i>
                <hr>
            </div>
            <div style="display: flex; align-items: center; flex-direction: column; width: 100%;margin: 15px;">
                <DropdownSelection selectionText="Select Network" scrollHeight="120px" selectionWidth="70%" fontSize="18px" selectionHeight="35px" :dropDownContent="Array.from(networks.allNetworks.keys())"
                @on-select="selectNetwork($event)"/>
            </div>
        </div>
        <div class="flexBox" style="flex-grow: 0; margin-bottom: 15px; width: 100%; flex-direction: row; align-self: center; justify-content: space-evenly;">
            <DefaultButton buttonHeight="40px" buttonWidth="150px" buttonText="Return" @button-click="quitModal()"/>
            <DefaultButton buttonHeight="40px" buttonWidth="150px" buttonText="Create" @button-click="createAccount()"/>
        </div>
    </div>
</template>

<script lang="ts">
import DefaultButton from "../building_parts/DefaultButton.vue";
import DefaultInput from "../building_parts/DefaultInput.vue";
import DropdownSelection from "../building_parts/DropdownSelection.vue";
import { VultureWallet, createNewAccount, WalletType, DefaultNetworks, Network, NetworkType} from "../../vulture_backend/wallets/IvultureWallet";
import { PropType, reactive, ref } from 'vue';

export default {
  name: "CreateAccountModal",
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
    nextAccountIndex: Number
  },
  setup(props: any, context: any) {

    let accountName: string;
    const networks = new DefaultNetworks();

    let selectedNetwork = reactive({network: networks.AlephZero});

    function quitModal() {
        context.emit("quit-modal");
    }
    function setName(name: string) {
        accountName = name;
    }
    function selectNetwork(network: string) {
        let ntwrk = networks.allNetworks.get(network);
        selectedNetwork.network = (ntwrk == undefined ? networks.AlephZero : ntwrk);
    }
    function createAccount() {       /*Easiest way to get object from proxy...*/
        props.vultureWallet.createAccount(JSON.parse(JSON.stringify(selectedNetwork.network)),
        accountName,
        WalletType.MnemonicPhrase);
        quitModal();
    }

    return {
        networks,
        selectedNetwork,

        quitModal: quitModal,
        setName: setName,
        createAccount: createAccount,
        selectNetwork: selectNetwork
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
