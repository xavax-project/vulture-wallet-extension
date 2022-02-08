<template>
    <div style="display: flex; height: 100%; align-items: center;">
        <div style="width: 28px; font-size: 16px; color: var(--accent_color)">
            {{wordIndex + 1}}
        </div>
        <div class="inputCustom">
            {{word}}
        </div>
    </div>
</template>

<script>
export default {
  name: "SeedWordBox",
  props: {
    word: String,
    wordIndex: Number
  },
  data() {
      return {
          currentWord: "",
      }
  },
  methods: {

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.inputDescription {
    text-align: center;
    font-size: 13px;
    margin: 5px;
    color: var(--fg_color_2);
}
.inputCustom {
  background-color: var(--bg_color);
  border-color: var(--bg_color_2);
  border-style: solid;
  font-size: 17px;
  border-bottom-style: solid;
  outline: none;
  color: var(--fg_color);
  box-shadow: 0px 0px 4px rgb(10, 10, 10);
  text-align: center;
  border-radius: 3px;

  margin: 5px;
  height: 24px;
  width: 90px;
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
