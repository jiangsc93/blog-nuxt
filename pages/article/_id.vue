<template>
  <div class="page-article-item">
    <Index-header></Index-header>
    <div class="article-content common-container" :class="{'m-article-content': isMobile}">
      <div id="page-article-one" class="__lt" :class="{'__lt_m': isMobile}">
        <div class="__header">
          <div :class="isMobile ? 'author_m author-info' : 'author_pc author-info'">
            <div class="lt">
              <a :href="`/user/${userInfo._id}`" class="avatar-img">
                <img class="avatar" v-lazy="userInfo.avatar" alt="">
              </a>
              <div class="article-info">
                <a :href="`/user/${userInfo._id}`" class="name">{{userInfo.userName}}<span class="level" :style="{backgroundColor:levelToColor(userInfo.level)}">Lv{{userInfo.level || '1'}}</span></a>
                <div class="des">
                  <span class="shijian" v-text="formDate(responseData.beginDate)"></span>
                  <span class="visit inline-b">阅读 {{responseData.visit || '1'}}</span>
                </div>
              </div>
            </div>
            <div class="rt" :class="{ 'rt_active': editorFollowText === '已关注'}" @click="onEditOrFollow('user')">{{ editorFollowText }}</div>
          </div>
          <div class="cover" :class="{'m-cover': isMobile}" v-if="responseData.imgSrc">
            <img :src="responseData.imgSrc" alt="">
          </div>
          <h1 :class="isMobile ? 'title_m' : 'title'">{{responseData.title}}</h1>
          <div class="cont"><div class="inline-b _wrap article-detail" v-html="responseData.content"></div></div>
          <!-- 引导关注 -->
          <div class="author-info-wrap" id="article-comment">
            <div class="author_pc author-info">
            <div class="lt">
              <a :href="`/user/${userInfo._id}`"  class="avatar-img">
                <img class="avatar" v-lazy="userInfo.avatar" alt="不给看">
              </a>
              <div class="article-info">
                <a :href="`/user/${userInfo._id}`" class="name">{{userInfo.userName}}<span class="level" :style="{backgroundColor:levelToColor(userInfo.level)}">Lv{{userInfo.level || '1'}}</span></a>
                <div class="des">
                  <span>发布了 {{userInfo.articleNum || 0}} 篇文章</span> - 
                  <span>获赞 {{userInfo.totalLikes || 0}}</span> -
                  <span>被阅读 {{userInfo.totalVisits || 0}}</span>
                </div>
              </div>
            </div>
            <div v-if="editorFollowText !== '编辑'" class="rt" :class="{ 'rt_active': editorFollowText === '已关注'}" @click="onEditOrFollow('user')">{{ editorFollowText }}</div>
          </div>
          </div>
          <!-- 评论模块 -->
          <Comment :responseData="responseData" @getArticleOne="getArticleOne"></Comment>
        </div>
        <div class="recommened-article">
          <div class="head">
            文章推荐
          </div>
          <ArticelList :articleData="recommenedArticleList"></ArticelList>
          <div v-if="!hasNextPage && recommenedArticleList.length > 20" class="page-bottom">已经到底啦~</div>
        </div>
      </div>
      <div class="to-top" v-if="isScroll" v-scroll-to="'#index-header'"><i class="iconfont icon-huidaodingbu"></i></div>
      <div
        v-if="!isMobile"
        class="__rt fr">
        <ArticleDetailRight :toc="responseData.toc" :authorInfo="userInfo" :articleList="articleList"></ArticleDetailRight>
      </div>
      <div class="article-sidebar" :class="{'m-article-sidebar': isMobile}">
        <div :class="isCurrentUserLiked ? 'active-like-btn': 'like-btn'" :badge="responseData.like" @click="likeArticle(responseData._id)">
          <i class="iconfont icon-dianzan1"></i>
        </div>
        <div class="comment-btn" :badge="responseData.comments_num || '0'" v-scroll-to="'#article-comment'">
          <i class="iconfont icon-icon_huifu-mian"></i>
        </div>
        <div class="collect-btn" :class="{'active': isCurrentUserCollected}" @click="onCollect()">
          <i class="iconfont icon-shoucang"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="module">
