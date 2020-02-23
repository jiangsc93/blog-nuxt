<template>
  <div class="page-article">
    <div class="__lt">
      <!-- 导航标签 -->
      <nav>
        <i class="iconfont icon-tag"></i>
        <ul class="nav-ul">
          <li class="nav-li cursor"
            :class="activeIndex===index?'active':''"
            v-for="(item, index) in navList"
            :key="index"
            @click="onChoose(item, index)">{{item}}
          </li>
        </ul>
      </nav>
      <!-- <article-list :articleData="articleData"></article-list> -->
      <article-item :articleItemData="articleItemData"></article-item>
      <my-page v-on:page-change="onPageChange" :pageSize="pageSize" :total="records" :currentPage="currentPage"></my-page>
    </div>
    <div class="__rt">
      <div class="item">
        <h2 class="title">关于我</h2>
        <ul>
          <li v-for="(item, index) in aboutList" :key="index">
            <span>{{item.tit}}</span>
            <span>{{item.cont}}</span>
          </li>
        </ul>
      </div>
      <div class="item">
        <h2 class="title">相关标签</h2>
        <div class="cont">
          <span class="tag" v-for="(item, index) in tagsList" :key="index">{{item}}</span>
        </div>
      </div>
   </div>
  </div>
</template>

<script>
import Api from '~/utils/api'
import articleList from './article-list.vue'
import articleItem from './article-item.vue'
import Loading from 'element-ui'
import MyPage from '~/components/PageAction'

export default {

  data() {
    return {
      navList: ['全部', '前端', '数据库', '微信', '开发工具', '其他'],
      aboutList: [
        {tit: '网名：', cont:'益码凭川'},
        {tit: '职业：', cont:'前端工程师'},
        {tit: '邮箱：', cont:'jiangsc93@163.com'},
        {tit: '现居：', cont:'重庆'},
      ],
      tagsList: ['javascript', 'html', 'css', 'jquery', 'nodejs', 'nuxt', '工具', 'git'],
      time: new Date(),
      articleData: {
        records: 0,
        pageSize: 0,
        currentPage: 0,
      },
      loading: false,
      activeIndex: -1,
      records: 0, // 总数据条数
      pageSize: 0, // 分页数
      currentPage: 0, // 当前页
      articleItemData: {}
    }
  },
  components: {
    articleList,
    articleItem,
    Loading,
    MyPage
  },
  mounted() {
    this.onChoose('全部', 0)
    // this.records = this.articleData.records || 0, // 总数据条数
    // this.pageSize = this.articleData.pageSize || 0, // 分页数
    // this.currentPage = this.articleData.currentPage || 0, // 当前页
  },
  methods: {
    onChoose(item, index) {
      if (index === this.activeIndex) return
      this.activeIndex = index
      Api.articlelist(item, 5, 5)
        .then((res) => {
          this.articleData = res.data
        }).catch (err => {
        console.log('报错了啊')
      })
    },
    onPageChange(e) {
      this.$router.push(`/news/list/${e}`)
    }
  }
}
</script>

<style scoped lang="scss">
  .page-article {
    display: flex;
    a {
      color: inherit;
    }
    .__lt {
      width: 900px;
      flex-direction: column;
      nav {
        margin-bottom: 20px;
        padding: 20px;
        background: #fff;
        .icon-tag {
          font-size: 25px;
          color: red;
        }
        .nav-ul, .nav-li {
          display: inline-block;
        }
        .nav-li {
          padding: 0 20px;
          font-size: 17px;
          &.active {
            color: $themeColor;
            font-weight: bold;
          }
          &:hover {
            color: $themeColor;
            font-weight: bold;
          }
        }
      }
    }
    .__rt {
      width: 290px;
      margin-left: 10px;
      flex-direction: column;
      border-radius: 4px;
      .item {
        background: #fff;
        padding: 10px 15px 10px;
        margin-bottom: 10px;
        border-radius: 4px;
        .title {
          font-size: 20px;
          font-weight: bold;
          line-height: 22px;
          padding: 15px 0;
          border-bottom: 1px solid #eaeaea;
        }
        ul {
          margin: 10px 0;
          font-size: 13px;
          li {
            line-height: 22px;
          }
        }
        .cont {
          .tag {
            display: inline-block;
            padding: 4px 10px;
            margin: 10px 10px 0 0;
            border-radius: 4px;
            border: 1px solid #ccc;
            font-size: 13px;
            color: #666;
            cursor: pointer;
            &:hover {
              color: #fff;
              background: #000;
              border-color: #000;
            }
          }
        }
      }
    }
  }
</style>