<template>
  <div class="box">
    <ul>
      <li v-for="list in lists" v-bind:class="{'has-over': list.ok}">
        <span class="index">{{list.idx}}</span>
        <span class="name">{{list.name}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    index: Number
  },
  ready () {
    // console.log(this.index)
    for (var i = 0; i < this.index + 1; i++) {
      this.lists[i].ok = true
    }
    // console.log(this.lists[0].ok)
  },
  components: {
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
      lists: [
        {idx: 1, name: '注册信息', ok: false},
        {idx: 2, name: '身份验证', ok: false},
        {idx: 3, name: '特定对象确认', ok: false},
        {idx: 4, name: '风险评估', ok: false},
        {idx: 5, name: '注册完毕', ok: false}
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.box {
  width: 100%;
  /*height: 70px;*/
  background-color: #f0eff5;
}
ul {
  /*height: 70px;*/
  overflow: hidden;
  padding: 20px 0 10px 0;
  background-color: #f0eff5;
  /*border-bottom: 1px solid #ccc;*/
  width: 320px;
  margin: 0 auto;
}
ul li {
  list-style: none;
  float: left;
  width: 20%;
  opacity: .3;
}
li span {
  font-size: 12px;
  text-align: center;
}
.name {
  display: block;
  text-align: center;
  margin: 0 auto;
  font-size: 10px;
}
.index {
  display: block;
  border: 1px solid #000;
  width: 15px;
  height: 15px;
  line-height: 15px;
  text-align: center;
  border-radius: 50%;
  margin: 0 auto;
  position: relative;
}
.index:before {
  content: "";
  position: absolute;
  top: 6px;
  left: -370%;
  width: 370%;
  height: 1px;
  border-bottom: 1px solid #000;
}
li:first-child .index:before{
  width: 0;
  border: none;
}
.has-over {
  opacity: 1;
}
</style>
