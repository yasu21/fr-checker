<template>
<div id=data-tbl>

  <v-card max-width="70%" class="mx-auto" raised v-if="error">
      <v-card-title>Error Try Again</v-card-title>
  </v-card>

  <v-card max-width="90%" class="mx-auto" raised v-else>
    <v-card-title>
      FTX-Funding Rate Data
      <v-spacer></v-spacer>
      </v-card-title>

    <div class="ore">
      <OreChart :chart-data="datacollection" :options="options"/>
    </div>

      <v-card-title>
        <div class="pc">
        <span class="green2 pc"><v-icon small>mdi-arrow-up</v-icon>Low to High</span>
        <span class="red2 pc"><v-icon small>mdi-arrow-down</v-icon>High to Low</span>
        <br><v-icon>mdi-checkbox-marked-outline</v-icon> Check and display chart
        </div>

        <v-spacer></v-spacer>
        <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <div class="APIcall_container">
          <v-btn
          color="primary"
          @click="exe(1)"
          width="170px"
          height="50px"
          class="font-weight-bold float-right"
          :disabled="wait">
          <v-icon left>mdi-refresh-circle</v-icon> Refresh</v-btn>
          </div>
          <div class="sp">
            <span class="green2"><v-icon small>mdi-arrow-up</v-icon>Low to High</span>
            <span class="red2"><v-icon small>mdi-arrow-down</v-icon>High to Low</span>
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
    height="600px"
    class="elevation-1"
    :single-select="singleSelect"
    v-model="selected"
    show-select
    item-key="name"
    sort-desc
    must-sort
    ></v-data-table>
  </v-card>

</div>
</template>

<script>
import axios from "axios"
import Loading from '@/components/Loading';
import OreChart from "./OreChart.js";

export default {
  name:"API",
  data() {
    return {
      search: '',
      headers: [
        {
          text: 'Pair',
          align: 'start',
          sortable: true,
          value: 'name',
        },
        { text: 'Next', value: 'next' },
        { text: '24h Sum', value: '1d_sum' },
        { text: '24h Avg', value: '1d_avg' },
        { text: '3days Sum', value: '3d_sum' },
        { text: '3days Avg', value: '3d_avg' },
        ],
      loadProgress:false,
      rate_data:[],
      count:0,
      get:"",
      wait:false,
      error:false,
      singleSelect: true,
      selected:[{
        "name": "Please Select Pair",
        "rate":[0,0,0,0]
        }],
      datacollection: null,
      options: null,
      sortBy:'next'
    }
  },
  components: {
    Loading,
    OreChart
  },
  methods:{
    async exe(a) {
      this.error = false;
      this.wait=true;
      this.rate_data=[];
      // $emit >> 任意のタイミングでイベントを発生させる
      this.$emit("loadStart")
      this.loadProgress=true;
      var url='api';
      await axios.get(url)
      .then(response => {
        this.get = response.data,
        this.count=Object.keys(response.data).length;
        if(this.count >1){
          for (let i = 0; i < this.count; i++) {
            this.rate_data.push(this.get[i])
            }
        }
      })
      .catch(error => {
        console.log(error)
        this.error = true
      })

      window.scrollTo(0,50);
      this.loadProgress=false;

      if(a===0){
      const ck = document.getElementsByClassName('v-data-table__checkbox');
      console.log("koko"+ck[0]);
      ck[0].click();
      }


      setTimeout(() => (this.wait = false), 1000);
    },
    fillData() {
      this.datacollection = {
        labels: this.pair_range,
        datasets: [
          {
            label:this.pair_name,
            data: this.pair_rate,
            backgroundColor: "#fff",
            borderColor: '#4db872',
            fill: false,
            pointRadius:2,
            pointBorderWidth:"1px"
          }
        ]
      };
      this.options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: "top",
          labels:{
            fontColor:"#fff"
            }
        },
        layout: {
          left: 0,
          right: 0,
          top: 10,
          bottom: 100
        },
        scales: {
          yAxes: [
            {
              gridLines: {
                color:"#303030",
              },
              ticks: {
                beginAtZero: false,
                //min: -0.1,
                //max: 0.1,
                fontColor:"#fff"
              }
            }
          ],
          xAxes: [
            {
              gridLines: {
                display:false,
                color:"#303030"
              },
              ticks: {
                fontColor:"#fff",
                borderColor:"#303030",
                color:"#fff",
              }
            }
          ]
        }
      }
    }
  },
  mounted(){
    this.exe(0);
    //this.fillData();
  },
  computed:{
    pair_name(){return this.selected[0]["name"];},
    pair_rate(){return this.selected[0]["rate"];},
    pair_range(){
      var count=this.selected[0]["rate"].length;
      var range = [];
      for (let i = 1; i < count; i++) {
        range.push("-"+i+"h");
        }
      var range1 = range.reverse();
      return range1;
      }

  },
  watch: {
      pair_name: function () {
          this.fillData();
      }
    }

};
</script>

<style scope>
.APIcall_container{
  display: flex;
  justify-content: center;
  height: 70px;
  padding: 20px 0;
  box-sizing: border-box;
  }

  .text{
    width: 50%;
    max-width: 300px;
    padding: .5em;
    border: none;
  }

#data-tbl{
  padding-bottom: 100px;
}

#data-tbl table th{
  background:#505050;
}


#data-tbl table th, #data-tbl table td {
  text-align: center !important;
}

.v-application--wrap {
  background-color:#303030;
}

.theme--dark.v-data-table {
    padding: 0 16px
    }

.ore{
  width:100%;
  display: block;
  margin: 0 auto;
}

#line-chart{
  width:90% !important;
  height: 400px !important;
  margin: 0 auto;
}

.green2{
  background: #4db872 !important;
  margin-right: 10px;
  padding: 3px 10px 3px 5px;
  font-size:16px !important;
  }
.red2{
  background: #ee6560 !important;
  padding: 3px 10px 3px 5px;
  font-size:16px !important;
  }

@media screen and (min-width:780px) {
  #data-tbl table{
  table-layout:fixed;
  }
.asc{
  background: #4db872 !important;
  }
.desc{
  background: #ee6560 !important;
  }
.sp{
  display: none;
  margin-top: 5px;
}

#data-tbl table th{
  border-bottom: 1px solid #fff !important;
}
}

@media screen and (max-width:779px) {
  #line-chart{
  width:95% !important;
  }
  .v-card{
    max-width: 95% !important;
  }
  .pc{
    display:none;
  }
  .v-data-table-header__icon {
    opacity: 1 !important;
  }
.sp{
  margin-top: 10px;
  margin-left: 10px;
  font-size:16px !important;
  }
}

@media screen and (max-width:599px) {
#data-tbl table td:nth-child(1),#data-tbl table td:nth-child(2){
  background: #505050;
}
#data-tbl{
  padding-bottom: 80px;
}
}
@media screen and (max-width:480px) {
.APIcall_container{
  margin-left: 10px;
  }
}


</style>