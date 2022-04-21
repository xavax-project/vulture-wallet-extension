<template>
  <div @click="moduleClick()" class="module" v-bind:class="selected == true ? 'selectedAccount' : ''">
    <div class="icon">
      &#xf51e;
    </div>
      <div class="left">
        "{{token.symbol}}"
      </div>
      <div class="right">
        <span>1231</span>
      </div>
  </div>
</template>

<script lang="ts">
import { AbstractToken } from "../vulture_backend/types/abstractToken";
import { PropType } from 'vue';

export default {
  name: "AccountModule",
  props: {
    token: {
        type: Object as PropType<AbstractToken>,
        required: true,
    },
    tokenIndex: Number
  },
  methods: {
    moduleClick(){
       this.$emit('module-click', this.tokenIndex);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.icon {
  font-family: fonticonA;
  font-size: 18px;
  margin: 5px;
  margin-left: 15px;
}
.selectedAccount {
  color: var(--accent_color);
}


.right {
  margin: 10px;
  font-size: 17px;
  flex-grow: 1;
  justify-self: flex-end;
  text-align: right;
}
.left {
  margin: 5px;
  font-size: 17px;
  text-align: left;
}
.underline {
  background-color: var(--fg_color);
  height: 2px;
  border-radius: 10px;
  margin-top: 5px;
  width: 100%;
  align-self: left;
}
.module {
  display: flex;
  align-items: center;
  box-sizing: border-box;


  border-color: var(--bg_color_2);
  border-width: 2px;
  border-radius: 12px;
  border-style: solid;

  box-shadow: 0px 0px 3px rgb(6,6,6);

  width: 250px;
  height: auto;
  min-height: 50px;

  margin-bottom: 10px;
  margin-top: 10px;

  cursor: pointer;
}
.module:hover {
  transition-duration: 160ms;
  box-shadow: 0px 0px 8px rgb(6,6,6);
  border-color: var(--accent_color);
  color: var(--accent_color);
}
.module:active {
  transition-duration: 160ms;
  box-shadow: 0px 0px 8px rgb(6,6,6);
  filter: brightness(75%);
}
</style>
