<template>
  <div class="item">
    <h3 class="tag-title">{{tagTitle}}</h3>
    <div v-if="articleData.length === 0" class="no-data">该类型的文章已删除！</div>
    <ul v-else :class="isMobile ? 'ul_m' : ''">
      <li class="item-li overflow" v-for="(item, index) in articleData" :key="index">
        <a :href="`/article/${item._id}`">
          <div class="__lt" :class="isMobile ? '__lt_m' : ''">
            <h3 class="title cursor">{{item.title}}</h3>
            <div class="cont"><span class="inline-b _wrap">{{item.summary}}</span></div>
            <div class="info" v-if="articleData.length !== 0">
              <span class="time"><i class="iconfont icon-shijian"></i>{{item.beginDate}}</span>
              <span class="visit inline-b"><i class="iconfont icon-yanjing"></i>{{item.visit || '1'}}{{!isMobile ? '次浏览' : ''}}</span>
              <br v-if="isMobile">
              <span class="like-span inline-b"><i class="iconfont icon-xin"></i>{{item.like || 0}}</span>
              <span class="comment inline-b"><i class="iconfont icon-icon_huifu-mian"></i>{{ item.comments ? item.comments.length : 0 }}</span>
              <span class="tag inline-b"><i class="iconfont icon-icontag"></i>{{item.tag || '其他'}}</span>
            </div>
          </div>
          <div class="__rt">
            <img v-lazy="item.imgSrc">
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
  import Api from '~/utils/api';
  import _ from 'lodash';
  import {  mapState } from 'vuex'
  export default {
    middleware: 'configInit',
    layout: 'article',
    head() {
      return {
        title: '文章',
        meta: [
          { hid: 'keywords', name: 'keywords', content: '文章列表'},
          { hid: 'description', name: 'description', content: '蒋少川的个人博客，一名前端攻城狮' }
        ]
      }
    },
    async asyncData({params}) {
      let reqParams = {
        type: '1',
        tag: params.id
      }
      return Api.getArticleList(reqParams)
        .then(res => {
          if (res.status === 200 && res.data.data && res.data.data.list) {
            let articleData = res.data.data.list;
            let tagTitle = params.id === '全部' ? '热门文章：' : `${params.id} 相关的文章：`;
            return { articleData, tagTitle}
          }
      }).catch (err => {
        console.log('报错了啊')
      })
    },
    data() {
      return {
        articleData: [1],
        tagTitle: '',
      }
    },
    computed: {
      ...mapState(['isMobile']),
    },
    mounted() {
      this.$store.dispatch("getConfigList");
    },
    methods: {
      // getArticleList() {
      //   let reqParams = {
      //     type: '1',
      //     tag: this.$route.params.id
      //   }
      //   Api.getArticleList(reqParams)
      //     .then(res => {
      //       if (res.status === 200 && res.data.data && res.data.data.list) {
      //         this.articleData = res.data.data.list;
      //         this.tagTitle = `${this.$route.params.id} 相关的文章：`;
      //       }
      //   }).catch (err => {
      //     console.log('报错了啊')
      //   })
      // }
    },
  } 
</script>

<style scoped lang="scss">
  .item {
    .tag-title {
      font-weight: bold;
      margin: 20px 0 0;
      color: #336;
      font-size: 20px;
    }
    .no-data {
      color: goldenrod;
      padding-top: 50px;
      text-align: center;
    }
    ul, li {
      padding: 0;
    }
    a {
      color: inherit;
    }
    .ul_m {
      margin: 0;
    }
    .iconfont {
      font-size: 12px;
      margin-right: 5px;
      color: #b4b4b4;
      font-weight: bold;
      &.icon-yanjing {
        font-size: 17px;
        position: relative;
        top: 2px;
      }
    }
    .item-li {
      padding: 15px 0;
      background: #fff;
      position: relative;
      border-bottom: 1px solid #f0f0f0;
      .__lt {
        padding-right: 150px;
        &.__lt_m {
          padding-right: 135px;
        }
        .title {
          text-align: left;
          font-size: 17px;
          color: #332;
          font-weight: bold;
          line-height: 1.5;
          margin: 10px 0;
          &:hover {
            color: #409EFF;;
          }
        }
        .cont {
          margin-bottom: 15px;
          color: #666;
          ._wrap {
            font-size: 13px;
            color: #555;
            line-height: 1.8;
          }
        }
        .info {
          font-size: 12px;
          color: #888;
          span {
            margin-top: 3px;
          }
          .visit {
            margin: 0 13px;
          }
          .like-span {
            margin-right: 13px;
            .icon-xin {
              font-size: 14px;
            }
          }
          .comment {
            margin-right: 16px;

          }
          .tag {
            .icon-tag {
              margin-right: 6px;
            }
          }
        }
      }
      .__rt {
        position: absolute;
        top: 50%;
        right: 0;
        margin-top: -47px;
        width: 130px;
        height: 94px;
        img {
        border-radius: 1px;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>