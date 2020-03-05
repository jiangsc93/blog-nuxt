<template>
  <section class="container">
    <div>
      <app-logo/>
      <h3>
        欢迎使用'益码凭川'博客后台系统!
      </h3>
      <!-- <h1 class="title">
        文章增删改查系统
      </h1>
      <div class="links">
        <a
          href="/admin/edit"
          class="button--green">发表文章</a>
        <a
          href="/admin/article/list/1"
          class="button--grey">查看文章</a>
      </div> -->
      
    </div>
  </section>
</template>

<script>
import AppLogo from '~/components/AppLogo.vue'

export default {
  middleware: 'auth',
  layout: 'admin',
  head() {
    return {
      title: '这是一个测试Title',
      meta: [
        { hid: 'description', name: 'description', content: '这是一段描述文字' }
      ]
    }
  },
  components: {
    AppLogo
  }
}
</script>

<style scoped>
.container {
  min-height: 78vh!important;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0!important;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 40px;
  color: #35495e;
  letter-spacing: 1px;
}

.links {
  padding-top: 15px;
}
</style>
