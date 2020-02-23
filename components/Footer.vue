<template>
  <footer>
    <div>
      © 2019 - {{ currentYear }}  Created by 蒋少川
    </div>
    <div>渝ICP备19001861号-1</div>
  </footer>
</template>

<script>
import moment from 'moment'
export default {

  data() {
    return {
      currentYear: moment().format('YYYY')
    }
  }
}

</script>

<style scoped lang="scss">
  footer {
    background: #222;
    padding: 10px 100px;
    margin-top: 20px;
    text-align: center;
    color: #aaa;
    div {
      text-align: center;
    }
  }
</style>
