<template>
  <div class="item">
        <h2 class="title">{{item.title}}</h2>
        <div class="info">
          <span class="time"><i class="iconfont icon-shijian"></i>{{item.lastDate}}</span>
          <span class="visit inline-b"><i class="iconfont icon-yanjing"></i>{{item.visit || '1'}}次浏览</span>
          <span class="tag inline-b"><i class="iconfont icon-icontag"></i>{{item.tag || '其他'}}</span>
        </div>
        <div class="cont"><div class="inline-b _wrap" v-html="item.content"></div></div>
  </div>
</template>

<script>
import Api from '~/utils/api'

// import articlePage from '~/components/article/index'
export default {
  layout: 'article',
  head() {
    return {
      title: '益码凭川',
      meta: [
        { hid: 'description', name: 'description', content: '蒋少川的个人博客，一名前端攻城狮' }
      ]
    }
  },
  asyncData ({ params, error }) {
    return Api.articleone(params.id)
        .then((res) => {
        return { item: res.data}
      }).catch (err => {
      console.log('报错了啊')
    })
  },
  data () {
    return {
      item: {
        title: 'dd'
      }
    }
  }
}
</script>

<style lang="scss">
.item {
    padding: 10px 20px 40px;
    border-radius: 4px;
    background: #fff;
    a {
      color: inherit;
    }
    .iconfont {
      font-size: 13px;
      margin-right: 5px;
      color: #555;
      font-weight: bold;
      &.icon-yanjing {
        font-size: 17px;
        position: relative;
        top: 1px;
      }
    }
    .title {
      font-size: 26px;
      color: #000;
      line-height: 1.5;
      margin: 10px 0;
      border-bottom: 1px solid #ddd;
    }
    .cont {
      ._wrap {
        // width: 100%;
        // overflow: scroll;
        font-size: 15px;
      }
    }
    .info {
      font-size: 13px;
      color: #666;
      margin-bottom: 20px;
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
</style>
