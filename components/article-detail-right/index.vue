<template>
  <div class="article-detail-right">
    <div class="__author-info">
      <div class="__tit">关于作者</div>
      <div class="__info" @click="toLink(authorInfo._id)">
        <img class="avatar" :src="authorInfo.avatar" alt="不给看">
        <div class="article-info">
          <div class="name" v-if="authorInfo.userName">{{authorInfo.userName}}
            <span class="level" :style="{backgroundColor: levelToColor(authorInfo.level)}">Lv{{authorInfo.level || '1'}}</span>
          </div>
          <div class="des ellipsis" v-if="authorInfo.position || authorInfo.company" :title="authorInfo.position + authorInfo.company">
            {{ authorInfo.position }}
            <span v-if="authorInfo.position && authorInfo.company"> @ </span>
            {{ authorInfo.company }}
          </div>
        </div>
      </div>
      <div class="info-line">
        <div class="line"></div>
      </div>
      <div class="achievement">
        <div class="__like"><span><i class="iconfont icon-dianzan1"></i></span>获得点赞数 {{authorInfo.totalLikes}}</div>
        <div class="__read"><span><i class="iconfont icon-ai-eye"></i></span>获得阅读量 {{authorInfo.totalVisits}}</div>
      </div>
    </div>
    <div class="recommened-articel" v-if="articleList.length > 0">
      <div class="head">相关文章</div>
      <ul>
        <li class="article-item" v-for="(item, index) in articleList" :key="index">
          <a :href="`/article/${item._id}`" v-if="item._id !== $route.params.id">
            <div class="item-title">{{item.title}}</div>
            <div class="item__info">
              <div class="__item"><i class="iconfont icon-dianzan1"></i>{{item.like || '0'}}</div>
              <div class="__item"><i class="iconfont icon-icon_huifu-mian"></i>{{item.comments_num}}</div>
            </div>
          </a>
        </li>
      </ul>
    </div>
    <div v-if="toc" :class="fixed ? 'anchor anchor-fix' : 'anchor'" ref="anchorContent">
      <div class="catalog">目录</div>
      <div class="toc-content" v-html="toc"></div>
    </div>
  </div>
</template>

<script>
  import Api from '~/utils/api'
  export default {
    props: ['toc', 'authorInfo', 'articleList'],
    data() {
      return {
        fixed: false
      }
    },
    mounted() {
      window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        let offsetTop = this.$refs.anchorContent.offsetTop;
        if (scrollTop > offsetTop + 140) {
          this.fixed = true;
          if (scrollTop < 600) {
            this.fixed = false;
          }
        } else {
          this.fixed = false;
        }
        if (scrollTop > 200) {
          this.$store.commit('setHeaderIsShow', false)
        } else {
          this.$store.commit('setHeaderIsShow', true)
        }
      })
    },
    methods: {
      toLink(id) {
        location.href = `/user/${id}`;
      }
    }
  } 
</script>

<style scoped lang="scss">
  .article-detail-right {
    width: 100%;
    .__author-info {
      background: #fff;
      margin-bottom: 20px;
      .__tit {
        height: 40px;
        line-height: 40px;
        padding-left: 15px;
        border-bottom: 1px solid #f2f2f2;
      }
      .__info {
        display: block;
        overflow: hidden;
        padding: 15px;
        cursor: pointer;
        .avatar {
          float: left;
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .article-info {
          padding-left: 57px;
          line-height: 1;
          .name {
            margin: 0 0 13px;
            color: #333;
            font-size: 18px;
            font-weight: bold;
            .level {
              display: inline-block;
              font-size: 10px;
              padding: 2px;
              border-radius: 2px;
              position: relative;
              top: -3px;
              opacity: 0.5;
              margin-left: 3px;
              color: #fff;
            }
          }
          .des {
            width: 157px;
            color: #72777b;
          }
        }
      }
      .info-line {
        text-align: center;
        padding: 0 15px 5px;
        .line {
          height: 1px;
          background: #f1f1f1;
        }
      }
      .achievement {
        padding: 0 15px 8px;
        .__like, .__read {
          padding: 5px 0;
        }
        span {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          width: 24px;
          height: 24px;
          background: rgba(95,158,160, .2);
          border-radius: 50%;
          margin-right: 12px;
          .iconfont {
            font-size: 16px;
            color: $brand-primary;
            &.icon-ai-eye {
              font-size: 17px;
            }
          }
        }
      }
    }
    .recommened-articel {
      background: #fff;
      .head {
        padding-left: 15px;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #f1f1f1;
      }
      .article-item {
        a {
          display: block;
          width: 100%;
          padding: 8px 15px;
          &:hover {
            background: #fbfbfb;
          }
          .item-title {
            font-size: 13px;
            line-height: 2;
          }
          .item__info {
            .__item {
              display: inline-block;
              margin-right: 15px;
              color: #b2bac2;
              .iconfont {
                margin-right: 5px;
              }
              .icon-dianzan1 {
                font-size: 13px;
                color: #b2bac2;
              }
              .icon-icon_huifu-mian {
                font-size: 12px;
                color: #b2bac2;
              }
            }
          }
        }
      }
    }
    .anchor {
      padding: 0 0 20px;
      .catalog {
        margin: 20px 0 10px;
      }
      a {
        text-decoration: none;
      }
      a:link {
        color: #551a8b;
      }
    }
    .anchor-fix {
      width: 250px;
      position: fixed;
      top: 0;
      padding: 0 0 20px;
    }
  }
</style>