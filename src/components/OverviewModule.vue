<template>
  <div class="overviewModule">
    <div class="flexBox" style="width: 100%;">
      <div class="flexBox" style="width: 100%; flex-direction: row;">
        <div class="amountText">
          {{ assetAmount }}<span class="azero">{{ assetPrefix }}</span>
            <div class="underline"/>
        </div>
        <div class="selectAccountButton" style="margin-left: auto; margin-right: 20px; margin-top: 20px;" @click="selectAccount()">
          &#xf0c9;
        </div>
      </div>

      <div class="flexBox" style="width: 100%; justify-content: flex-end; align-items: center;">
        <div style="margin: 6px; margin-left: 20px; align-self: flex-start;">
        <div style="font-size 16px;">your address:</div>
        </div>
        <div class="addressText" style="">
          {{ address }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "OverviewModule",
  props: {
    address: String,
    assetPrefix: String,
    assetAmount: String
  },
  setup(props: any, context: any) {
    function selectAccount() {
      context.emit("select-account");
    }
    return {
      selectAccount: selectAccount,
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.selectAccountButton {
  font-family: fonticonA;
  font-size: 22px;
  cursor: pointer;
  transition-duration: 120ms;
  color: var(--fg_color_2)
}
.selectAccountButton:hover {
  color: var(--accent_color);
  text-shadow: 0px 0px 5px var(--accent_color);
  transition-duration: 120ms;
}
.selectAccountButton:active {
  color: var(--accent_color);
  text-shadow: 0px 0px 5px var(--accent_color);
  filter: brightness(75%);
  transition-duration: 120ms;
}
.addressText {
  margin-bottom: 12px;

  font-size: 12px;
  color: var(--accent_color);

  font-weight: bold;

  border-width: 2px;
  border-color: var(--bg_color_2);
  border-style: solid;

  padding: 7px;
  border-radius: 7px;
}
.azero {
  font-size: 14px;
  color: var(--accent_color);
  font-weight: bold;
}
.underline {
  background-color: var(--fg_color);
  height: 2px;
  border-radius: 10px;
  margin-top: 5px;
  width: 100%;
  align-self: left;
}
.overviewModule {
  box-sizing: border-box;
  border-width: 2px;
  border-color: var(--bg_color_2);
  border-style: solid;
  border-top-style:none;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  width: auto;
  height: 160px;

  border-bottom-left-radius:  18px;
  border-bottom-right-radius: 18px;
  box-shadow: 0px 0px 4px rgb(6,6,6);
  /*
   */
}
.amountText {
  margin: 20px;
  font-size: 28px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
