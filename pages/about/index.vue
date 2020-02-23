<template>
  <section :class="isMobile ? 'mobile page-container' : 'page-container container pc'">
    <div class="">
      <ul>
        <li class="list-item" v-for="(item, index) in dataList" :key="index">
          <h2 class="title">{{item.title}}</h2>
          <ul class="description">
            <li class="_list" v-for="(x, y) in item.description" :key="y">
              <span>{{x.tit}}</span>
              <span>{{x.cont}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
export default {
  layout: 'front',
  head() {
    return {
      title: '益码凭川',
      meta: [
        { hid: 'description', name: 'description', content: '这是一段描述文字' }
      ]
    }
  },
  data() {
    return {
      dataList: [
        {
          title: '关于我',
          description: [
            {
              tit: '',
              cont: '90后，半路出家从事IT行业，一名前端工程师',
            },
            {
              tit: '',
              cont: '本站主要记录自己日常工作中问题的处理方法、以及技术的分享、工具的使用等等',
            },
          ]
        },
        {
          title: '联系方式',
          description: [
            {
              tit: '微信：',
              cont: '18810926125',
            },
            {
              tit: 'QQ：',
              cont: '348424575',
            },
          ]
        },
        {
          title: '关于博客',
          description: [
            {
              tit: '使用技术：',
              cont: 'vue + nuxt + node 搭建，采用服务端渲染模式',
            },
            {
              tit: '数据库：',
              cont: 'mongoose',
            },
          ]
        },

      ]
    }
  },
  computed: {
    ...mapState(['isMobile'])
  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped>
.page-container {
  &.pc {
    width: 70%;
    margin: 80px auto 20px;
    color: #000;
    background: #fff;
  }
  &.mobile {
    width: 95%;
    color: #000;
    margin: 60px auto 10px;
    padding: 10px;
    background: #fff;
  }
  .list-item {
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid rgba(0, 0, 0, .2);
    &:last-child {
      border: none;
    }
    .title {
      font-size: 26px;
      margin-bottom: 20px;
    }
    .description {
      margin: 0 20px 10px;
      ._list {
        // height: 30px;
        line-height: 30px;
        list-style-type: disc;
      }
    }
  }
}
</style>
