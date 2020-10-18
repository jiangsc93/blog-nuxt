<template>
  <div class="page-complain-content" :class="{'pc-page-complain-content': !isMobile}">
    <div class="__lt">
      <write></write>
    
      <jscPlugin :num1="num1" :num2="num2" @getSumFromChild="receiveChildSum"/>
      <div>计算值为:{{sumFromChild}}</div>
    </div>
    <div class="__rt">右边</div>
  </div>
</template>

<script>
import moment from 'moment'
import Api from '~/utils/api'
import { mapState } from 'vuex';
import ArticelList from '../common/articleList';
import Nodata from '../common/nodata';
import Write from './write';
import jscPlugin from 'jsc-plugin'
export default {
  props: ['articleData', 'tagList', 'authorList', 'hasNextPage'],
  data() {
    return {
      num1: 3,
      num2: 5,
      sumFromChild: ''
    }
  },
  computed: {
    ...mapState(['isMobile'])
  },
  components: {
    Write,
    jscPlugin
  },
  mounted() {
  },
  methods: {
   receiveChildSum(sum){ //自定义事件，接收子组件的和
      this.sumFromChild = sum;
    }
  }
}
</script>

<style lang="scss" scoped>
.page-complain-content {
  margin-top: 124px;
  display: flex;
  justify-content: space-between;
  .__lt {
    width: 60%;
  }
  .__rt {
    width: 36%;
  }
}
</style>
