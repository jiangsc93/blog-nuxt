<template>
  <div class="item">
    <ul>
      <li class="item-li overflow">
        <h5 class="title cursor"><span class="tit">{{item.title}}</span></h5>
        <div class="info fl">
          <span class="time"><i class="iconfont icon-shijian"></i>{{item.date}}</span>
          <span class="visit inline-b"><i class="iconfont icon-yanjing"></i>{{item.visit || '1'}}次浏览</span>
          <span class="tag inline-b"><i class="iconfont icon-icontag"></i>{{item.tag || '其他'}}</span>
        </div>
        <div class="cont"><div class="inline-b _wrap" v-html="item.content"></div><span class="view-all">[<span class="all" @click="onRead(item, index)">阅读全文</span>]</span></div>
      </li>
    </ul>
  </div>
</template>

<script>
  import Api from '~/utils/api'
  export default {
    props: ['articleItemData'],
    data() {
      return {
        item: {}
      }
    },
    asyncData ({ params, error }) {
      return Api.newsOne(params.id)
          .then((res) => {
          return { item: res.data }
        }).catch (err => {
          console.log('报错了啊')
      })
    },
    methods: {
      
    }
  } 
</script>

<style scoped lang="scss">
  .item {
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
    .item-li {
      padding: 10px 20px;
      border-radius: 4px;
      background: #fff;
      margin-bottom: 20px;
      .title {
        font-size: 16px;
        color: #000;
        font-weight: bold;
        line-height: 1.5;
        margin: 10px 0;
        border-bottom: 1px solid #ddd;
        .tit:hover {
          color: red;
        }
      }
      .cont {
        ._wrap {
          font-size: 13px;
        }
        .view-all {
          color: $blue1;
          margin-left: 8px;
          cursor: pointer;
          .all {
            font-size: 13px;
          }
        }
      }
      .info {
        font-size: 13px;
        color: #666;
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
  }
</style>