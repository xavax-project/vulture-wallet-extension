<template>
  <div style="display: flex; align-items: center; flex-direction: column; margin-bottom: 15px;">
    <div class="seedBox">
      <div v-for="(word, index) in currentSeed" v-bind:key="word">
        <SeedWordEdit :word="word" :wordIndex="index" @update-word="onEnter($event)"/>
      </div>
    </div>
      <div v-if="currentSeed.length < 1" class="inputDescription">Enter each word and hit Space/Enter.<br> 24-word seedphrases are recommended, if you have a seed with less words
        you should create a new wallet.
      </div>
      <input class="inputCustom" @keyup.enter="onEnter($event)" @keyup.space="onEnter($event)"
       ref="seedInput" min=0
       placeholder="Enter Word"/>
      <div v-if="currentSeed.length > 0" class="seedState">
        <span v-if="!this.isSeedValid">Your seed is currently <span style="color: rgb(255,0,70)">Invalid</span>.</span>
        <span v-if="this.isSeedValid">Your seed is <span style="color: var(--accent_color)">Valid</span>.</span>
      </div>
  </div>
</template>

<script>
import { validateMnemonic } from 'bip39';
import SeedWordEdit from "./SeedWordEdit.vue";

export default {
  name: "SeedPhraseInput",
  components: {
    SeedWordEdit
  },
  props: {

  },
  data() {
    return {
      currentSeed: [],
      isSeedValid: false
    }
  },
  methods: {
    onEnter(event) {
      
      //If we are updating an already existing word we need to handle things differently.
      if(event.newWord != null) {

        this.currentSeed[event.index] = event.newWord.split(" ").join("");
        if(validateMnemonic(this.currentSeed.join(' '))) {
          this.$emit('valid-mnemonic', this.currentSeed.join(' '));
          this.isSeedValid = true;
        }else{
          this.isSeedValid = false;
        }
        return;
      }
      
      event.target.value = event.target.value.split(" ").join("");

      if(this.currentSeed.length < 24 && event.target.value != "") {
        this.currentSeed.push(event.target.value);
        event.target.value = "";
      }
      if(validateMnemonic(this.currentSeed.join(' '))) {
        this.$emit('valid-mnemonic', this.currentSeed.join(' '));
        this.isSeedValid = true;
      }else {
        this.isSeedValid = false;
      }
      this.$refs["seedInput"].focus();
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.seedBox {
  display: flex;
  width: 820px;
  height: auto;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow-wrap: break-word;
  flex-wrap: wrap;
  align-self: center;
}

.seedState {
    text-align: center;
    font-size: 13px;
    margin: 4px;
    color: var(--fg_color_2);
}

.inputDescription {
    text-align: center;
    font-size: 13px;
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
  border-radius: 3px;
  font-size: 18px;

  margin: 25px;
  height: 35px;
  width: 150px;
}
.inputCustom:hover{
    transition-duration: 120ms;
    border-color: rgb(55, 190, 112);
    
}
.inputCustom:focus{
    transition-duration: 120ms;
    border-color: rgb(55, 190, 112);
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
