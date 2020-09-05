<template>
<div id="app">
  <v-app>
    <v-toolbar height="45px" color="bar">
      <v-toolbar-title><h1>FR Checker <i class="fas fa-chart-line"></i></h1></v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn
        href="https://twitter.com/crptVaper"
        target="_blank"
        icon
        color="fff"
      >
      <i class="fab fa-twitter-square fa-2x"></i>
      </v-btn>

      <v-btn
        href="https://github.com/yasu21/fr-checker"
        target="_blank"
        icon
        color="#fff"
      >
      <i class="fab fa-github-square fa-2x"></i>
      </v-btn>

      <v-btn
        icon
        color="#fff"
        @click="openm"
      >
      <i class="fas fa-donate fa-2x"></i>
      </v-btn>
    </v-toolbar>

    <v-main>

    <div v-if="modal" class="over">
      <div class="content-m">
        <h3>Thank you for your donation!!</h3>
        
        <p class="mt-3">ETH/erc20 : 
          0x7c3d897A5b1144af267A7ff92208dbDebB5be991</p>

        <div class="text-center">
        <v-btn @click="closem" color="bar" class="my-4" dark>close</v-btn>
        </div>
    </div>
    </div>

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
    <div class="sp-btm">
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
    },
    openm(){
      this.modal=true;
    },
    closem(){
      this.modal=false;
    }
  },
  data(){
    return{
     modal:false,
    }
  }
};
</script>
<style>
.bottom-v{
  position: fixed;
  bottom: 20px;
  right: 50%;
  z-index: 2000;
  display: none;
}

.ftx{
  margin-right: 10px;
}

h1{
  font-size: 28px;
}

.sp-btm{
  position: fixed;
  bottom: 0;
  z-index: 7;
  width: 100%;
}

.over{
  z-index:1000;
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background-color:rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.content-m{
  background:#fafafa;
  width:50%;
  z-index: 1100;
  color: #666;
  padding: 10px;
  border-radius: 4px;
  word-break: break-word;
}

@media screen and (max-width:1000px) {
.content-m{
  background:#fafafa;
  width:90%;}
}

@media screen and (max-width:599px) {
.bottom-v{display: none;}
.sp-btm{
  position: fixed;
  bottom: 0;
  z-index: 7;
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

