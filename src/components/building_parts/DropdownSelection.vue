<template>
  <div class="selection" v-bind:style="{height: selectionHeight, width: selectionWidth, fontSize: fontSize}">
      <div class="selectionButton" v-bind:style="{fontSize: fontSize}" @click="toggleDropdown()" v-bind:class="displaySelection == true ? 'buttonSelected' : ''">
        {{selectionText}}
      </div>
      <div class="selectionContent" v-bind:style="{maxHeight: scrollHeight}" v-bind:class="displaySelection == true ? 'displaySelection' : ''">
          <div class="network" v-for="item in dropDownContent" v-bind:key="item" @click="select(item)">
            {{item}}
          </div>
      </div>
  </div>
</template>

<script lang="ts">
import { Network } from "../../vulture_backend/wallets/IvultureWallet";
import { PropType, ref } from 'vue';

export default {
  name: "DropdownSelection",
  props: {
    selectionText: String,
    selectionHeight: String,
    selectionWidth: String,
    fontSize: String,
    scrollHeight: String,
    
    dropDownContent: {
        type: Array as PropType<string[]>,
    },
  },
  setup(props: any, context: any) {

    let displaySelection = ref(false);

    function toggleDropdown(state?: boolean) {
      if(state) {
        displaySelection.value = state;
      }else {
        displaySelection.value = !displaySelection.value
      }
    }
    function select(key: string) {
      context.emit("on-select", key);
      toggleDropdown(false);
    }
    return {
      displaySelection,

      select: select,
      toggleDropdown: toggleDropdown
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.selectionButton {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border-color: var(--bg_color_2);
  border-width: 2px;
  border-style: solid;
  /*
  box-shadow: 0px 0px 6px rgb(5, 5, 5);
   */
  transition-duration: 100ms;
  cursor: pointer;
  width: 100%;
  height: 100%;
  font-size: 22px;

  font-family: ButtonFont;

  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.selectionButton:hover {
  color: var(--accent_color);
  text-shadow: 0px 0px 4px var(--accent_color);
}
.buttonSelected {
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  transition-duration: 130ms;
  color: var(--accent_color);
  text-shadow: 0px 0px 4px var(--accent_color);
}

.network {
  padding: 12px 16px;
  text-decoration: none;
  display: flex;
  cursor: pointer;
  transition-duration: 130ms;

  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.network:hover {
  color: var(--accent_color);
  text-shadow: 0px 0px 4px var(--accent_color);
  transition-duration: 130ms;
}
.selectionContent {
  visibility: none;
  pointer-events: none;
  opacity: 0;
  flex-direction: column;
  align-content: flex-start;
  
  border-radius: 8px;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-color: var(--bg_color_2);
  border-width: 2px;
  border-style: solid;
  border-top-style: hidden;
  /*
  box-shadow: 0px 0px 6px rgb(5, 5, 5);
   */
  width: 100%;
  max-height: 50px;

  overflow: hidden;
  z-index: 1;
  overflow-y: scroll;

  transition-duration: 130ms;
}
.displaySelection {
  transition-duration: 130ms;
  pointer-events:fill;
  opacity: 1;
  display: flex;
}
/*
.selection:hover .selectionContent {
  transition-duration: 130ms;
  pointer-events:fill;
  opacity: 1;
  display: flex;
}
 */
</style>
