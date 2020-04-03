<template>
  <div class="page-alide">
    侧边栏
  </div>
</template>

<script>
  import Api from '~/utils/api';
  import _ from 'lodash';
  import {  mapState } from 'vuex'
  export default {
    props: {

    },
    data() {
      return {
        
      }
    },
    computed: {
      ...mapState(['isMobile']),
    },
    mounted() {
      
    },
    methods: {
      
    },
  } 
</script>

<style scoped lang="scss">
  
</style>