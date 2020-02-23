<template>
  <div class="item">
    <ul>
      <li class="item-li overflow" v-for="(item, index) in articleData.rows" :key="index">
        <h5 class="title cursor"><span @click="onRead(item, index)" class="tit">{{item.title}}</span></h5>
        <div class="cont"><span class="inline-b _wrap">{{item.summary}}</span><span class="view-all">[<span class="all" @click="onRead(item, index)">阅读全文</span>]</span></div>
        <div class="info fr">
          <span class="time"><i class="iconfont icon-shijian"></i>{{item.lastDate}}</span>
          <span class="visit inline-b"><i class="iconfont icon-yanjing"></i>{{item.visit || '1'}}次浏览</span>
          <span class="tag inline-b"><i class="iconfont icon-icontag"></i>{{item.tag || '其他'}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import Api from '~/utils/api'
  export default {
    layout: 'article',
    data() {
      return {
        articleData: '',
      }
    },
    asyncData ({ params, error }) {
      return Api.articlelist(params.id, 10)
          .then((res) => {
          return { articleData: res.data}
        }).catch (err => {
        console.log('报错了啊')
      })
    },
    methods: {
      onRead(item, index) {
        let editData = {}
        Object.assign(editData, this.articleData.rows[index])
        let visit = this.articleData.rows[index].visit || 0
        visit += 1
        editData.visit = visit
        Api.addVisit(item._id, editData, 'visit')
          .then((res) => {
            location.href = `/article/${item._id}`
            // Util.UI.toast('文章修改成功!', 'success')
          }).then((res) => {
            // this.$router.push('/news/list/1')
          }, err => {
              // Util.UI.toast('修改文章失败!', 'error')
          })
      },
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
          line-height: 1.6;
        }
        .view-all {
          color: $blue1;
          margin-left: 8px;
          cursor: pointer;
          &:hover {
            color: #5A94D0;
          }
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