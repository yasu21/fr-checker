<template>
<div id="data-tbl2">
  <v-card max-width="90%" height="600px" class="mx-auto" raised v-if="error">
    <v-card-title>Error Try Again</v-card-title>
    <div class="APIcall_container">
      <v-btn color="primary" @click="reload"
      width="247px" height="50px"
      class="font-weight-bold float-right"
      :disabled="wait">
        <v-icon left>mdi-refresh-circle</v-icon> Reload
      </v-btn>
    </div>
  </v-card>

  <v-card max-width="90%" class="mx-auto" raised v-else>
    <v-card-title>Basis & Funding rate</v-card-title>
    <div class="text-right">
    <span class="green2 pc">
      <v-icon small>mdi-arrow-up</v-icon>Low to High
    </span>
    <span class="red2 pc">
      <v-icon small>mdi-arrow-down</v-icon>High to Low
    </span>
    </div>

    <v-card-title>
      <v-row>
        <v-col cols="12" sm="4">
          <v-select
          outlined color="#fff" dark
          v-model="coin"
          :items="coins"
          label="通貨選択"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="4">
          <v-select
          outlined color="#fff" dark
          v-model="kigen"
          :items="kigens"
          label="期限選択"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="pc6">
            <v-btn color="primary" width="100%" height="50px" class="font-weight-bold float-right"
            :disabled="wait" @click="reload">
            <v-icon left>mdi-refresh-circle</v-icon> Reload
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <div class="sp600">
      </div>
    </v-card-title>

    <Loading class="loading" v-show="loadProgress"></Loading>

    <v-data-table
    :sort-by="sortBy"
    :items-per-page=10
    :headers="headers"
    :items="rate_data"
    fixed-header
    height="auto" class="elevation-1"
    item-key="name"
    sort-desc must-sort>

     <template v-slot:[`item.symbol`]="{ item }">
      <a :href="item.url">
        {{ item.symbol }}
        <v-icon left>mdi-open-in-new</v-icon>
        </a>
    </template>

     <template v-slot:[`item.coin`]="{ item }">
        <v-icon v-if="item.coin==true">mdi-circle-outline</v-icon>
        <v-icon v-else>mdi-close-thick</v-icon>
    </template>
    </v-data-table>

  <v-card style="padding-bottom: 60px;">
    <v-card-title>用語解説</v-card-title>
    <v-card-text>
      <li>Basis:現物価格との差</li>
      <li>Spot:現物価格</li>
      <li>Next FR:次回資金調達率(Funding rate)</li>
      <li>Coin:担保がコイン現物→〇。担保がステーブルコイン→×</li>
    </v-card-text>
  </v-card>

  </v-card>



</div>
</template>

<script>
import axios from "axios"
import Loading from '@/components/Loading';

