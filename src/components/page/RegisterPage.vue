<template>
  <div class="page">
    <!-- <tab class="tab" active-color="#c32b38" :line-width="2"> -->
     <!-- @on-index-change="indexChange" -->
         <!-- <tab-item :selected="index1 === $index" v-for="item in tabs" :preventtab="true">
         {{item.name}}
         </tab-item>
     </tab> -->
     <div class="title-div">
       注册
     </div>
     <div class="swiper-container">
       <swiper :show-dots="false" :index.sync="slideIndex" height="100%" :prevent-slide="true">
           <swiper-item>
             <first-person></first-person>
           </swiper-item>
           <swiper-item>
             <second-person :usermobile="userPhone"></second-person>
           </swiper-item>
           <swiper-item>
             <third-person></third-person>
           </swiper-item>
           <swiper-item>
             <fourth-person :lists="questions"></fourth-person>
           </swiper-item>
           <swiper-item>
             <fifth-person :fenshu="RISKSCORE" :grade="gradeStyle" :mymsg="myMsg"></fifth-person>
           </swiper-item>
           <swiper-item>
             <organize-register></organize-register>
           </swiper-item>
       </swiper>
    </div>
  </div>
</template>

<script>
import {Tab, TabItem} from 'vux/src/components/tab'
// import api from '../../api'
import Swiper from 'vux/src/components/swiper'
import SwiperItem from 'vux/src/components/swiper-item'
import OrganizeRegister from '../login/OrganizeRegister'
import FirstPerson from '../login/FirstPerson'
import SecondPerson from '../login/SecondPerson'
import ThirdPerson from '../login/ThirdPerson'
import FourthPerson from '../login/FourthPerson'
import FifthPerson from '../login/FifthPerson'
import Questions from '../../questions'
export default {
  components: {
    Tab,
    TabItem,
    Swiper,
    SwiperItem,
    OrganizeRegister,
    FirstPerson,
    SecondPerson,
    ThirdPerson,
    FourthPerson,
    FifthPerson
  },
  ready () {
    // this.slideIndex = 2
  },
  events: {
    'toPrev': function (Index) {
      this.slideIndex = Index - 1
    },
    'toNext': function (Index, msg, msg2, msg3) {
      if (Index === 0) {
        this.userPhone = msg.userMobile
        this.mainMsg = msg
        this.myMsg.userMobile = msg.userMobile
        this.myMsg.password = msg.password
        console.log(this.mainMsg)
        // console.log(this.userPhone)
      } else if (Index === 1) {
        this.mainMsg2 = msg
        this.myMsg.IDType = msg.idType
        this.myMsg.userID = msg.userID
        this.myMsg.userName = msg.userName
        this.myMsg.email = msg.email
        this.myMsg.bankCode = msg.bankCode
        console.log(this.mainMsg2)
      } else if (Index === 2) {
        // this.$dispatch('loading-start', '正在获取数据')
        // this.testGet()
      } else if (Index === 3) {
        this.RISKSCORE = msg
        console.log(this.RISKSCORE)
        this.gradeStyle = msg2
        this.myMsg.rankGrade = msg
        this.myMsg.rankResult = msg3
        // console.log(this.myMsg.rankResult)
        // window.alert(this.gradeStyle)
      }
      this.slideIndex = Index + 1
    },
    'toLogin': function () {
      this.$router.go('/login-home')
    }
  },
  methods: {
    stop (evt) {
      console.log(evt)
    },
    indexChange: function (index) {
      // console.log(index)
      if (index === 1) {
        this.slideIndex = 5
      } else if (index === 0) {
        this.slideIndex = 0
      }
    }
    // testGet: function () {
    //   var me = this
    //   api.getQuestions('userMobile', 'passWord', 'openId', function (result) {
    //     console.log(result)
    //     // console.log(productId)
    //     console.log(result.questions)
    //     me.questions = result.questions
    //     me.$dispatch('loading-end', 'loading')
    //   })
    // }
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'ProductPage!',
      slideIndex: 0,
      tabs: [
        { name: '个人用户' },
        { name: '机构用户' }
      ],
      index1: 0,
      mainMsg: {},
      mainMsg2: {},
      questions: Questions,
      userPhone: '',
      RISKSCORE: 0,
      myMsg: {
        userType: '0',
        IDType: '',
        userID: '',
        userMobile: '',
        password: '',
        userName: '',
        email: '',
        openID: window.G.openID,
        rankGrade: '',
        rankResult: '',
        bankCode: ''
      },
      gradeStyle: '保守型'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.page {
  height: 100%;
  width: 100%;
  /*background-color: #fff;*/
  padding: 0;
  overflow-y: inherit;
}
.title-div {
  background-color: #e84a3e;
  color: #fff;
  height: 40px;
  width: 100%;
  line-height: 40px;
  text-align: center;
  font-size: 14px;
}
.view-container {
  padding: 0;
}
.swiper-container {
  height: calc(100% - 44px);
  padding: 0;
}
.vux-slider, .vux-swiper, .vux-swiper-item {
  height: 100%;
}
.vux-swiper {
  height: 100%;
}
.vux-swiper-item {
  height: 100%;
  overflow-y: scroll;
}
.vux-swiper-item:first-child {
  background-color: #fff;
  padding: 0 15px;
}
.vux-swiper-item:nth-child(2) {
  background-color: #fff;
}

</style>
