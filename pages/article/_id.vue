<template>
  <div class="item">
    <div :class="isMobile ? '__lt_m' : '__lt'">
      <h2 :class="isMobile ? 'title_m' : 'title'">{{responseData.title}}</h2>
      <div :class="isMobile ? 'author_m author-info' : 'author_pc author-info'">
        <div class="lt">
          <img class="avatar" :src="responseData.avatar || customerAvatar" alt="不给看">
          <div class="article-info">
            <div class="name">{{responseData.author}}</div>
            <div class="des">
              <span class="shijian">{{responseData.beginDate}}</span>
              <span class="wordage">字数 {{responseData.wordage || 2333}}</span>
              <span class="visit inline-b"><i class="iconfont icon-yanjing"></i>{{responseData.visit || '1'}}次浏览</span>
            </div>
          </div>
        </div>
        <div :class="!isMobile ? 'tag inline-b' : 'tag_m'">
          <el-tag v-for="(x, y) in handleTag(responseData.tag)" :key="y">{{x}}</el-tag>
        </div>
      </div>
      <div class="cont"><div class="inline-b _wrap article-detail" v-html="responseData.content"></div></div>
      <!-- <div class="like">
        如果您觉得这篇文章不错或者对你有所帮助，请给个赞或者星呗，你的点赞就是我继续创作的最大动力。
      </div> -->
      <div class="like">
        <el-button type="danger" @click="likeArticle(responseData._id)">{{likeText}}</el-button>
        <div class="like-users" v-if="responseData.like_users && responseData.like_users.length > 0">
          <span class="img" v-for="(item, index) in responseData.like_users" :key="index">
            <img v-if="item.avatarSrc" :src="item.avatarSrc" :alt="item.userName" :title="item.userName">
          </span>
          <span class="total">共{{responseData.like_users.length}}人点赞</span>
        </div>
      </div>
      <!-- 编辑一级评论 -->
      <div class="comment">
        <div class="edit">
          <div class="textarea-warp">
            <i class="iconfont icon-comment"></i>
            <el-input class="textarea" type="textarea" @focus="commentFocus" :autosize="{ minRows: 4}" placeholder="写下你的评论" v-model="textareaOne"></el-input>
          </div>
          <div class="button" v-show="showButton">
            <el-button class="btn" type="danger" round size="small" @click="submitComment('one', responseData.author)">发布</el-button>
            <el-button class="btn" round plain size="small" @click="showButton = false">取消</el-button>
          </div>
        </div>
        <div class="list">
          <div class="head">全部评论 {{commentTotal}}</div>
          <div class="no-data" v-if="commentTotal === 0">~赶紧来抢占第一个沙发吧~</div>
          <div class="content" v-for="(item, index) in responseData.comments" :key="index">
            <div class="avator">
              <img :src="item.avatar" alt="">
            </div>
            <div class="info">
              <div class="name">{{item.userName}}
                <span class="name-author">{{item.userName === item.owner ? '(作者)' : ''}}</span>
              </div>
              <div class="time">{{item.floor || 1}}楼 {{item.create_time}}</div>
              <div class="cont">{{item.content}}</div>
              <div class="handle">
                <span class="like" @click="onThumb(responseData._id, index)" :class="likeActiveIndex === index ? 'like-active' : ''"><i class="iconfont icon-dianzan1"></i>{{(item.like === 0 || !item.like) ? '赞' : item.like}}</span>
                <span class="reply" @click="showItemInput(index)"><i class="iconfont icon-icon_huifu-mian"></i>回复</span>
              </div>
              <div class="reply-textarea edit" v-show="showItemId === index">
                <div class="textarea-warp">
                  <i class="iconfont icon-comment"></i>
                  <el-input class="textarea" type="textarea" :autosize="{ minRows: 3}" placeholder="写下你的评论" v-model="textareaTwo"></el-input>
                </div>
                <div class="button">
                  <el-button class="btn" type="danger" round size="small" @click="submitComment('two', item.userName, item.floor, index)">发布</el-button>
                  <el-button class="btn" round plain size="small" @click="cancel">取消</el-button>
                </div>
              </div>
              <template v-if="item.children">
                <div class="reply-list" v-for="(m, n) in item.children" :key="n">
                  <div class="avator">
                    <img :src="m.avatar" alt="">
                  </div>
                  <div class="info">
                    <div class="name">{{m.userName}}<span class="name-author">{{m.userName === responseData.author ? '(作者)' : ''}}</span></div>
                    <div class="time">{{m.create_time}}</div>
                    <div class="cont"><span>回复 <span class="replay-color">{{m.owner}} <span class="replay-author">{{m.owner === responseData.author ? '(作者)' : ''}}</span>：</span></span> {{m.content}}</div>
                    <div class="handle">
                      <span class="reply" @click="showItemTwoInput(n, index)"><i class="iconfont icon-icon_huifu-mian"></i>回复</span>
                    </div>
                    <div class="edit" v-show="showItemTwoId === n && showFatherId === index">
                      <div class="textarea-warp">
                        <i class="iconfont icon-comment"></i>
                        <el-input class="textarea" type="textarea" :autosize="{ minRows: 3}" placeholder="写下你的评论" v-model="textareaThree"></el-input>
                      </div>
                      <div class="button">
                        <el-button class="btn" type="danger" round size="small" @click="submitComment('three', m.userName, item.floor, index)">发布</el-button>
                        <el-button class="btn" round plain size="small" @click="cancelTwo">取消</el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="!isMobile"
      class="__rt fr anchor"
      v-html="responseData.toc"></div>
  </div>
