<template>
  <div class="page-timeline-content" :class="{'pc-page-timeline-content': !isMobile}">
    <!-- 标签列表 -->
    <tagList v-if="$route.params.id && $route.params.id !== 'recommend' && $route.params.id !== 'follow'" :tagList="tagList"></tagList>
    <div class="content-wrap">
      <div :class="isMobile ? 'm__lt' : '__lt'">
        <!-- 导航 热门与最新 -->
        <div class="sort" :class="{'other-sort': $route.params.id !== 'recommend', 'm-other-sort': $route.params.id !== 'recommend' && isMobile, 'm-sort': isMobile}">
          <ul>
            <li class="nav-item"
              :class="{'item-border': index === 0, 'active': isActive(item.eng)}"
              v-for="(item, index) in sortList"
              :key="index"
              @click="onChooseSort(item)">
              {{ item.val }}
            </li>
          </ul>
          <div class="all-users" v-if="isMobile"><a href="/authors">全部用户</a></div>
        </div>
        <!-- 文章列表 -->
        <div v-if="articleData.length > 0" class="content">
          <ArticelList :articleData="articleData"></ArticelList>
          <div v-if="!hasNextPage && articleData.length > 20" class="page-bottom">已经到底啦~</div>
        </div>
        <Nodata v-else></Nodata>
      </div>
      <div v-if="!isMobile" class="__rt">
        <!-- 作者榜 -->
        <div class="recommend-author">
          <header>
            <span>作者推荐<i class="iconfont icon-bangdan"></i></span>
            <a href="/authors">全部<i class="iconfont icon-iconfontjiantou5"></i></a>
          </header>
          <ul>
            <li
              v-for="(item, index) in authorList"
              :key="index">
              <div v-if="index < 3" class="author-item" @click="toLink(item)">
                <img class="_img" :src="item.avatar" alt="头像">
                <div class="_info">
                  <div class="_head">
                    <span class="user-name">
                      {{item.userName}}
                    </span>
                    <span class="level" :style="{backgroundColor:levelToColor(item.level)}">
                      Lv{{item.level}}
                    </span>
                  </div>
                  <div class="_middle" v-if="item.position">
                    <a class="ellipsis" :title="`${item.position} @ ${item.company}`">
                      <span v-if="item.position">{{item.position}}</span>
                      <span v-if="item.company"> @ {{item.company}}</span>
                    </a>
                  </div>
                  <div class="_foot" v-if="item.introduce">
                    <a :title="item.introduce" class="ellipsis">
                      {{item.introduce}}
                    </a>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <!-- 相关链接 -->
        <div class="links">
          <ul>
            <li
              v-for="(item, index) in links"
              :key="index">
              <a class="links-item" :href="item.link">
                <img class="_img" :src="item.imgSrc" alt="图片">
                <div class="_info">
                  {{item.title}}
                </div>
              </a>
            </li>
          </ul>
        </div>
        <!-- 网站信息 -->
        <div class="site-info">
          <ul>
            <li>
               <ul>
                <li><a class="dot" href="javascript:;">关于</a></li>
                <li><a class="dot" href="javascript:;">建议反馈</a></li>
                <li><a href="javascript:;">加入我们</a></li>
              </ul>
            </li>
            <li>
              <a href="http://www.beian.miit.gov.cn">渝ICP备19001861号-1</a>
            </li>
            <li>
              <a href="javascript:;">
                ©2019 - {{currentYear}} By YIMAPINGCHUAN
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Api from '~/utils/api'
import { mapState } from 'vuex';
import tagList from './tagList';
import ArticelList from '../common/articleList';
import Nodata from '../common/nodata';
export default {
  props: ['articleData', 'tagList', 'authorList', 'hasNextPage'],
  data() {
    return {
      links: [
        {
          title: '掘金',
          imgSrc: 'https://b-gold-cdn.xitu.io/v3/static/img/collections.945b9ae.png',
          link: 'https://juejin.im'
        },
        {
          title: '简书',
          imgSrc: 'https://b-gold-cdn.xitu.io/v3/static/img/collections.945b9ae.png',
          link: 'https://www.jianshu.com/'
        },
        {
          title: '知乎',
          imgSrc: 'https://b-gold-cdn.xitu.io/v3/static/img/collections.945b9ae.png',
          link: 'https://www.zhihu.com'
        },
      ],
      currentYear: moment().year(),
      sortList: [
        {
          val: '热门',
          eng: 'popular'
        },
        {
          val: '最新',
          eng: 'newest'
        },
      ]
    }
  },
  computed: {
    ...mapState(['isMobile'])
  },
  components: {
    tagList,
    ArticelList,
    Nodata
  },
  mounted() {
  },
  methods: {
    toLink(item) {
      location.href = `/user/${item._id}`;
    },
    onChooseSort(item) {
      if (this.$route.fullPath.indexOf('tag=') > -1) {
        if (this.$route.fullPath.indexOf('order=') > -1) {
          let index = this.$route.fullPath.indexOf('order=');
          let path = this.$route.fullPath.split('order=')[0];
          location.href = path + 'order=' + item.eng;
        } else {
          location.href = `${this.$route.fullPath}&order=${item.eng}`;
        }
      } else {
        location.href = `${this.$route.path}?order=${item.eng}`;
      }
    },
    isActive(val) {
      if (this.$route.query.order && this.$route.query.order === val) {
        return true;
      } else if (!this.$route.query.order && val === 'popular') {
        return true;
      } else {
        return false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-timeline-content {
  margin-top: 104px;
  &.pc-page-timeline-content {
    margin-top: 124px;
  }
  .content-wrap {
    display: flex;
    justify-content: space-between;
    li {
      list-style: none;
    }
    .m__lt {
      width: 100%;
      .sort {
        padding: 30px 15px 12px;
        &.m-sort {
          display: flex;
          justify-content: space-between;
          padding: 22px 15px 12px;
        }
        &.other-sort {
          padding: 15px 15px 12px;
        }
        &.m-other-sort {
          padding: 10px 15px 12px;
        }
        .nav-item {
          display: inline-block;
          padding: 0 10px;
          font-size: 15px;
          cursor: pointer;
          &.active {
            color: $font-color5;
          }
        }
      }
    }
    .__lt {
      width: 72%;
      .sort {
        padding: 13px 10px;
        border-bottom: 1px solid #f2f2f2;
        background: #fff;
        ul,li {
          padding: 0;
          margin: 0;
        }
        .nav-item {
          display: inline-block;
          padding: 0 10px;
          font-size: 15px;
          cursor: pointer;
          &.active {
            color: $font-color5;
          }
        }
        .item-border {
          border-right: 1px solid #f2f2f2;
        }
      }
      .content {
        ul {
          list-style: none;
          background: #fff;
        }
        .page-bottom {
          margin: 20px 0;
          text-align: center;
        }
      }
    }
    .__lt_m {
      width: 100%;
    }
    .__rt {
      width: 26%;
      display: block;
      .recommend-author {
        background: #fff;
        header {
          display: flex;
          justify-content: space-between;
          font-size: 15px;
          padding: 15px;
          border-bottom: 1px solid #f2f2f2;
          .icon-bangdan {
            color: yellowgreen;
          }
          a {
            position: relative;
            right: -4px;
            font-size: 15px;
            color: $brand-primary;
          }
        }
        .author-item {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding: 10px 20px;
          cursor: pointer;
          &:hover {
            background: #fbfbfb;
          }
          ._img {
            width: 45px;
            height: 45px;
            border-radius: 50%;
          }
          ._info {
            margin-left: 15px;
            width: 68%;
            ._head {
              line-height: 1.3;
              .user-name {
                color: $brand-primary;
                font-size: 13px;
                font-weight: 500;
                &:hover {
                  font-weight: bold;
                }
              }
              .level {
                color: #fff;
                padding: 0 3px;
                margin-left: 3px;
                border-radius: 2px;
                font-size: 11px;
                opacity: 0.5;
              }
            }
            ._middle {
              a {
                display: inline-block;
                max-width: 100%;
                color: $font-color2;
                font-size: 12px;
                line-height: 1.2;
              }
            }
            ._foot {
              a {
                display: inline-block;
                max-width: 100%;
                color: $font-color2;
                font-size: 12px;
                line-height: 1.3;
              }
            }
          }
        }
      }
      .links {
        margin-top: 15px;
        background: #fff;
        .links-item {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding: 15px;
          &:hover {
            background: #fbfbfb;
          }
          ._img {
            width: 40px;
            height: 34px;
            border-radius: 2px;
          }
          ._info {
            font-size: 16px;
            color: #888;
            padding-left: 15px;
          }
        }
      }
      .site-info {
        margin-top: 15px;
        color: $font-color3;
        font-size: 13px;
        margin-bottom: 50px;
        li {
          line-height: 1.5;
          li {
            display: inline-block;
          }
        }
        a {
          &:hover {
            color: $brand-primary;
          }
          &.dot::after {
            content: '·';
            font-weight: bold;
            margin: 0 5px;
          }
        }
      }
    }
  }
}
</style>
