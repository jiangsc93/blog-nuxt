<template>
  <div>
    <Index></Index>
  </div>
</template>

<script>
import Index from '~/components/index/index.vue'

export default {
  // middleware: 'checkMobile',
  layout: 'index',
  head() {
    return {
      title: '益码凭川',
      meta: [
        { hid: 'description', name: 'description', content: 'jsc' }
      ]
    }
  },
  data () {
    return {
    }
  },
  components: {
    Index
  },
  mounted() {
    
  },
  methods: {
   
  }
}
</script>

<style>

</style>
