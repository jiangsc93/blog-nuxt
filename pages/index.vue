<template>
  <div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: '知否 - 一个开发者分享的平台',
      meta: [
        { hid: 'description', name: 'description', content: '是一个开发者集聚地，分享技术带给我们的收获和快乐' }
      ],
    }
  },
  data () {
    return {
    }
  },
  mounted() {
    location.href = '/timeline/recommend';
  },
  methods: {
   
  }
}
</script>

<style>

</style>