export default {
  name: "Basis",
  data() {
    return {
      headers: [{
          text: 'Pair',
          align: 'start',
          sortable: false,
          value: 'symbol',
        },
        {
          text: 'FR',
          value: 'fr'
        },
        {
          text: 'Basis',
          value: 'basis'
        },
        {
          text: 'Price',
          value: 'price'
        },
        {
          text: 'Spot',
          value: 'spot'
        },
        {
          text: 'Coin',
          value: 'coin'
        },
      ],

      loadProgress: false,
      rate_data: [],
      ftx_list:[],
      okex_list:[],
      binance_list:[],
      bybit_list:[],
      count: 0,
      get: "",
      wait: false,
      error: false,
      singleSelect: true,
      //sortBy: 'next',
      sortBy: 'fr',
      kigen:"PERP",
      kigens:["PERP"],
      kigen_num:[],
      coin:"BTC",
      coins:["BTC","ETH"]
    }
  },
  components: {
    Loading,
  },
  async mounted() {
    await this.basis()
    await this.create_table("BTC")
    this.switch()
  },
  watch: {
    kigen(){
      this.switch()
    },
    async coin(){
      this.create_table(this.coin)
      this.switch()
    }
  },
  methods: {
    switch(){
      this.rate_data=[]
      var data=this.binance_list.filter(
          item =>
          item.kigen==this.kigen
        )
      for(var i=0; i<data.length; i++){
        this.rate_data.push(data[i])
      }

      data=this.ftx_list.filter(
          item =>
          item.kigen==this.kigen
        )
      for(i=0; i<data.length; i++){
        this.rate_data.push(data[i])
      }

      data=this.bybit_list.filter(
          item =>
          item.kigen==this.kigen
        )
      for(i=0; i<data.length; i++){
        this.rate_data.push(data[i])
      }

      data=this.okex_list.filter(
          item =>
          item.kigen==this.kigen
        )
      for(i=0; i<data.length; i++){
        this.rate_data.push(data[i])
      }
      if(this.kigen!="PERP"){
        this.sortBy="basis"
      this.headers= [{
          text: 'Pair',
          align: 'start',
          sortable: false,
          value: 'symbol',
        },
        {
          text: 'Basis',
          value: 'basis'
        },
        {
          text: 'Price',
          value: 'price'
        },
        {
          text: 'Spot',
          value: 'spot'
        },
        {
          text: 'Coin',
          value: 'coin'
        },
      ]
      }else{
      this.headers= [{
          text: 'Pair',
          align: 'start',
          sortable: false,
          value: 'symbol',
        },
        {
          text: 'Next FR',
          value: 'fr'
        },
        {
          text: 'Basis',
          value: 'basis'
        },
        {
          text: 'Price',
          value: 'price'
        },
        {
          text: 'Spot',
          value: 'spot'
        },
        {
          text: 'Coin',
          value: 'coin'
        },
      ]
        this.sortBy="fr"
      }
      //var list=[this.binance_list,this.ftx_list,this.bybit_list,this.okex_list]
    },
    async reload(){
      await this.basis()
      this.create_table(this.coin)
      this.switch()
    },
    async basis(){
      this.loadProgress=true
      this.wait = true
      var url="https://api.coingecko.com/api/v3/derivatives"
      await axios.get(url)
        .then(response => {
          this.get = response.data
        })
        .catch(error => {
          console.log(error);
          this.wait = false
          this.error = true;
        })
      this.loadProgress=false
      setTimeout(() => (this.wait = false), 1000);
    },
    create_table(tuka){
      var all_data=this.get
      this.rate_data=[]
      this.ftx_list=[]
      this.okex_list=[]
      this.binance_list=[]
      this.bybit_list=[]
      var kigen_num

      var ftx_btc_perp = all_data.filter(
        item =>
        item.index_id === tuka &&
        item.market==="FTX (Derivatives)" &&
        item.expired_at!=null
        )

      ftx_btc_perp.sort(function(a, b) {
        if (a.expired_at < b.expired_at) {
          return -1;
        } else {
          return 1;
        }});

      for(i=0; i<ftx_btc_perp.length; i++){
        kigen_num=ftx_btc_perp[i]["symbol"].split("-")
        this.kigen_num.push(kigen_num[1])
        this.kigens.push(kigen_num[1])

        var data_tb={
          symbol:"FTX:"+ftx_btc_perp[i]["symbol"],
          kigen:kigen_num[1],
          basis:Math.round(ftx_btc_perp[i]["basis"]*-10000)/10000+"%",
          price:ftx_btc_perp[i]["price"],
          spot:Math.round(ftx_btc_perp[i]["index"]*1000)/1000,
          fr:ftx_btc_perp[i]["funding_rate"]+"%",
          coin:true,
          url:"https://ftx.com/#a=signapp"
        }
        this.ftx_list.push(data_tb)
      }

      //binance
      var binance_btc_perp = all_data.filter(
        item =>
        item.index_id === tuka &&
        item.market==="Binance (Futures)"
        )
      for(var i=0; i<binance_btc_perp.length; i++){
        var data_ok=false
        if (binance_btc_perp[i]["symbol"].indexOf('_') != -1) {
          var perp=binance_btc_perp[i]["symbol"].split("_")
          if(perp[1]=="PERP"){
            data_ok=true
            }
        }else{
          data_ok=true
        }
        if(data_ok){
          var symbol=binance_btc_perp[i]["market"].replace(" (Futures)","")

          var coin=false
          if(symbol+"/"+binance_btc_perp[i]["symbol"]=="Binance/"+tuka+"USD_PERP"){
            coin=true
          }
          data_tb={
            symbol:"Binance:"+binance_btc_perp[i]["symbol"],
            kigen:"PERP",
            basis:Math.round(binance_btc_perp[i]["basis"]*-10000)/10000+"%",
            price:binance_btc_perp[i]["price"],
            spot:Math.round(binance_btc_perp[i]["index"]*1000)/1000,
            fr:binance_btc_perp[i]["funding_rate"]+"%",
            coin:coin,
            url:'https://www.binance.com/en/register?ref=PN9BGGWN'
          }
          this.binance_list.push(data_tb)
        }
      }

      binance_btc_perp = all_data.filter(
        item =>
        item.index_id === tuka &&
        item.market==="Binance (Futures)" &&
        item.expired_at!=null
        )
      binance_btc_perp.sort(function(a, b) {
        if (a.expired_at < b.expired_at) {
          return -1;
        } else {
          return 1;
        }});
        for(i=0; i<binance_btc_perp.length; i++){
          data_tb={
            symbol:"Binance:"+binance_btc_perp[i]["symbol"],
            kigen:this.kigen_num[i],
            basis:Math.round(binance_btc_perp[i]["basis"]*-10000)/10000+"%",
            price:binance_btc_perp[i]["price"],
            spot:Math.round(binance_btc_perp[i]["index"]*1000)/1000,
            fr:binance_btc_perp[i]["funding_rate"]+"%",
            coin:true,
            url:"https://www.binance.com/en/register?ref=PN9BGGWN"
          }
          this.binance_list.push(data_tb)
        }

      //okex
      var okex_btc_perp = all_data.filter(
        item =>
        item.index_id === 'OkexSwap-'+tuka &&
        item.market==="OKEx (Futures)" &&
        item.contract_type== "perpetual" &&
        item.expired_at==null
        )
      for(i=0; i<okex_btc_perp.length; i++){
        symbol=okex_btc_perp[i]["market"].replace(" (Futures)","")

        coin=false
        if(symbol+"/"+okex_btc_perp[i]["symbol"]=="OKEx/"+tuka+"-USD-SWAP"){
          coin=true
        }
        data_tb={
          symbol:"OKEx:"+okex_btc_perp[i]["symbol"],
          kigen:"PERP",
          basis:Math.round(okex_btc_perp[i]["basis"]*-10000)/10000+"%",
          price:okex_btc_perp[i]["price"],
          spot:Math.round(okex_btc_perp[i]["index"]*1000)/1000,
          fr:okex_btc_perp[i]["funding_rate"]+"%",
          coin:coin,
          url:"https://www.okex.com/account/register?flag=activity&channelId=1857467"
        }
        this.okex_list.push(data_tb)
      }

      okex_btc_perp = all_data.filter(
        item =>
          item.index_id === "OkexSwap-"+tuka &&
          item.market==="OKEx (Futures)" &&
          item.contract_type== "futures" &&
          item.expired_at!=null
        )
        for(i=0; i<okex_btc_perp.length; i++){
          if(okex_btc_perp[i]["symbol"].indexOf("USDT")==-1){
            coin=true
          }else{
            coin=false
          }
          data_tb={
            symbol:"OKEx:"+okex_btc_perp[i]["symbol"],
            kigen:okex_btc_perp[i]["symbol"].substr( -4 ),
            basis:Math.round(okex_btc_perp[i]["basis"]*-10000)/10000+"%",
            price:okex_btc_perp[i]["price"],
            spot:Math.round(okex_btc_perp[i]["index"]*1000)/1000,
            fr:okex_btc_perp[i]["funding_rate"]+"%",
            coin:coin,
            url:"https://www.okex.com/account/register?flag=activity&channelId=1857467"
          }
          this.binance_list.push(data_tb)
        }


      //bybit
      var bybit_btc_perp = all_data.filter(
        item =>
        item.index_id === tuka &&
        item.market==="Bybit"
        )
      for(i=0; i<bybit_btc_perp.length; i++){

        coin=false
        if(bybit_btc_perp[i]["market"]+"/"+bybit_btc_perp[i]["symbol"]=="Bybit/"+tuka+"USD"){
          coin=true
        }
        data_tb={
          symbol:"Bybit:"+bybit_btc_perp[i]["symbol"],
          kigen:"PERP",
          basis:Math.round(bybit_btc_perp[i]["basis"]*-10000)/10000+"%",
          price:bybit_btc_perp[i]["price"],
          spot:Math.round(bybit_btc_perp[i]["index"]*1000)/1000,
          fr:bybit_btc_perp[i]["funding_rate"]+"%",
          coin:coin,
          url:"https://www.bybit.com/ja-JP/invite?ref=gO81D"
        }
        this.bybit_list.push(data_tb)
      }
    }
  },
};
</script>

<style scope>

.v-application a {
  color: #fff !important;
}

a .v-icon.v-icon {
  font-size: 14px;
}

#data-tbl2 table th {
    background: #505050;
}

#data-tbl2 .v-text-field.v-text-field--enclosed .v-text-field__details {
    display: none;
}

@media screen and (max-width:599px) {

  #data-tbl2 table td:nth-child(1) {
    background: #253445 !important;
    position: relative;
  }
}
</style>