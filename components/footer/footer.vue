<template>
  <footer>
    <div class="copyright">
      益码凭川 © 2019 - {{ currentYear }}  Created by jiangsc
    </div>
    <div class="certificate">(渝ICP备19001861号-1)</div>
  </footer>
</template>

<script>
import moment from 'moment'
export default {

  data() {
    return {
      currentYear: moment().year()
    }
  }
}

</script>

<style scoped lang="scss">
  footer {
    background: #fff;
    padding: 0 100px 10px;
    margin-top: 20px;
    text-align: center;
    color: #333;
    font-weight: bold;
    text-align: center;
    .copyright {
      font-size: 18px;
    }
    .certificate {
      padding-top: 5px;
      color: #409EFF;
      font-weight: 500;
      font-size: 15px;
    }
  }
</style>
