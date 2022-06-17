<template>
  <div style="margin-bottom: 15px;">
      <div :v-if="inputName != ''" class="inputName">{{inputName}}</div>
      <input class="inputCustom" @input="onEnter()" @keyup.enter="onEnter(); onEnterKey();" ref="inputField" min=0 :type="inputType"
       :placeholder="inputPlaceholder" :style="{height: inputHeight, width: inputWidth, fontSize: fontSize}" v-model="text"/>
  </div>
</template>

<script>
export default {
  name: "MinimalInput",
  props: {
      inputType: String, // Number, or Password, Etc.
      inputPlaceholder: String,
      inputName: String,
      inputHeight: String,
      inputWidth: String,
      fontSize: String,
      focusPriority: Boolean,

      startValue: String,
  },
  data() {
    return {
      text: ""
    }
  },
  methods: {
    onEnter() {
        this.$emit('on-enter', this.text);
    },
    onEnterKey() {
        this.$emit('on-key-enter');
    }
  },
  mounted() {
    if(this.startValue) {
      this.$refs["inputField"].value = this.startValue;
    }
    if(this.focusPriority) {
      this.$refs["inputField"].focus();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.inputName {
    text-align: left;
    font-size: 14px;
    margin: 5px;
    color: var(--fg_color_2);
}
.inputCustom {
    background-color: var(--bg_color);
    
    border-color: var(--bg_color_2);
    border-width: 2px;
    border-style: solid;

    border-bottom-width: 2px;

    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    border-radius: 10px;

    outline: none;

    color: var(--fg_color);

    text-align: center;
    transition-duration: 200ms;
}
.inputCustom:hover{
  transition-duration: 170ms;
  filter: brightness(85%);
    
}
.inputCustom:focus{
  transition-duration: 170ms;
  filter: brightness(85%);
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    transition-duration: 110ms;
  -webkit-appearance: none;
}
input {
  -moz-appearance: textfield;
}
</style>
