<template>
    <div class="flexBox" style="height: 100%; width: 100%;">
        <div class="flexBox" style="flex-grow: 1; padding-left: 15px; padding-right: 15px; width: 100%;
        flex-direction: column; align-items: center; margin-top: 30px; box-sizing: border-box; font-size: 20px;
        overflow-wrap: break-word;">
            
            <div style="width: 100%; text-align: center; margin-bottom: 20px; margin-top: 0px;  font-size: 24px;">
                Reset Wallet<br>
                <hr>
            </div>

            <div class="outline"  style="width: 95%; text-align: left; font-size: 18px; height: auto; text-align: center;">
                The only way to recover your wallet is through your seed-phrase!<br> <br>
                <div style="font-size: 16px; color: var(--fg_color_2); margin-bottom: 15px;">
                    Which you've hopefully written down somewhere safe and not shared with anyone.
                </div>
                <div style="font-size: 16px; color: var(--fg_color_2); margin-bottom: 15px;">
                    Resetting will delete all data and log you out of the wallet. The only way to recover would
                    be through your seed-phrase or hardware wallet.
                </div>
                <div style="display: flex; margin-top: 70px; margin-bottom: 0px;">
                    <DefaultButton buttonHeight="40px" buttonWidth="150px" buttonText="Reset" @button-click="resetWallet()"/>
                </div>
            </div>

        </div>
        <div class="flexBox" style="flex-grow: 0; margin-bottom: 15px; width: 100%; flex-direction: row; align-self: center; justify-content: space-evenly;">
            <DefaultButton buttonHeight="40px" buttonWidth="300px" buttonText="Return" @button-click="quitModal()"/>
        </div>
    </div>
</template>

<script lang="ts">
import DefaultButton from "../building_parts/DefaultButton.vue";
import DefaultInput from "../building_parts/DefaultInput.vue";
import DropdownSelection from "../building_parts/DropdownSelection.vue";
import AccountModule from "../AccountModule.vue"

import { VultureWallet, createNewAccount, WalletType, DefaultNetworks, Network, NetworkType, hardWalletReset} from "../../vulture_backend/wallets/IvultureWallet";
import { PropType, reactive, ref } from 'vue';
import { VultureMessage } from '@/vulture_backend/vultureMessage';
import { TxState } from '@/uiTypes';

export default {
  name: "ResetWalletModal",
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
  },
  setup(props: any, context: any) {

    function quitModal() {
        context.emit("quit-modal");
    }
    function resetWallet() {
        hardWalletReset();
        context.emit("on-wallet-reset");
    }

    return {
        quitModal: quitModal,
        resetWallet: resetWallet
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
    margin: 12px;
    height: 120px;
    overflow: hidden;
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
