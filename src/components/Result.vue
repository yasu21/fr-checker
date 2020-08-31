<template>
  <div>
    <ul class="list">
      <li class="item" v-for="item of sortedItemsByLikes" :key="item.title">
        <a v-bind:href="item.url">
          <div class="item-inner">
            <div class="photo">
              <img class="photo-img" src="https://pbs.twimg.com/profile_images/748042935124492288/knHIR7XC.jpg" alt="item.title" />
            </div>
            <div class="content">
              <p><a class="title" target="_blank">{{ item.title }}</a></p>
            </div>
            <span class="good">{{ item.likes_count }}</span>
          </div>
        </a>
      </li>
    </ul>
    <Loading class="loading" v-show="loadProgress"></Loading>
  </div>
</template>

<script>
import Loading from '@/components/Loading';

export default{
  props: ["items", "loadProgress"],
  components: {
    Loading
  },

  computed:{
    sortedItemsByLikes(){
      return this.items.slice().sort((a, b) => {
        return (a.likes_count < b.likes_count) ? 1 : (a.likes_count > b.likes_count) ? -1 : 0;
      })
    }
  }
}
</script>