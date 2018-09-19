<template>
  <div class="organize-register">
    OrganizeRegister
  </div>
</template>

<script>
export default {
  components: {
  },
  methods: {
    toLogin: function () {
      this.$dispatch('goLogin')
    },
    toForget: function () {
      this.$dispatch('goForget')
    }
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'ProductPage!'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.organize-register {
  height: 100%;
  width: 100%;
}

</style>
