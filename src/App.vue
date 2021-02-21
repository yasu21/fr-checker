<template>
<div id="app">
  <v-app>
    <v-toolbar height="45px" color="bar">
      <v-toolbar-title>
        <h1>FR Checker <i class="fas fa-chart-line"></i></h1>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>

      <v-btn href="https://twitter.com/crptVaper" target="_blank" icon color="fff">
        <i class="fab fa-twitter-square fa-2x"></i>
      </v-btn>

      <v-btn href="https://github.com/yasu21/fr-checker" target="_blank" icon color="#fff">
        <i class="fab fa-github-square fa-2x"></i>
      </v-btn>

      <v-btn icon color="#fff" @click="openm">
        <i class="fas fa-donate fa-2x"></i>
      </v-btn>
    </v-toolbar>

    <v-main>
      <div v-if="modal" class="over">
        <div class="content-m text-center">
          <h3>Thank you for your donation!!</h3>
          <p class="mt-3">ETH/ERC20/BEP20:</p>
          <v-img
          max-width="250px"
          class="mx-auto"
          src="@/assets/sample.png"
          ></v-img>
          <img >

          <p>0x7600892677CbB927260fD100815963F043F39f08</p>

          <div class="text-center">
            <v-btn @click="closem" color="bar" class="my-4" dark>close</v-btn>
          </div>
        </div>
      </div>

        <v-tabs align-with-title
        v-model="tab"
        color="#fff"
        background-color="bar">
          <v-tab>FTX-FR</v-tab>
          <v-tab>Basis & FR</v-tab>
        </v-tabs>

      <API_copy v-if="test==true"></API_copy>
      <API v-show="tab==0"></API>
      <Basis v-show="tab==1"></Basis>
    </v-main>


    <div class="sp-btm sp600">
      <Bottom />
    </div>
  </v-app>
</div>
</template>

<script>
import API from './components/API';
import API_copy from './components/API_copy';
import Bottom from './components/Bottom';
import Basis from '@/components/Basis';
export default {
  name: 'App',

  components: {
    API,
    Bottom,
    API_copy,
    Basis
  },
  data() {
    return {
      modal: false,
      test: false,
      tab:""
    }
  },
  methods: {
    up() {
      window.scrollTo(0, 0);
    },
    openm() {
      this.modal = true;
    },
    closem() {
      this.modal = false;
    }
  },
};
</script>
<style>
.bottom-v {
  position: fixed;
  bottom: 20px;
  right: 50%;
  z-index: 2000;
  display: none;
}

.ftx {
  margin-right: 10px;
}

h1 {
  font-size: 28px;
}

.sp-btm {
  position: fixed;
  bottom: 0;
  z-index: 7;
  width: 100%;
}

.over {
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-m {
  background: #fafafa;
  width: 50%;
  z-index: 1100;
  color: #666;
  padding: 10px;
  border-radius: 4px;
  word-break: break-word;
}

#app .v-application{
  font-family: 'Roboto','Avenir','Helvetica Neue','Helvetica','Arial','Hiragino Sans','ヒラギノ角ゴシック',YuGothic,'Yu Gothic','メイリオ', Meiryo,'ＭＳ Ｐゴシック','MS PGothic' !important;
  }

@media screen and (max-width:1000px) {
  .content-m {
    background: #fafafa;
    width: 90%;
  }
}

@media screen and (max-width:599px) {
  .bottom-v {
    display: none;
  }

  .sp-btm {
    position: fixed;
    bottom: 0;
    z-index: 7;
    width: 100%;
  }


  h1 {
    font-size: 24px;
  }

}

@media screen and (min-width:600px) {
  .sp-b {
    display: none;
  }
}
</style>

