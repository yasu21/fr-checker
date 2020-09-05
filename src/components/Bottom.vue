<template>
<v-bottom-navigation
    :value="activeBtn"
    grow
    color="#fff"
    background-color="bar"
  >
    <v-btn
    href="https://ftx.com/#a=signapp"
    target="_blank">
    <span>FTX</span>
    <v-icon dark>mdi-open-in-new </v-icon>
    </v-btn>

    <v-btn @click="up">
      <span>TOP</span>
      <v-icon>mdi-arrow-up</v-icon>
    </v-btn>

   <v-btn
   href="https://forms.gle/ZappBKeuRckRbNLW9"
  target="_blank">
      <span>Contact</span>
      <v-icon>mdi-email-send</v-icon>
    </v-btn>

  </v-bottom-navigation>
</template>

<script>
  export default {
    name:"Bottom",
    data () {
      return {
        activeBtn: 1,
      }
    },
  methods:{
    up(){
      window.scrollTo(0,0);
    }
  }
  }
</script>