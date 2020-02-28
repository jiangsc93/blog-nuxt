<template>
  <div class="main">
    <index-header></index-header>
    <div class="article-detail">
      <nuxt/>
    </div>
    <index-footer></index-footer>
  </div>
</template>
<script>
  import IndexHeader from '~/components/header/indexHeader'
  import IndexFooter from '~/components/footer/footer'
  export default {
    middleware: 'checkMobile',
    components: {
      IndexHeader,
      IndexFooter,
    }
  }
</script>
<style lang="scss" scoped>
.article-detail {
  max-width: 1200px;
  margin: 60px auto 30px;
  min-height: 100vh;
  display: flex;
}
</style>

