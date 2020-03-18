<template>
  <div class="main">
    <index-header></index-header>
    <div class="article-detail-page">
      <nuxt/>
    </div>
    <index-footer></index-footer>
  </div>
</template>
<script>
  import IndexHeader from '~/components/header/backHeader'
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
.article-detail-page {
  max-width: 1200px;
  margin: 60px auto 30px;
  display: flex;
}
</style>