import _ from 'lodash';
import Api from '~/utils/api';
import markdown from '~/utils/markdown';
import { Tag } from 'element-ui';
import { mapState, mapGetters } from 'vuex';
import ArticleDetailRight from '~/components/article-detail-right/index';
import ArticelList from '~/components/common/articleList';
import IndexHeader from '~/components/header/indexHeader';
import Comment from '~/components/article/comment';
export default {
  middleware: 'checkMobile',
  head() {
    return {
      title: this.responseData.title,
      meta: [
        { id: 'keywords', hid: 'keywords', name: 'keywords', content: this.responseData.tag },
        { id: 'description', hid: 'description', name: 'description', content: this.responseData.summary },
      ],
    }
  },
  components: {
    IndexHeader,
    Tag,
    ArticleDetailRight,
    ArticelList,
    Comment
  },
  async asyncData(req) {
    let postParams = {
      id: req.params.id
    }
    // 获取单个文章详情
    let responseData = (await Api.getArticleOne(postParams));
    let { content } = responseData;
    let reqParams = {
      variables: {
        userId: content.uid,
        query: '',
        type: '',
        pageSize: 5,
        pageIndex: 1,
      },
    }
    // 查询文章列表
    let res = (await Api.queryByArea(reqParams));
    let { articleList } = res;

    const article = markdown.marked(content);
    article.then(result => {
      responseData.content = result.content;
      responseData.toc = result.toc;
    });
    let params = {
      variables: {
        order: 'recommened',
        category: '',
        tag: '',
        query: '',
        type: '',
        pageSize: 20,
        pageIndex: 1,
      },
    }
    let recommenedArticleList = (await Api.queryByArea(params)).articleList;
    let userInfo = (await Api.getAuthorInfo({_id: responseData.uid}));
    return { responseData, articleList, recommenedArticleList, userInfo };
  },
  data () {
    return {
      responseData: {},
      content: '',
      toc: '',
      isScroll: false,
      userInfo: {},
      hasNextPage: false,
      isCurrentUserLiked: false,
      isCurrentUserFollowed: false,
      isCurrentUserCollected: false,
      isCurrentUserFollowedAuthor: false,
      recommenedArticleList: [],
      user_follow_id: '',
      article_collect_id: '',
    }
  },
  computed: {
    ...mapState(['isMobile']),
    editorFollowText() {
      if (this.isCurrentUserFollowedAuthor && this.$store.state.userId !== this.responseData.uid) {
        return '已关注';
      } else {
        return this.$store.state.isUserself && this.$store.state.userId === this.responseData.uid ? '编辑' : '关注';
      }
    }
  },
  mounted () {
    // 监听页面滚动事件
    window.addEventListener('scroll', this.onScroll);
    this.judgeCurrentUserStatus();
  },
  methods: {
    onCollect() {
      if (!this.$store.state.isLogin) {
        this.$store.commit('setVisible', true);
        this.$store.commit('setHandleFlag', 'login');
        return;
      }
      let postParams = {
        article_id: this.responseData._id,
        collecter_id: this.$store.state.userId
      }
      if (!this.isCurrentUserCollected) {
        Api.collect(postParams)
          .then(res => {
            this.$message({
              message: "已收藏",
              type: "success"
            })
            // 重新获取关注状态
            this.judgeCurrentUserStatus();
          })
      } else {
        Api.uncollect(postParams)
          .then(res => {
            this.$message({
              message: "已取消收藏",
              type: "success"
            })
            // 重新获取关注状态
            this.judgeCurrentUserStatus();
          })
      }
    },
    judgeCurrentUserStatus() {
      let userId = this.$store.state.userId;
      Api.likeAndFollowStatus({articleId: this.responseData._id, ownerId: this.responseData.uid, userId}).then(res => {
        this.isCurrentUserLiked = res.toArticle.isLiked;
        this.isCurrentUserCollected = res.toArticle.isCollected;
        this.isCurrentUserFollowedAuthor = res.toUser.isFollowed;
        this.user_follow_id = res.toUser.follow_id;
        this.article_collect_id = res.toArticle.collect_id;
      });
    },
    onEditOrFollow(type='user') {
      if (!this.$store.state.isLogin) {
        this.$store.commit('setVisible', true);
        this.$store.commit('setHandleFlag', 'login');
        return;
      }
      if (type === 'user') {
        if (this.editorFollowText === '编辑') {
          location.href = `/edit?aid=${this.responseData._id}`;
        } else if (this.editorFollowText === '关注') { // 关注
          let postParams = {
            type: type,
            owner_id: this.userInfo._id,
            follower_id: localStorage.getItem('userId'),
          }
          Api.follow(postParams)
            .then(res => {
              // 重新获取关注状态
              this.judgeCurrentUserStatus();
            })
        } else {
          if (this.user_follow_id) {
            let postParams = {
              type: type,
              follow_id: this.user_follow_id,
              owner_id: this.responseData.uid,
              follower_id: localStorage.getItem('userId'),
            }
            Api.unfollow(postParams)
              .then(res => {
                // 重新获取关注状态
                this.judgeCurrentUserStatus();
              })
          }
        }
      }
    },
    formDate(date) {
      if (date) {
        let arr = date.split(' ')[0].split('-');
        return `${arr[0]}年${arr[1]}月${arr[2]}日`;
      }
    },
    onScroll() {
      const scroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      let offsetTop = document.getElementById('page-article-one').offsetTop;
      this.isScroll = (parseInt(scroll) - 300) > offsetTop;
    },
    
    likeArticle(id) {
      if (!this.$store.state.isLogin) {
        this.$store.commit('setVisible', true);
        this.$store.commit('setHandleFlag', 'login');
        return;
      }
      let params = {
        articleId: id,
        userId: this.$store.state.userId,
      }
      if (!this.isCurrentUserLiked) {
        Api.like(params).then(res => {
          this.getArticleOne();
          this.judgeCurrentUserStatus();
        }).catch(err => {
          this.$message({
            message: "点赞失败",
            type: "danger"
          })
        })
      } else {
          Api.unlike(params).then(res => {
            this.getArticleOne();
            this.judgeCurrentUserStatus();
          }).catch(err => {
            this.$message({
              message: "取消点赞失败",
              type: "danger"
            })
          })
      }
    },
    getArticleOne() {
      let postParams = {
        id: this.$route.params.id
      }
      Api.getArticleOne(postParams)
        .then(res => {
          if (res.content) {
            // markdown 处理
            const article = markdown.marked(res.content);
            article.then(result => {
              res.content = result.content;
              res.toc = result.toc;
              this.responseData = res;
            });
          }
      })
    },
  }
}
</script>
<style lang="scss">
@import '../../assets/css/highlight.css';
.page-article-item {
  .el-textarea__inner:focus {
    border: 1px solid #DCDFE6;
  }
}
.page-article-item textarea.el-textarea__inner {
  position: relative;
  padding: 5px 20px;
}
</style>
<style lang="scss" scoped>

