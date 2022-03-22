<template>
  <div v-bind:style="{height: buttonHeight, width: buttonWidth, fontSize: fontSize}" v-bind:class="buttonDisabled == true ? 'disabledButton' : 'button'" @click="onClick()">
      <div class="buttonText">
        {{buttonText}}
      </div>
  </div>
</template>

<script>
export default {
  name: "DefaultButton",
  props: {
      buttonText: String,
      buttonHeight: String,
      buttonWidth: String,
      fontSize: String,
      buttonDisabled: Boolean
  },
  methods: {
    onClick() {
      if(this.buttonDisabled == false)
      {
        this.$emit('button-click');
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: auto;
    height: auto;
    border-radius: 12px;
    border-color: var(--bg_color_2);
    border-width: 2px;
    border-style: solid;
    box-shadow: 0px 0px 3px rgb(5, 5, 5);
    transition-duration: 100ms;
    cursor: pointer;

    font-family: ButtonFont;

    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    font-size: 22px;

}
.button:hover {
    transition-duration: 100ms;
    border-color: var(--accent_color);
    box-shadow: 0px 0px 8px 0px rgb(5, 5, 5);
    color: var(--accent_color);
    background-color: var(--bg_color);
}
.button:active {
    transition-duration: 100ms;
    box-shadow: 0px 0px 3px 0px rgb(5, 5, 5);
    background-color: var(--bg_color);
    filter: brightness(70%);
}
.disabledButton {

    display: flex;
    justify-content: center;
    align-items: center;
    width: auto;
    height: auto;
    border-radius: 12px;
    border-color: var(--bg_color_2);
    border-width: 2px;
    border-style: solid;
    box-shadow: 0px 0px 3px rgb(5, 5, 5);
    transition-duration: 100ms;
    cursor:not-allowed;

    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    font-size: 22px;
}
</style>
