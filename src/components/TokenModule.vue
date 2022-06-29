<template>
  <div @click="moduleClick()" class="module" v-bind:class="selected == true ? 'selected' : ''">
    <div class="icon">
      &#xe062;
    </div>
      <div class="left">
        "{{token.name}}"
      </div>
      <div class="right">
        {{token.balance}}<span style="font-size: 13px; color: var(--accent_color); ">{{token.symbol}}</span>
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
    selected: Boolean,
  },
  methods: {
    moduleClick(){
       this.$emit('module-click', (this.token as AbstractToken).address);
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

  width: 270px;
  height: auto;
  min-height: 52px;

  margin-bottom: 6px;
  margin-top: 6px;

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
