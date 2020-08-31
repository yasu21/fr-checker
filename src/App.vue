<template>
<div id="app">
  <v-app>
    <v-toolbar dense color="bar">
      <v-toolbar-title><h1>FR Checker <i class="fas fa-chart-line"></i></h1></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        href="https://twitter.com/crptVaper"
        target="_blank"
        text
      >
        <span class="mr-2">Developer</span>
         <i class="fab fa-twitter-square fa-2x"></i>
      </v-btn>
    </v-toolbar>

    <v-main>
      <API/>
    </v-main>

    <div class="bottom-v">
    <v-btn
    color="#ee6560"
    raised
    class="white--text ftx"
    width="100px" height="50px"
    href="https://ftx.com/#a=signapp"
    target="_blank">
    <v-icon left dark>mdi-open-in-new </v-icon> Go FTX
    </v-btn>

    <v-btn
    color="#4db872"
    fab
    class="white--text"
    @click="up">
    <v-icon>mdi-arrow-up</v-icon>
    </v-btn>

    </div>
    <div class="sp-b">
      <Bottom/>
    </div>
  </v-app>
</div>
</template>

<script>
import API from './components/API';
import Bottom from './components/Bottom';
export default {
  name: 'App',

  components: {
    API,
    Bottom
  },
  methods:{
    up(){
      window.scrollTo(0,0);
    }
  }
};
</script>
<style>
.bottom-v{
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 2000;
}

.ftx{
  margin-right: 10px;
}

h1{
  font-size: 28px;
}

@media screen and (max-width:599px) {
.bottom-v{display: none;}
.sp-b{
  position: fixed;
  bottom: 0;
  z-index: 100;
  width: 100%;
}

h1{
  font-size: 24px;
}
}

@media screen and (min-width:600px) {
.sp-b{display: none;}
}
</style>