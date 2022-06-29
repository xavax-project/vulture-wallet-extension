<template>
  <div @click="moduleClick()" class="module" v-bind:class="selected == true ? 'selected' : ''">

      <div class="tokenNameBox">
        <span style="color: var(--accent_color);">$</span>{{token.symbol}}
      </div>


    <div class="tokenBalanceBox">
        Bal: <span style="color: var(--accent_color); ">{{token.balance}}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { AbstractToken } from "../vulture_backend/types/abstractToken";
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: "NFTModule",
  props: {
    token: {
        type: Object as PropType<AbstractToken>,
        required: true,
    },
    selected: Boolean,
  },
  methods: {
    moduleClick(){
       this.$emit('module-click', (this.token as AbstractToken).address);
    }
  },
  setup(props, emit) {
    return {

    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.icon {
  font-family: fonticonA;
  font-size: 18px;
  margin: 5px;
  margin-left: 15px;
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
.tokenNameBox {
    backdrop-filter: blur(3px);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding: 1px;
    background-color: rgba(0,0,0,0.5);
    width: 100%;
    border-color: var(--bg_color_2);
    margin-bottom: auto;
}
.tokenBalanceBox {
    backdrop-filter: blur(3px);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding: 1px;
    background-color: rgba(0,0,0,0.5);
    width: 100%;
    border-color: var(--bg_color_2);
}
.module {
  display: flex;
  align-items: center;
  flex-direction: column;
  box-sizing: border-box;

  background-repeat: no-repeat;
  background-size: cover;

  border-color: var(--bg_color_2);
  border-width: 2px;
  border-radius: 12px;
  border-style: solid;

  box-shadow: 0px 0px 3px rgb(6,6,6);

  width: 125px;
  height: 160px;
  min-height: 52px;

  overflow: hidden;

  margin: 10px;
  margin-bottom: 5px;
  margin-top: 5px;

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
.selected {
  border-color: var(--accent_color);
  color: var(--accent_color);
}
</style>
