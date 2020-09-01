<template>
  <div class="APIcall_container">
    <input class="text" type="text" v-model="qu" @keyup.enter="exe" />
    <input class="submit" type="submit" value="APIcall" @click="exe" />
  </div>
</template>

<script>
import axios from "axios"

export default {
  data() {
    return {
      qu: "",
    }
  },

  methods:{
    async exe() {
      // $emit >> 任意のタイミングでイベントを発生させる
      this.$emit("loadStart")
      const { data } = await axios.get(`https://qiita.com/api/v2/users/${this.qu}/items?per_page=100`);
      this.$emit("loadComplete", { results: data})
    },
  },
};
</script>

<style scope>
.APIcall_container{
  display: flex;
  justify-content: center;
  height: 70px;
  padding: 20px;
  background-color: #35495e;
  box-sizing: border-box;
  }

  .text{
    width: 50%;
    max-width: 300px;
    padding: .5em;
    border: none;
  }

  .submit{
    padding: .5em 2em;
    margin-left: 10px;
    color: #fff;
    background-color: #42b883;
    border: none;
    border-radius: 20px;
  }
</style>
