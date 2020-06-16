<template>
  <footer>
    <div class="copyright">
      益码凭川 © 2019 - {{ currentYear }}
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
    padding: 0 auto 10px;
    margin-top: 20px;
    text-align: center;
    color: #333;
    font-weight: bold;
    text-align: center;
    .copyright {
      font-size: 15px;
    }
    .certificate {
      padding: 5px 0;
      color: #409EFF;
      font-weight: 500;
      font-size: 13px;
    }
  }
</style>