.page-article-item {
  .article-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin: 84px auto 50px;
    &.m-article-content {
      margin: 74px auto 50px;
    }
    .__lt {
      width: 72%;
      .__header {
        padding: 0 20px;
        background: #fff;
      }
      .recommened-article {
        margin-top: 20px;
        background: #fff;
        .head {
          font-size: 17px;
          color: #969696;
          font-weight: 600;
          padding: 12px 18px;
          border-bottom: 1px solid #f2f2f2;
        }
      }
    }
    .__lt_m {
      width: 100%;
    }
    .__rt {
      width: 26%;
    }
    .iconfont {
      margin-right: 5px;
    }
    .handle-wrap {
      padding-bottom: 10px;
    }
    .title {
      font-size: 35px;
      color: #333;
      line-height: 1.5;
      padding: 25px 0;
      font-weight: bold;
    }
    .title_m {
      font-size: 20px;
      color: #333;
      line-height: 1.5;
      padding: 20px 0;
      font-weight: bold;
    }
    .cover {
      width: 100%;
      height: 350px;
      text-align: center;
      img {
        width: 100%;
        height: 100%;
      }
      &.m-cover {
        height: 250px;
      }
    }
    .cont {
      ._wrap {
        width: 100%;
        font-size: 15px;
        color: #2c3e50;
        pre {
          overflow: auto;
          code {
            word-break: break-all;
            word-wrap: break-word;
          }
        }
        
        code {
          overflow: hidden;
        }
      }
    }
    .author-info {
      font-size: 12px;
      color: #969696;
      margin-bottom: 30px;
      padding-top: 20px;
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &.author_pc {
        display: flex;
        justify-content: space-between;
      }
      .lt {
        display: flex;
        justify-content: flex-start;
        .avatar-img {
          width: 40px;
          height: 40px;
          cursor: pointer;
          .avatar {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 1px solid #f1f1f1;
          }
        }
        .article-info {
          margin-left: 10px;
          line-height: 1;
          display: flex;
          flex-direction: column;
          .name {
            line-height: 1.3;
            margin: 0 0 4px;
            color: #555;
            font-size: 17px;
            font-weight: bold;
            cursor: pointer;
            .level {
              display: inline-block;
              font-size: 10px;
              padding: 1px 3px;
              border-radius: 2px;
              position: relative;
              top: -4px;
              opacity: 0.5;
              margin-left: 6px;
              color: #fff;
            }
          }
          .des {
            word-spacing: 0.6px;
            .visit {
              margin: 0 13px;
            }
          }
        }
      }
      .rt {
        width: 52px;
        height: 26px;
        line-height: 24px;
        text-align: center;
        cursor: pointer;
        font-size: 13px;
        border: 1px solid $brand-primary;
        color: $brand-primary;
        border-radius: 2px;
        background: #fff;
        &:hover {
          opacity: 0.7;
        }
        &.rt_active {
          border: 1px solid $brand-primary;
          background: $brand-primary;
          opacity: 0.7;
          color: #fff;
        }
      }
    }
    .author-info-wrap {
      padding-top: 70px;
      background: #fff;
      .author-info {
        padding: 20px;
        background: #f4f5f5;

      }
    }
    .to-top {
      position: fixed;
      bottom: 50px;
      right: 25px;
      i {
        font-size: 35px;
        color: #969696;
        cursor: pointer;
      }
    }
    .article-sidebar {
      position: fixed;
      top: 200px;
      margin-left: -90px;
      .like-btn, .comment-btn, .collect-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        width: 36px;
        height: 36px;
        background: #fff;
        margin-bottom: 10px;
        border-radius: 50%;
        cursor: pointer;
        .iconfont {
          position: relative;
          left: 2px;
          color: #b2bac2;
          font-size: 15px;
        }
        &:hover .iconfont {
          color: #888;
        }
      }
      .collect-btn.active .iconfont {
        color: yellowgreen;
      }
      .like-btn:after, .comment-btn:after {
        content: attr(badge);
        position: absolute;
        top: 0;
        left: 70%;
        padding: 1px 6px;
        font-size: 1rem;
        text-align: center;
        line-height: 1;
        white-space: nowrap;
        color: #fff;
        background: #b2bac2;
        border-radius: 8px;
        transform-origin: left top;
        transform: scale(.75);
      }
      .active-like-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 36px;
        height: 36px;
        background: #fff;
        margin-bottom: 10px;
        border-radius: 50%;
        cursor: pointer;
        &:after {
          content: attr(badge);
          position: absolute;
          top: 0;
          left: 70%;
          padding: 1px 6px;
          font-size: 1rem;
          text-align: center;
          line-height: 1;
          white-space: nowrap;
          color: #fff;
          background: #ec7259;
          border-radius: 8px;
          transform-origin: left top;
          transform: scale(.75);
        }
        .iconfont {
          position: relative;
          left: 2px;
          color: #ec7259;
          font-size: 15px;
        }
        &:hover .iconfont {
          color: #ec7259;
        }
      }
      &.m-article-sidebar {
        top: 45%;
        margin-left: 0;
      }
    }
  }
}
</style>