</template>

<script>
import _ from 'lodash';
import Api from '~/utils/api'
import markdown from '~/utils/markdown'
import { Tag, Loading } from 'element-ui'
import { mapState, mapGetters } from 'vuex'
export default {
  layout: 'front',
  head() {
    return {
      title: '文章',
      meta: [
        { id: 'keywords', hid: 'keywords', name: 'keywords', content: '文章' },
        { id: 'description', hid: 'description', name: 'description', content: '蒋少川的个人博客' },
      ]
    }
  },
  components: {
    Tag,
    Loading
  },
  data () {
    return {
      textareaOne: '',
      textareaTwo: '',
      textareaThree: '',
      commentTotal: '',
      responseData: {},
      content: '',
      toc: '',
      showButton: false,
      showReplay: false,
      showThreeReplay: false,
      likeText: '点赞',
      showItemId: '',
      showItemTwoId: '',
      showFatherId: '',
      likeActiveIndex: '',
      isLiked: false
    }
  },
  computed: {
    ...mapState(['isMobile']),
    ...mapGetters(['getCustomerInfo']),
    customerAvatar() {
      let arr = this.$store.state.configList;
      let value = '';
      _.forEach(arr, (item) =>  {
        if (item.title === '游客默认头像') {
          value = item.imgSrc;
        }
      });
      return value;
    }
  },
  mounted () {
    this.getArticleOne();
  },
  methods: {
    // 对一级评论点赞
    onThumb(id, index) {
      if (this.likeActiveIndex === index) {
        this.$message({
          message: "你已经点过赞了，悠着点吧！",
          type: "warning"
        })
        return;
      }
      this.likeActiveIndex = index;
      let params = {
        id,
        index
      }
      Api.commentLike(params).then(res => {
        if (res.status === 200 && res.data.data) {
          this.$message({
            message: "评论点赞成功！",
            type: "success"
          })
          this.getArticleOne();
        }
      }).catch(err => {
        this.$message({
          message: "点赞失败",
          type: "error"
        })
      })
    },
    showItemInput(index) {
      this.showItemId = index;
    },
    showItemTwoInput(n, index) {
      this.showItemTwoId = n;
      this.showFatherId = index;
    },
    cancel() {
      this.showItemId = '';
    },
    cancelTwo() {
      this.showItemTwoId = '';
    },
    submitComment(val, userName, floor, index) {
      // 判断是否登录
      if (!this.getCustomerInfo.customerName) {
        this.$message({
          message: "登录才能评论哦，请先登录",
          type: "warning"
        })
        return;
      }
      let params = {
        type: '1', // 1 为一级评论 直接评论文章作者  2 为二级评论
        id: this.responseData._id,
        userName: this.getCustomerInfo.customerName,
        avatar: this.getCustomerInfo.avatorSrc,
        content: this.textareaOne,
        owner: userName,
        floor: 0,
        index: index
      }

      // 判断是否输入内容
      let text = '';
      if (val === 'one') {
        params.content = this.textareaOne;
        params.floor = this.responseData.comments.length + 1;
        text = this.textareaOne;
      } else if (val === 'two') {
        params.content = this.textareaTwo;
        params.floor = floor;
        text = this.textareaTwo;
        params.type = '2';
      } else if (val === 'three') {
        params.content = this.textareaThree;
        params.floor = floor;
        text = this.textareaThree;
        params.type = '2';
      }
      if (!text) {
        this.$message({
          message: "你还没有写评论呢",
          type: "warning"
        })
        return
      }

      Api.commentOne(params).then(res => {
        this.$message({
          message: "评论成功",
          type: "success"
        })
        this.textareaOne = '';
        this.textareaTwo = '';
        this.textareaThree = '';
        this.getArticleOne();
        this.cancel();
        this.cancelTwo();
      }).catch(err => {
        this.$message({
          message: "请求失败",
          type: "error"
        })
      })
    },
    likeArticle(id) {
      if (!this.getCustomerInfo.customerName) {
        this.$message({
          message: "登录才能点赞哦，请先登录",
          type: "warning"
        })
        return;
      } else if (this.likeText === '已赞') {
        this.$message({
          message: "已经点过赞啦，悠着点吧",
          type: "warning"
        })
        return;
      }
      let params = {
        id,
        userName: this.getCustomerInfo.customerName,
        avatarSrc: this.getCustomerInfo.avatorSrc // 这儿字段有变化
      }
      if (this.isLiked) {
        this.$message({
          message: '你已经点过赞啦，悠着点吧',
          type: 'warning',
        })
        return;
      }
      Api.likeArticle(params).then(res => {
        this.isLiked = true;
        let type = 'success';
        if (res.data.message === '点赞成功') {
          this.likeText = '已赞';
          this.getArticleOne();
        } else {
          type = 'warning';
        }
        this.$message({
          message: res.data.message,
          type: type
        })
      }).catch(err => {
        this.$message({
          message: "点赞失败",
          type: "danger"
        })
      })

    },
    commentFocus() {
      this.showButton = true;
    },
    handleTag(tag) {
      if (tag) return tag.split(',')
    },
    getArticleOne() {
      let postParams = {
        id: this.$route.params.id
      }
      Api.getArticleOne(postParams)
        .then((res) => {
          let responseData = res.data.data;
          if (res.status === 200 && res.data && res.data.data.content) {
            // markdown 处理
            const article = markdown.marked(res.data.data.content);
            article.then(result => {
              responseData.content = result.content;
              responseData.toc = result.toc;
            });
            this.responseData = responseData;
            this.commentTotal = responseData.comments.length;
            this.seoHandle();
          }
      }).catch (err => {
        console.log('报错了啊')
      })
    },
    seoHandle() {
      document.title = this.responseData.title;
      document.querySelector("#keywords").setAttribute("content", this.responseData.tag);
      document.querySelector("#description").setAttribute("content", this.responseData.summary);
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/css/highlight.css';

.el-textarea__inner:focus {
  border: 1px solid #DCDFE6;
}
.el-tag {
  height: 24px;
  line-height: 22px;
  margin: 0 2px;
}
.anchor {
  padding-left: 20px;
  border-left: 1px solid #eee;
  a {
    text-decoration: none;
  }
  a:link {
    color: #551a8b;
  }
  ul {
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 25px;
    ul {
      list-style-type: circle;
      margin-block-start: 0px;
      margin-block-end: 0px;
      ul {
        list-style-type: square;
      }
    }
    li {
      display: list-item;
      line-height: 1.5;
      text-align: -webkit-match-parent;
    }
  }
  .anchor-ul {
    position: relative;
    top: 0;
    max-width: 265px;
    border: none;
    -moz-box-shadow: 0 0px 0px #fff;
    -webkit-box-shadow: 0 0px 0px #fff;
    box-shadow: 0 0px 0px #fff;
    li {
      line-height: 1.7;
    }
    li.active {
      color: #009a61;
    }
  }
}
.item {
    width: 94%;
    padding: 10px 3% 40px;
    border-radius: 4px;
    background: #fff;
    .__lt {
      width: 66%;
      float: left;
      padding-right: 20px;
    }
    .__lt_m {
      width: 100%;
    }
    .__rt {
      width: 28%;
      float: right;
      display: block;
      position: sticky;
      top: 213px;
      right: 70px;
    }
    .iconfont {
      font-size: 13px;
      margin-right: 5px;
      color: #969696;
      font-weight: bold;
      &.icon-yanjing {
        font-size: 17px;
        position: relative;
        top: 1px;
      }
    }
    .title {
      font-size: 32px;
      color: #2c3e52;
      line-height: 1.5;
      margin: 20px 0;
      text-align: center;
    }
    .title_m {
      font-size: 20px;
      color: #2c3e52;
      line-height: 1.5;
      margin: 20px 0;
      text-align: center;

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
    .comment {
      .textarea-warp {
        position: relative;
        .icon-comment {
          font-size: 13px;
          color: #ccc;
          position: absolute;
          top: 9px;
          left: 6px;
          z-index: 1000;
        }
        .textarea {
          textarea {
            padding-left: 23px;
            background: #fafafa;
          }
        }
      }
      .reply-textarea .textarea-warp .icon-comment, .reply-list .textarea-warp .icon-comment {
        top: 6px;
      }
      .edit {
        .btn {
          margin: 20px 0 20px 12px;
        }
        .button {
          text-align: right;
        }
      }
      .list {
        margin: 30px 0;
        .head {
          margin: 20px 0;
          font-size: 18px;
          &:before {
            display: inline-block;
            content: '';
            width: 4px;
            height: 20px;
            margin-right: 8px;
            background:#ec7259;
            border-radius: 5px;
            position: relative;
            top: 3px;
          }
        }
        .no-data {
          margin-top: 20px;
          color: #ec7259;
          text-align: center;
        }
        .content {
          display: flex;
          justify-content: start;
          .avator {
            width: 40px;
            height: 40px;
            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          .info {
            width: 100%;
            margin-left: 10px;
            * {
              line-height: 1.5;
            }
            .name {
              color: #333;
              font-size: 15px;
              line-height: 1.2;
              .name-author {
                font-size: 14px;
                margin-left: 3px;
                color: #406599;
              }
            }
            .time {
              padding-top: 5px;
              font-size: 12px;
              color: #aaa;
            }
            .cont {
              color: #2c3e50;
              font-size: 13px;
              line-height: 1.7;
              margin: 10px 0;
              .replay-color {
                color: #406599;
              }
            }
            .handle {
              padding-bottom: 20px;
              border-bottom: 1px solid #eee;
              margin-bottom: 10px;
              font-size: 13px;
              .like {
                cursor: pointer;
                margin-right: 20px;
                color: #aaa;
                &.like-active {
                  color: #ec7259!important;
                  .icon-dianzan1 {
                    color: #ec7259;
                  }
                }
                .icon-dianzan1 {
                  font-size: 15px;
                }
                &:hover {
                  color: #ec7259;
                  .icon-dianzan1 {
                    color: #ec7259;
                  }
                }
              }
              .reply {
                position: relative;
                top: 1px;
                cursor: pointer;
                color: #aaa;
                .icon-icon_huifu-mian {
                  font-size: 13px;
                }
                &:hover {
                  color: #666;
                  .icon-icon_huifu-mian {
                    color: #666;
                  }
                }
              }
            }
            .reply-list {
              display: flex;
              justify-self: start;
            }
          }
        }
      }
    }
    .author-info {
      font-size: 12px;
      height: 50px;
      color: #969696;
      margin-bottom: 30px;
      position: relative;
      &.author_pc {
        display: flex;
        justify-content: space-between;
      }
      .lt {
        overflow: hidden;
        .avatar {
          position: absolute;
          top: 0;
          left: 0;
          width: 45px;
          height: 45px;
          border-radius: 50%;
        }
        .article-info {
          float: left;
          padding-left: 55px;
          line-height: 1;
          .name {
            margin: 5px 0 6px 0;
            color: #555;
            font-size: 13px;
          }
          .des {
            // .shijian {
              // .icon-shijian {
              //   font-size: 12px;
              // }
            // }
            .visit {
              margin: 0 13px;
            }
            .wordage {
              margin-left: 10px;
            }
          }
        }
      }
      .tag {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
      }
      .tag_m {
        margin: 5px 0 0 50px;
      }
    }
    .like {
      margin: 50px 0 80px;
      text-align: center;
      .like-users {
        text-align: center;
        padding: 10px 50px;
        .img {
          display: inline-block;
          width: 30px;
          height: 30px;
          margin-left: 2px;
          img {
            width: 100%;
            height: 100%;
            border: 1px solid #f2f2f2;
            border-radius: 50%;
          }
        }
        .total {
          margin-left: 5px;
          vertical-align: top;
          color: #aaa;
        }
      }
    }
  }
</style>
