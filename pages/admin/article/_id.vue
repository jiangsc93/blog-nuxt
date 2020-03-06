<template>
  <section class="container">
    <h1>
      {{datas.title}}
    </h1>
    <div class="about">
      作者: {{datas.author}}   第一次发布时间：{{datas.beginDate}}    最后修改时间:{{datas.lastDate}}
    </div>
    <div class="art-body" v-html="datas.content"></div>
  </section>
</template>

<script>
  import Api from '~/utils/api'
  export default {
    middleware: 'auth',
    layout: 'admin',
    head() {
      return {
        title: this.datas.title,
        meta: [
          { hid: 'description', name: 'description', content: '这是网页的描述,' + this.datas.title},
          { hid: 'keywords', name: 'keywords', content: '关键词1,关键词2'}
        ]
      }
    },
    data(){
      return {
        datas: ''
      }
    },
    asyncData ({ params, error }) {
      return Api.getArticleOneAdmin({id: params.id})
          .then(res => {
          return { datas: res.data.data }
        }).catch (err => {
          console.log('报错了啊')
      })
    }
  }
</script>

<style scoped lang="scss">
  h1,.about {
    text-align: center;
    margin-bottom: 15px;
  }
  .container {
    min-height: 60vh;
  }
</style>
