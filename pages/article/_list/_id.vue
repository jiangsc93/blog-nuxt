<template>
  <div class="item">
    <h3 class="tag-title">{{tagTitle}}</h3>
    <ul>
      <li class="item-li overflow" v-for="(item, index) in articleData" :key="index">
        <a :href="`/article/${item._id}`" target="" alt>
          <div class="__lt">
            <h3 class="title cursor">{{item.title}}</h3>
            <div class="cont"><span class="inline-b _wrap">{{item.summary}}</span></div>
            <div class="info">
              <span class="time"><i class="iconfont icon-shijian"></i>{{item.beginDate}}</span>
              <span class="visit inline-b"><i class="iconfont icon-yanjing"></i>{{item.visit || '1'}}次浏览</span>
              <span class="tag inline-b"><i class="iconfont icon-icontag"></i>{{item.tag || '其他'}}</span>
            </div>
          </div>
          <div class="__rt">
            <img src="../../../assets/images/user_logo.png" alt="文章封面">
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
  import Api from '~/utils/api'
  export default {
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
    data() {
      return {
        articleData: [],
        tagTitle: '',
      }
    },
    asyncData ({ params, error }) {
      let reqParams = {
        type: '1',
        tag: params.id,
        pageIndex: 1,
        pageSize: 10
      }
      return Api.getArticleList(reqParams)
          .then(res => {
            if (res.status === 200 && res.data.data && res.data.data.list) {
              return { articleData: res.data.data.list, tagTitle: `${params.id} 相关的文章：`}
            }
        }).catch (err => {
        console.log('报错了啊')
      })
    },
  } 
</script>

<style scoped lang="scss">
  .item {
    .tag-title {
      font-weight: bold;
      margin: 20px 0;
      color: #336;
      font-size: 20px;
    }
    ul, li {
      padding: 0;
    }
    a {
      color: inherit;
    }
    .iconfont {
      font-size: 12px;
      margin-right: 5px;
      color: #666;
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
        .title {
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
          .visit {
            margin: 0 13px;
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