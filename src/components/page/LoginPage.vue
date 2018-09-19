<template>
  <div class="page">
    <img src="../../../static/images/logo.png" class="logo-img" />
    <tab class="tab" active-color="#c32b38" :line-width="2" @on-index-change="indexChange">
         <tab-item :selected="index === $index" v-for="item in tabs" >
         {{item.name}}
         </tab-item>
     </tab>
     <div class="swiper-container">
       <swiper :show-dots="false" :index.sync="index" height="100%" :prevent-slide="true">
           <swiper-item>
             <personal></personal>
           </swiper-item>
           <swiper-item>
             <agency></agency>
           </swiper-item>
       </swiper>
    </div>

  </div>
</template>

<script>
import {Tab, TabItem} from 'vux/src/components/tab'
import Swiper from 'vux/src/components/swiper'
import SwiperItem from 'vux/src/components/swiper-item'
import Personal from '../login/Personal'
import Agency from '../login/Agency'
export default {
  components: {
    Tab,
    TabItem,
    Swiper,
    SwiperItem,
    Agency,
    Personal
  },
  events: {
    'goToIndex': function () {
      this.$router.go('/ostone-home')
    }
  },
  methods: {
    test () {
      window.console.log(1)
    },
    indexChange: function (index) {
      this.index = index
    }
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'ProductPage!',
      index: 0,
      tabs: [
        { name: '个人用户' },
        { name: '机构客户' }
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.page {
  height: 100%;
  overflow-y: inherit;
}
.logo-img {
  width: 100%;
}
.vux-tab {
  top: 0;
  width: 100%;
}
.swiper-container {
  overflow-y: scroll;
  height: calc(100% - 247px);
  padding-top: 0;
}
.vux-slider {
  padding: 1px;
  height: 100%;
}
.zhuce-tip {
  position: absolute;
  bottom: 20px;
  text-align: center;
  font-size: 12px;
  left: 0;
  right: 0;
}
</style>
