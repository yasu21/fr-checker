<template>
<div id="data-tbl">
  <v-card max-width="90%" height="600px" class="mx-auto" raised v-if="error">
    <v-card-title>Error Try Again</v-card-title>
    <div class="APIcall_container">
      <v-btn color="primary" @click="exe" width="247px" height="50px" class="font-weight-bold float-right"
        :disabled="wait">
        <v-icon left>mdi-refresh-circle</v-icon> Reload
      </v-btn>
    </div>
  </v-card>

  <v-card max-width="90%" class="mx-auto" raised v-if="error==false">
    <v-card-title>FTX-Funding Rate Data</v-card-title>
    <v-spacer></v-spacer>

    <div class="ore">
      <OreChart :chart-data="datacollection" :options="options" />
    </div>

    <v-card-title>
      <div class="pc">
        <span class="green2 pc" @click="switch_pc">
          <v-icon small>mdi-arrow-up</v-icon>Low to High
        </span>
        <span class="red2 pc" @click="switch_pc">
          <v-icon small>mdi-arrow-down</v-icon>High to Low
        </span>
        <br>
        <v-icon>mdi-checkbox-marked-outline</v-icon> Check and display chart
      </div>

      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details clearable>
      </v-text-field>
      <v-spacer></v-spacer>
      <div class="APIcall_container pc600">
        <v-btn color="primary" @click="exe" width="247px" height="50px" class="font-weight-bold float-right"
          :disabled="wait">
          <v-icon left>mdi-refresh-circle</v-icon> Reload
        </v-btn>
      </div>

      <div class="sp600">
        <v-row justify="center">
          <v-col>
            <v-btn color="primary" @click="exe" height="40px" class="font-weight-bold float-right" :disabled="wait"
              block>
              <v-icon left>mdi-refresh-circle</v-icon> Reload
            </v-btn>
          </v-col>
          <v-col>
            <v-btn color="#ee6560" @click="switch_sp" class="font-weight-bold" block height="40px">
              <v-icon small>mdi-arrow-up</v-icon>
              <v-icon small left>mdi-arrow-down</v-icon>
              Switch DESC and ASC
            </v-btn>
          </v-col>
        </v-row>
      </div>

    </v-card-title>

    <Loading class="loading" v-show="loadProgress"></Loading>
    <v-data-table
    :sort-by="sortBy"
    :items-per-page=15
    :headers="headers"
    :items="rate_data"
    :search="search"
    fixed-header
    height="auto" class="elevation-1"
    :single-select="singleSelect"
    v-model="selected"
    show-select
    item-key="name"
    :footer-props="footerProps"
    sort-desc must-sort>
    <template v-slot:[`item.next`]="{ item }">
      <span v-if="item.next=='loading'">
        <v-progress-circular indeterminate color="white" size="20" width="2"></v-progress-circular>
      </span>
      <span v-else class="ok">{{item.next}}</span>
    </template>
    </v-data-table>

  </v-card>

</div>
</template>

<script>
import axios from "axios"
import Loading from '@/components/Loading';
import OreChart from "./OreChart.js";

export default {
  name: "API",
  data() {
    return {
      search: '',
      resurl: "",
      nexturl:"",
      key:null,
      headers: [{
          text: 'Pair',
          align: 'start',
          sortable: true,
          value: 'name',
          width:"18%",
        },
        {
          text: 'Next',
          value: 'next'
        },
        {
          text: '8h Sum',
          value: 'h8_sum'
        },
        {
          text: '24h Avg',
          value: '1d_avg'
        },
        {
          text: '3days Avg',
          value: '3d_avg'
        },
        {
          text: '7days Avg',
          value: '7d_avg'
        },
      ],

      loadProgress: false,
      rate_data: [],
      count: 0,
      get: "",
      wait: false,
      error: false,
      singleSelect: true,
      selected: [{
        "name": "Please Select Pair",
        "rate": [0, 0, 0, 0]
      }],
      datacollection: { labels:[], datasets: [] },
      options: null,
      sortBy: 'h8_sum',
      footerProps: {'items-per-page-options': [10,20,30,50,-1]},
    }
  },
  components: {
    Loading,
    OreChart,
  },
  created() {
    this.resurl = process.env.VUE_APP_URL
    this.nexturl = process.env.VUE_APP_NEXT
    this.key=process.env.VUE_APP_KEY
  },
  async mounted() {
    await this.exe();
    this.click_1()
  },
  computed: {
    pair_name() {
      var pair = this.selected;
      if (!pair.length) {
        return "Please Select Pair";
      } else {
        return this.selected[0]["name"];
      }
    },
    pair_rate() {
      return this.selected[0]["rate"];
    },
    pair_range() {
      var count = this.selected[0]["rate"].length + 1;
      var range = [];
      for (let i = 1; i < count; i++) {
        range.push("-" + i + "h");
      }
      var range1 = range.reverse();

      return range1;
    }

  },
  watch: {
    pair_name: function () {
      this.fillData();
    }
  },
  methods: {
    async get_db(url){
      let res
      const header={"Key":this.key}
      await axios.get(url, { headers: header })
      .then(response => {
        res = response.data
      })
      .catch(error => {
        console.log(error);
        res=null
      })
      return res
    },
    get_next(){
      this.rate_data.map(async r=>{
        const url=this.nexturl+"?name="+r.name
        const res=await this.get_db(url)
        r.next=(res)? res[r.name] : "error" ;
        return r
      })
    },
    async exe() {
      this.error = false;
      this.wait = true;
      //this.rate_data = [];
      this.$emit("loadStart")
      this.loadProgress = true;
      const res=await this.get_db(this.resurl)
      if(res){
        const count = Object.keys(res).length;
        if (count > 1) {
          this.rate_data=res
        }
        this.get_next()
      }else{
        this.wait = false
        this.loadProgress = false;
        this.error = true;
      }
      //window.scrollTo({top: 20,behavior: "smooth"});
      this.loadProgress = false;
      setTimeout(() => (this.wait = false), 1000);
    },
    click_1(){
      const ck = document.getElementsByClassName('v-data-table__checkbox');
      if(ck){
        ck[0].click();
      }
    },
    fillData() {
      window.scrollTo(0, 50);
      this.datacollection = {
        labels: this.pair_range,
        datasets: [{
          label: this.pair_name,
          data: this.pair_rate,
          backgroundColor: "#fff",
          borderColor: '#4db872',
          fill: false,
          pointRadius: 2,
          pointBorderWidth: "1px"
        }]
      };
      this.options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: "top",
          labels: {
            fontColor: "#fff"
          }
        },
        layout: {
          left: 0,
          right: 0,
          top: 10,
          bottom: 100
        },
        scales: {
          yAxes: [{
            gridLines: {
              color: "#303030",
              zeroLineColor: "#7a7a7a"
            },
            ticks: {
              beginAtZero: false,
              //min: -0.1,
              //max: 0.1,
              fontColor: "#fff"
            }
          }],
          xAxes: [{
            gridLines: {
              display: true,
              color: "#303030"
            },
            ticks: {
              fontColor: "#fff",
              borderColor: "#303030",
              color: "#fff",
              maxTicksLimit: 7
            }
          }]
        }
      }
    },
    switch_pc(){
      let tgt = document.getElementsByClassName("active desc");
      (tgt.length>0)? tgt[0].click() : null;
      tgt = document.getElementsByClassName("active asc");
      (tgt.length>0)? tgt[0].click() : null;
    },
    switch_sp() {
      let tgt = document.getElementsByClassName("v-chip__content");
      (tgt.length>0)? tgt[0].click() : null;
    },
  },
};
</script>

