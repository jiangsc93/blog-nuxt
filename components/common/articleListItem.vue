<template>
  <div class="page-article-list">
    <div class="content-item" @click="toLink(item)">
      <div class="_lt">
        <div class="_head">
          <span class="author">
            {{item.author || '作者'}}
          </span>
          -
          <span v-text="formatTime(item.beginDate)"></span>
          -
          <span class="tag">
            {{item.tag}}
          </span>
        </div>
        <div class="_content ellipsis">
          <span class="_title">
            <a :href="`/article/${item._id}`">
              {{item.title}}
            </a>
          </span>
        </div>
        <div class="summary ellipsis" v-if="showSummary">
          <span class="_summary">
            <a :href="`/article/${item._id}`">
              {{item.summary}}
            </a>
          </span>
        </div>
        <div class="footer">
          <div class="like">
            <i class="iconfont icon-dianzan1"></i>
              {{item.like}}
            </div>
          <div class="comments">
            <i class="iconfont icon-icon_huifu-mian"></i>
            {{item.comments_num}}
          </div>
        </div>
      </div>
      <div class="_rt" v-if="item.imgSrc">
        <img :src="item.imgSrc" alt="图片">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['item'],
    data() {
      return {
        showSummary: false
      }
    },
    mounted() {
    },
    methods: {
      toLink(item) {
        location.href = `/article/${item._id}`;
      }
    }
  } 
</script>

<style scoped lang="scss">
.page-article-list {
  .content-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 20px;
    background: #fff;
    border-bottom: 1px solid #f2f2f2;
    cursor: pointer;
    &:hover {
      background: #fcfcfc;
    }
    ._lt {
      // flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 75%;
      ._head {
        font-size: 13px;
        color: $font-color1;
        .author:hover {
          color: $brand-primary;
        }
        .tag:hover {
          color: $brand-primary;
        }
      }
      a:visited {
        color: #909090;
      }
      ._content {
        font-size: 16px;
        color: #333;
        font-weight: bold;
        line-height: 2;
        max-width: 100%;
        ._title {
          &:hover {
            text-decoration: underline;
          }
        }
      }
      .summary {
        font-size: 13px;
        color: #5b6169;
        line-height: 2.5;
        max-width: 100%;
      }
      .footer {
        padding-top: 5px;
        color: $font-color1;
        font-size: 12px;
        .like {
          display: inline-block;
          margin-right: 10px;
          .iconfont {
            font-size: 13px;
          }
        }
        .comments {
          display: inline-block;
          .iconfont {
            font-size: 11px;
          }
        }
      }
    }
    ._rt {
      width: 10rem;
      height: 7rem;
      margin-left: 1rem;
      // flex: 0 0 auto;
      img {
        width: 100%;
        height: 100%;
        border-radius: 3px;
      }
    }
  }
}
</style>