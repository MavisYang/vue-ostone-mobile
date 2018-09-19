<template>
  <div class="page">
    <div class="swiper-container">
      <swiper :show-dots="false" :index.sync="pswIndex" height="100%" :prevent-slide="true">
          <swiper-item>
            <first-psw></first-psw>
          </swiper-item>
          <swiper-item>
            <third-psw :mobile="userMobile" :token="token"></third-psw>
          </swiper-item>
      </swiper>
   </div>
  </div>
</template>
<script>
import Swiper from 'vux/src/components/swiper'
import SwiperItem from 'vux/src/components/swiper-item'
import FirstPsw from '../login/FirstPsw'
import ThirdPsw from '../login/ThirdPsw'
export default {
  components: {
    Swiper,
    SwiperItem,
    FirstPsw,
    ThirdPsw
  },
  ready () {
  },
  events: {
    'pswToNext': function (pswIdx, msg, msg1) {
      if (pswIdx === 0) {
        this.userMobile = msg
        this.token = msg1
      }
      this.pswIndex = pswIdx + 1
    }
  },
  methods: {
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'ProductPage!',
      pswIndex: 0,
      userMobile: '',
      token: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.page {
  height: 100%;
  width: 100%;
  overflow-y: inherit;
  background-color: #fff;
}
.view-container {
  padding: 0;
}
.swiper-container {
  height: 600px;
}
.vux-slider, .vux-swiper, .vux-swiper-item {
  height: 100%;
}
.vux-swiper {
  height: 100%;
}
.vux-swiper-item {
  height: 100%;
}

</style>