<style scoped>
.APIcall_container {
  display: flex;
  justify-content: center;
  height: 70px;
  padding: 20px 0;
  box-sizing: border-box;
}

.text {
  width: 50%;
  max-width: 300px;
  padding: .5em;
  border: none;
}

#data-tbl {
  padding-bottom: 70px;
}

#data-tbl table th {
  background: #505050;
}


#data-tbl table th,
#data-tbl table td {
  text-align: center !important;
}

.v-application--wrap {
  background-color: #303030;
}

.theme--dark.v-data-table {
  padding: 0 16px
}

.ore {
  width: 100%;
  display: block;
  margin: 0 auto;
}

#line-chart {
  width: 95% !important;
  height: 320px !important;
  margin: 0 auto;
}

.green2 {
  background: #4db872 !important;
  margin-right: 10px;
  padding: 3px 10px 3px 5px;
  font-size: 16px !important;
  cursor: pointer;
}

.red2 {
  background: #ee6560 !important;
  padding: 3px 10px 3px 5px;
  font-size: 16px !important;
  cursor: pointer;
}

@media screen and (min-width:780px) {
  #data-tbl table {
    table-layout: fixed;
  }

  .asc {
    background: #4db872 !important;
  }

  .desc {
    background: #ee6560 !important;
  }

  .sp {
    display: none;
    margin-top: 5px;
  }

  #data-tbl table th {
    border-bottom: 1px solid #fff !important;
  }
}

@media screen and (max-width:779px) {
  #line-chart {
    width: 97% !important;
    height: 250px !important;
  }

  .v-card {
    max-width: 95% !important;
  }

  .pc {
    display: none;
  }

  .v-data-table-header__icon {
    opacity: 1 !important;
  }

  .sp {
    margin-top: 10px;
    margin-left: 10px;
    font-size: 16px !important;
  }
}

@media screen and (max-width:599px) {

  #data-tbl table td:nth-child(1),
  #data-tbl table td:nth-child(2) {
    background: #253445 !important;
    position: relative;
  }

  #data-tbl table td:nth-child(1) .v-data-table__mobile-row__cell::before {
    content: "Show Chart";
    position: absolute;
    top: 14px;
    right: 30px;
    z-index: 7;
  }


  #data-tbl table td:nth-child(2) .v-data-table__mobile-row__header {
    display: none;
  }

  #data-tbl table td:nth-child(2) .v-data-table__mobile-row__cell {
    position: absolute;
    top: -15px;
    font-weight: bold;
    font-size: 16px;
  }

  #data-tbl .v-data-table .v-data-table__mobile-row {
    height: initial;
    min-height: 27px;
  }

  #data-tbl .v-simple-checkbox {
    position: absolute;
    top: 10px;
    right: 110px;
    z-index: 7;

  }

  #data-tbl {
    padding-bottom: 70px;
  }

  .theme--dark.v-list {
    background: #505050 !important;
  }

  .pc600 {
    display: none;
  }

  .sp600 {
    width: 90%;
    margin: 0 auto;
  }
}

@media screen and (min-width:600px) {
  .sp600 {
    display: none;
  }

  #data-tbl .v-data-table-header th:nth-child(1) {
    width: 36px !important;
    padding: 0 0 0 5px !important;
  }

  #data-tbl .v-data-table-header th:nth-child(1)::after {
    content: "Chart"
  }
}

@media screen and (max-width:480px) {
  .APIcall_container {
    margin-left: 10px;
  }
}

</style>