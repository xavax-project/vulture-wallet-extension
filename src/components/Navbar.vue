<template>
  <div class="flexBox" style="align-items: center;">
      <div class=navbar>
           <div @click="onTabSwitch('send')" class="iconFont" :class="currentTab == 'send' ? 'selected' : ''">
               &#xf1d8;
           </div>
            <div @click="onTabSwitch('history')" class="iconFont" :class="currentTab == 'history' ? 'selected' : ''">
               &#xf1da;
           </div>
            <div @click="onTabSwitch('accounts')" class="iconFont" :class="currentTab == 'accounts' ? 'selected' : ''">
               &#xf2b9;
           </div>
            <div @click="onTabSwitch('settings')" class="iconFont" :class="currentTab == 'settings' ? 'selected' : ''">
               &#xf013;
           </div>
      </div>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  props: {
  },
  data() {
      return {
          currentTab: "send"
      }
  },
  methods: {
    onTabSwitch(newTab) {
        this.$emit('switch-tab', newTab);
        this.currentTab = newTab;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navbar {
    /*
    box-shadow: 0px 0px 4px 0px rgb(5, 5, 5) inset;
     */
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: row;
    margin: 5px;
    border-radius: 10px;
    height: 40px;
    width: 325px;
    background-color: var(--bg_color);

    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.iconFont {
    font-size: 22px;
    font-family: fonticonA;
    color: var(--fg_color_2);
    transition-duration: 190ms;
    cursor: pointer;
}
.iconFont:hover {
    color: var(--accent_color);
    text-shadow: 0px 0px 5px var(--accent_color);
    transition-duration: 190ms;
}
.iconFont:active {
    color: rgb(55, 190, 112);
    text-shadow: 0px 0px 4px rgb(55, 190, 112);
}
.selected {
    text-shadow: 0px 0px 5px var(--accent_color);
    color: var(--accent_color);
}
</style>
