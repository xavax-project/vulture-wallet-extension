<template>
  <div style="margin-bottom: 15px;">
      <div :v-if="inputName != ''" class="inputName">{{inputName}}</div>
      <input class="inputCustom" @input="onEnter()" @keyup.enter="onEnter(); onEnterKey();" ref="inputField" min=0 :type="inputType"
       :placeholder="inputPlaceholder" :style="{height: inputHeight, width: inputWidth, fontSize: fontSize}" v-model="text"/>
  </div>
</template>

<script>
export default {
  name: "DefaultInput",
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
    border-color: var(--accent_color);
    border-bottom-color: var(--accent_color);
    border-top-color: var(--bg_color_2);
    border-style: none;
    border-bottom-style: solid;


    outline: none;

    color: var(--fg_color);

    box-shadow: 0px 0px 4px rgb(10, 10, 10);

    text-align: center;

    border-radius: 5px;


}
.inputCustom:hover{
    transition-duration: 120ms;
    filter: brightness(90%);    
}
.inputCustom:focus{
    transition-duration: 120ms;
    filter: brightness(90%);
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
