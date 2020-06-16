<template>
  <div class="page-user">
    <Index-header></Index-header>
    <div class="page-user-content common-container" :class="{'m-page-user-content': isMobile}">
      <div class="__lt" :class="{'m__lt': isMobile}">
        <!-- 用户信息 -->
        <div class="__user-info">
          <div class="_lt">
            <div class="_img">
              <img :src="userInfo.avatar" alt="">
            </div>
          </div>
          <div class="_desc">
            <div class="user-name" v-if="userInfo.userName"><span>{{userInfo.userName}}</span><span class="level" :style="{backgroundColor:levelToColor(userInfo.level)}">Lv{{userInfo.level}}</span></div>
            <div class="position item" v-if="userInfo.position || userInfo.company">
              <i class="iconfont icon-zhiye"></i>
              <div class="content">
                <span class="company">{{userInfo.position}}</span>
                <span class="interval"> | </span>
                <span class="company">{{userInfo.company}}</span>
              </div>
            </div>
            <div class="introduce item" v-if="userInfo.introduce">
              <i class="iconfont icon-ziwojieshao"></i>
              <div class="content">
                 {{userInfo.introduce}}
              </div>
            </div>
            <div class="achievement" v-if="isMobile">
              <span class="prop">获赞数</span><span class="num first-num"> {{userInfo.totalLikes || 0}}</span>
              <span class="prop">被阅读</span><span class="num"> {{userInfo.totalVisits || 0}}</span>
            </div>
          </div>
          <div class="_rt">
            <div class="home-page" v-if="userInfo.homePage">
              <a :href="userInfo.homePage" target="__blank" :title="`个人主页${userInfo.homePage}`">
                <i class="iconfont icon-diqiu"></i>
              </a>
            </div>
            <div class="btn">
              <a v-if="$store.state.isUserself && $store.state.userId === userInfo._id" :href="`/user/setting/info?uid=${userInfo._id}`" class="edit-info ui-btn">编辑资料</a>
              <div v-else class="follow ui-btn" :class="isCurrentUserFollowedAuthor ? 'active-btn' : ''" @click="onFollow()">{{isCurrentUserFollowedAuthor ? '已关注' : '关注'}}</div>
            </div>
          </div>
        </div>
        <!-- 状态 -->
        <div class="__user-content">
          <div class="head" :class="{'m-head': isMobile}">
            <ul>
              <li class="nav-item"
                  :class="item.eng === activeEng ? 'active' : ''"
                  v-for="(item, index) in userPropertyList"
                  :key="index">
                  <a :href="`/user/${$route.params.id}?type=${item.eng}`">{{item.name}}<span class="num">{{item.num}}</span></a>
              </li>
            </ul>
          </div>
          <div>
            <!-- 关注 -->
            <div class="follows" v-if="$route.query.type === 'followers'">
              <FollowItem :followList="followList"></FollowItem>
            </div>
            <div class="follows" v-else-if="$route.query.type === 'followings'">
              <FollowItem :followList="followList"></FollowItem>
            </div>
            <!-- 收藏 -->
            <div class="collect" v-else-if="$route.query.type === 'collects'">
              <ul v-if="collectList.length > 0">
                <li class="collect-item" v-for="(item, index) in collectList" :key="index">
                  <ArticelListItem :item="item.article_info[0]" :showSummary="false"></ArticelListItem>
                </li>
              </ul>
              <div v-else class="no-data">
                <div class="no-data-icon"><i class="iconfont icon-wushuju"></i></div>
                <div class="no-data-text">暂无数据！</div>
              </div>
            </div>
            <!-- 赞 -->
            <div class="collect" v-else-if="$route.query.type === 'likes'">
              <ul v-if="likeList.length > 0">
                <li class="collect-item" v-for="(item, index) in likeList" :key="index">
                  <ArticelListItem :item="item.article_info[0]" :showSummary="false"></ArticelListItem>
                </li>
              </ul>
               <div v-else class="no-data">
                <div class="no-data-icon"><i class="iconfont icon-wushuju"></i></div>
                <div class="no-data-text">暂无数据！</div>
              </div>
            </div>
            <!-- 文章 -->
            <div class="content-wrap" v-else>
              <ArticleItem :articleList="articleList" :userInfo="userInfo"></ArticleItem>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!isMobile" class="__rt">
        <div class="achievement" v-if="userInfo.totalLikes > 0 || userInfo.totalVisits > 0">
          <div class="head">个人成就</div>
          <div class="__like"><span><i class="iconfont icon-dianzan1"></i></span>获得点赞数 {{userInfo.totalLikes || 0}}</div>
          <div class="__read"><span><i class="iconfont icon-ai-eye"></i></span>获得阅读量 {{userInfo.totalVisits || 0}}</div>
        </div>
        <div class="follow" v-if="userInfo.followings > 0 || userInfo.followers > 0">
          <a :href="`/user/${$route.params.id}?type=followings`">
            <div class="title">关注了</div>
            <div class="num">{{userInfo.followings}}</div>
          </a>
          <a :href="`/user/${$route.params.id}?type=followers`">
            <div class="title">关注者</div>
            <div class="num">{{userInfo.followers}}</div>
          </a>
        </div>
        <div class="other">
          <a :href="`/user/${$route.params.id}?type=collects`"
            v-if="collectList.length > 0"
            class="item">
            <div class="title">收藏文章</div>
            <div class="num">{{collectList.length}}</div>
          </a>
          <div class="item">
            <div class="title">加入于</div>
            <div class="num">{{formatTime(userInfo.create_time, 1)}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import Cookie from 'js-cookie';
import Mock from 'mockjs'
import Api from '~/utils/api';
import { mapState, mapGetters } from 'vuex';
import IndexHeader from '~/components/header/indexHeader';
import ArticleItem from '~/components/user/articleItem';
import ArticelListItem from '~/components/common/articleListItem';
import FollowItem from '~/components/user/followItem';

export default {
  middleware: 'checkMobile',
  head() {
    return {
      title: '',
      meta: [
        { id: 'keywords', hid: 'keywords', name: 'keywords', content: '' },
        { id: 'description', hid: 'description', name: 'description', content: '' },
      ],
    }
  },
  components: {
    IndexHeader,
    ArticleItem,
    FollowItem,
    ArticelListItem
  },
  async asyncData({ params, store, route }) {
    let reqParams = {
      variables: {
        userId: params.id,
        query: '',
        type: '',
        pageSize: 20,
        pageIndex: 1,
      },
    }
    let { articleList } = await Api.queryByArea(reqParams);
    let result = await Api.getAuthorInfo({_id: params.id});
    let userInfo = result;

    let collectList = [];
    let likeList = [];
    let followList = [];
    let postParams = {
      pageIndex: 1,
      pageSize: 5,
      author_id: userInfo._id,
      userId: store.state.userId
    }
    if (route.query.type === 'followers') {
      postParams.type = route.query.type;

    } else if (route.query.type === 'followings') {
      postParams.type = route.query.type;
    }
    followList = (await Api.queryFollowList(postParams)).followList;
    likeList = (await Api.likeList({ userId: params.id })).likeList;
    collectList = (await Api.queryCollectList({ collecter_id: params.id })).collectList;
    let isCurrentUserFollowedAuthor = (await Api.likeAndFollowStatus({ownerId: userInfo._id, userId: store.state.userId})).toUser.isFollowed;
    let userPropertyList = [
      {
        name: '文章',
        eng: 'articles',
        num: articleList.length,
        index: 0
      },
      {
        name: '关注了',
        eng: 'followings',
        num: userInfo.followings,
        index: 1
      },
      {
        name: '关注者',
        eng: 'followers',
        num: userInfo.followers,
        index: 2
      },
      {
        name: '收藏',
        eng: 'collects',
        num: collectList.length,
        index: 3
      },
      {
        name: '我赞过',
        eng: 'likes',
        num: likeList.length,
        index: 4
      }
    ];
    return { userInfo, articleList, followList, collectList, likeList, userPropertyList, isCurrentUserFollowedAuthor };
  },
  data () {
    return {
      userInfo: {},
      articleList: [],
      showFollow: true,
      userPropertyList: [],
      activeEng: this.$route.query.type || 'articles',
      followList: [],
      collectList: [],
      likeList: [],
      isCurrentUserFollowedAuthor: false
    }
  },
  computed: {
    ...mapState(['isMobile']),
  },
  mounted () {
  },
  methods: {
    onFollow() {
      if (!this.$store.state.isLogin) {
        this.$store.commit('setVisible', true);
        this.$store.commit('setHandleFlag', 'login');
        return;
      }
      let postParams = {
        owner_id: this.userInfo._id,
        follower_id: this.$store.state.userId,
      }
      if (!this.isCurrentUserFollowedAuthor) { // 关注
        Api.follow(postParams)
          .then(res => {
            this.isCurrentUserFollowedAuthor = true;
          })
      } else {
        Api.unfollow(postParams)
          .then(res => {
            this.isCurrentUserFollowedAuthor = false;
          })
      }
    },
  }
}
</script>

<style lang="scss" scoped>

.page-user {
  .page-user-content {
    margin-top: 84px;
    display: flex;
    justify-content: space-between;
    &.m-page-user-content {
      margin-top: 70px;
    }
    .__lt {
      width: 72%;
      &.m__lt {
        width: 100%;
      }
      .__user-info {
        display: flex;
        align-items: center;
        padding: 28px 20px;
        background: #fff;
        box-sizing: content-box;
        color: #72777b;
        .iconfont {
          color: #333;
        }
        ._lt {
          flex: 0 0 auto;
          ._img {
            display: inline-block;
            margin-right: 20px;
            vertical-align: top;
            img {
              width: 80px;
              height: 80px;
              border-radius: 50%;
            }
          }
        }
        ._desc {
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-right: 4px;
          .user-name {
            font-size: 26px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #000;
            .level {
              position: relative;
              top: -10px;
              display: inline-block;
              padding: 2px;
              font-size: 10px;
              margin-left: 5px;
              border-radius: 2px;
              color: #fff;
            }
          }
          .iconfont {
            font-size: 18px;
            color: #666;
            margin-right: 10px;
            &.icon-ziwojieshao {
              font-size: 17px;
            }
          }
          .position {
            .interval {
              width: 20px;
              text-align: center;
              color: #ccc;
            }
            .content {
              position: relative;
              top: 2px;
            }
          }
          .item {
            display: flex;
            margin-bottom: 5px;
            .iconfont {
              display: inline-block;
              vertical-align: bottom;
            }
            .content {
              display: inline-block;
              width: calc(100% - 30px);
              vertical-align: bottom;
            }
          }
          .introduce {
            line-height: 1.6;
            .iconfont {
              font-size: 20px;
            }
            .content {
              position: relative;
              top: 5px;
            }
          }
          .achievement {
            max-width: 150px;
            margin-top: 8px;
            font-size: 15px;
            color: #333;
            .num {
              color: #72777b;
              &.first-num {
                margin-right: 10px;
              }
            }
          }
        }
        ._rt {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          text-align: center;
          width: 23%;
          .home-page {
            text-align: center;
            margin-bottom: 20px;
            a {
              .iconfont {
                color: $brand-primary;
              }
              &:hover {
                opacity: .8;
              }
            }
          }
          .btn {
            .ui-btn {
              display: block;
              width: 78px;
              height: 32px;
              line-height: 32px;
              border: 1px solid rgb(236,114,89);
              color: rgb(236,114,89);
              border-radius: 4px;
              text-align: center;
              cursor: pointer;
              &:hover {
                border: 1px solid rgba(236,114,89, .7);
                color: rgba(236,114,89, .7);
              }
              &.active-btn {
                border: 1px solid rgba(236,114,89, .7);
                background: rgba(236,114,89, .7);
                color: #fff;
              }
            }
          }
        }
      }
      .__user-content {
        margin-top: 10px;
        .head {
          padding: 10px 20px 0 20px;
          background: #fff;
          border-bottom: 1px solid #f2f2f2;
          .nav-item {
            display: inline-block;
            margin-right: 20px;
            padding: 10px 13px;
            cursor: pointer;
            .num {
              display: inline-block;
              margin-left: 5px;
              color: #aaa;
            }
            &.active {
              color: $brand-primary;
              box-shadow: inset 0 -2px 0 $brand-primary;
            }
          }
          &.m-head {
            padding: 5px 15px 0 15px;
            ul {
              display: flex;
              justify-content: space-between;
            }
            .nav-item {
              font-size: 16px;
              padding: 15px 6px;
              margin-right: 0px;
            }
          }
        }
        .no-data {
          padding: 20px;
          text-align: center;
          background: #fff;
          .no-data-icon {
            margin-bottom: 5px;
            .iconfont {
              font-size: 40px;
              color: #999;
            }
          }
        }
        .content-wrap {
          margin-bottom: 50px;
        }
        .collect-item {
          background: #fff;
        }
      }
    }
    .__rt {
      width: 26%;
      .achievement {
        background: #fff;
        padding: 0 0 15px;
        margin-bottom: 10px;
        .head {
          height: 40px;
          line-height: 40px;
          padding-left: 15px;
          border-bottom: 1px solid #f2f2f2;
        }
        .__like, .__read {
          padding: 15px 15px 0;
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
      .follow {
        display: flex;
        margin-bottom: 10px;
        background: #fff;
        a {
          flex: 1 1 auto;
          display: inline-block;
          text-align: center;
          font-size: 15px;
          padding: 15px 0;
          .num {
            color: #31445c;
            font-weight: bold;
            margin-top: 5px;
          }
        }
      }
      .other {
        border-top: 1px solid #ebebeb;
        .item {
          display: flex;
          justify-content: space-between;
          padding: 12px 5px;
          font-size: 15px;
          border-bottom: 1px solid #ebebeb;
          &:hover {
            opacity: .9;
          }
          .num {
            color: #31445c;
          }
        }
      }
    }
  }
}

</style>
