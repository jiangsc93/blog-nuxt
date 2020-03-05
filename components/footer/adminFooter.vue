<template>
  <footer>
    <div class="copyright">
      Copyright © 2019 - {{ currentYear }}  益码凭川
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
    padding: 150px auto 10px;
    margin-top: 20px;
    text-align: center;
    // color: #333;
    // font-weight: bold;
    color: rgba(0,0,0,.45);
    text-align: center;
    font-size: 14px;
    .certificate {
      padding: 5px 0 10px;
    }
  }
</style>
