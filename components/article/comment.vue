<template>
  <div class="page-article-comment">
    <div class="comment-text">评论</div>
      <!-- 编辑一级评论 -->
      <div class="comment">
        <div class="edit">
          <div class="comment-wrap">
            <div class="user-avatar" >
              <img v-if="$store.state.avatar" :src="$store.state.avatar" alt="">
              <img v-else src="./images/avatar.png" alt="">
            </div>
            <div class="input-wrap">
              <InputTextarea type="one" :ownerId="responseData.uid" @submitComment="submitComment($event)"></InputTextarea>
            </div>
          </div>
        </div>
        <div class="list" :class="{'m-list': isMobile}">
          <div class="no-data" v-if="responseData.comments_num === 0">~赶紧来抢占第一个沙发吧~</div>
          <div class="content" :class="index === commentList.length - 1 ? 'last-content' : ''" v-for="(item, index) in commentList" :key="index">
            <div class="avator">
              <img :src="item.replier_info.avatar" alt="">
            </div>
            <div class="info info-one" :class="index === commentList.length -1 ? 'last-comment' : ''">
              <div class="name">{{item.replier_info.userName}}
                <span class="level" :style="{backgroundColor:levelToColor(item.replier_info.level)}">Lv{{item.replier_info.level || '1'}}</span>
                <span class="name-author">{{item.replier_info.userName === item.owner_info.userName ? '(作者)' : ''}}</span>
                <span class="ui-position">{{item.replier_info.position}}<span v-if="item.replier_info.company"> @ {{item.replier_info.company}}</span></span>
              </div>
              <div class="time">{{formatTime(item.create_time)}}</div>
              <div class="cont" v-html="item.content"></div>
              <div class="handle handle-wrap">
                <div class="_lt">
                  <span class="like" @click="onThumb(item._id, index)" :class="likeActiveIndex === index ? 'like-active' : ''"><i class="iconfont icon-dianzan1"></i>{{(item.like === 0 || !item.like) ? '赞' : item.like}}</span>
                  <span class="reply" @click="showItemInput(index)"><i class="iconfont icon-icon_huifu-mian"></i>回复</span>
                </div>
                <div v-if="$store.state.isUserself && $store.state.userId === responseData.uid" class="_rt delete-one" @click="deleteOne(item._id)">删除</div>
              </div>
              <div class="reply-textarea edit" v-show="showItemId === index">
                <InputTextarea type="two" :commentId="item._id" :ownerId="item.replier_id" @submitComment="submitComment($event)"></InputTextarea>
              </div>
              <template v-if="item.children">
                <div class="reply-list">
                  <div class="reply-item" v-show="n < commentLimit" v-for="(m, n) in item.children" :key="n">
                    <div class="avator">
                      <img :src="m.replier_info.avatar" alt="">
                    </div>
                    <div class="info info-two" :class="n === item.children.length -1 ? 'last-comment' : ''">
                      <div class="name">
                        {{m.replier_info.userName}}
                        <span class="level" :style="{backgroundColor:levelToColor(m.owner_info.level)}">Lv{{m.owner_info.level || '1'}}</span>
                        <span class="name-author">{{m.replier_info.userName === responseData.author ? '(作者)' : ''}}</span>
                        <span class="ui-position">{{item.replier_info.position}}<span v-if="item.replier_info.company"> @ {{item.replier_info.company}}</span></span>
                      </div>
                      <div class="time">{{formatTime(m.create_time)}}</div>
                      <div class="cont">
                        <span>回复
                          <span class="replay-color">{{m.owner_info.userName}}
                            <span class="level" :style="{backgroundColor:levelToColor(m.replier_info.level)}">Lv{{m.replier_info.level || '1'}}</span>
                            <span class="replay-author">{{m.owner_info.userName === responseData.author ? '(作者)' : ''}}</span>：
                            <span class="replay-content" v-html="m.content"></span>
                          </span>
                        </span >
                      </div>
                      <div class="handle">
                        <div class="_lt">
                          <span class="reply" @click="showItemTwoInput(n, index)"><i class="iconfont icon-icon_huifu-mian"></i>回复</span>
                        </div>
                        <div v-if="$store.state.isUserself && $store.state.userId === responseData.uid" class="_rt delete-two" @click="deleteOne(item._id, index)">删除</div>
                      </div>
                      <div class="edit reply-textarea repley-list-textarea" v-show="showItemTwoId === n && showFatherId === index">
                        <InputTextarea type="three" :commentId="item._id" :ownerId="m.owner_id" @submitComment="submitComment($event)"></InputTextarea>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="load-more" v-show="commentLimit < item.children.length"><span class="more-btn" @click="commentLimit = item.children.length">查看全部</span></div>
              </template>
            </div>
          </div>
          <div class="more-comment">
            <span @click="onMoreComment" v-if="hasNextPageComment">加载更多</span>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import _ from 'lodash';
import Api from '~/utils/api';
import { mapState } from 'vuex';
import InputTextarea from '../common/inputTextarea';
  export default {
    props: ['responseData'],
    data() {
      return {
        commentList: [],
        commentLimit: 2,
        showReplay: false,
        showThreeReplay: false,
        showItemId: '',
        showItemTwoId: '',
        showFatherId: '',
        likeActiveIndex: '',
        pageIndex: 1,
        hasNextPageComment: false
      }
    },
    components: {
      InputTextarea
    },
    computed: {
      ...mapState(['isMobile']),
    },
    mounted() {
      this.$nextTick(() => {
        this.getCommentList();
      })
    },
    methods: {
      deleteOne(commentId, secondaryCommentIndex) {
        let message = '评论删除后，以下的所有回复都会被删除';
        if (secondaryCommentIndex) {
          // 则表示是删除的 二级评论
          message = '';
        }
        Util.UI.confirm(message, '确定删除这条评论吗?').then(() => {
          Api.deleteComment({comment_id: commentId, secondary_comment_index: secondaryCommentIndex})
            .then(res => {
              this.$message({
                message: "评论删除成功",
                type: "success"
              })
              this.commentList = [];
              this.pageIndex = 1;
              this.$emit('getArticleOne');
              this.getCommentList();
            })
        })
      },
      onMoreComment() {
        this.pageIndex += 1;
        this.getCommentList();
      },
      getCommentList() {
        let params = {
          article_id: this.$route.params.id,
          pageSize: 5,
          pageIndex: this.pageIndex,
        }
        Api.queryCommentList(params)
          .then(result => {
            this.commentList = this.commentList.concat(result.commentList);
            this.hasNextPageComment = result.hasNextPage;
          }).catch(err => {
            this.$message({
              message: "获取失败",
              type: "error"
            })
          })
      },
      // 对一级评论点赞
      onThumb(comment_id, index) {
        if (this.likeActiveIndex === index) {
          return;
        }
        let params = {
          comment_id,
          index
        }
        Api.commentLike(params).then(res => {
          if (res) {
            this.commentList[index].like += 1;
            this.likeActiveIndex = index;
          }
        }).catch(err => {
          this.$message({
            message: "点赞失败",
            type: "error"
          })
        })
      },
      showItemInput(index) {
        if (!this.$store.state.isLogin) {
          this.$store.commit('setVisible', true);
          this.$store.commit('setHandleFlag', 'login');
          return;
        }
        this.showItemId = index;
      },
      showItemTwoInput(n, index) {
        if (!this.$store.state.isLogin) {
          this.$store.commit('setVisible', true);
          this.$store.commit('setHandleFlag', 'login');
          return;
        }
        this.showItemTwoId = n;
        this.showFatherId = index;
      },
      cancel() {
        this.showItemId = '';
      },
      cancelTwo() {
        this.showItemTwoId = '';
      },
      submitComment(emitParams) {
        // 判断是否登录
        if (!this.$store.state.isLogin) {
          this.$message({
            message: "登录才能评论哦，请先登录",
            type: "warning"
          })
          return;
        }
        let params = {
          type: emitParams.type, // 1 为一级评论 直接评论文章作者  2 为二级评论
          owner_id: emitParams.ownerId || '',
          comment_id: emitParams.commentId || '',
          article_id: this.responseData._id,
          replier_id: localStorage.getItem('userId'), // 
          content: emitParams.content,
        }

        Api.commentOne(params).then(res => {
          this.$message({
            message: "评论成功",
            type: "success"
          })
          this.commentList = [];
          this.pageIndex = 1;
          this.$emit('getArticleOne');
          this.getCommentList();
          this.cancel();
          this.cancelTwo();
        }).catch(err => {
          this.$message({
            message: err.message,
            type: "error"
          })
        })
      },
    }
  } 
</script>

<style scoped lang="scss">
.page-article-comment {
  .comment-text {
    font-size: 15px;
    margin: 30px auto;
    padding-top: 20px;
    text-align: center;
  }
  .comment {
    .level {
      display: inline-block;
      font-size: 10px;
      padding: 1px 3px;
      border-radius: 2px;
      opacity: 0.5;
      margin: 0 3px;
      color: #fff;
      position: relative;
      top: -1px;
    }
    .iconfont {
      margin-right: 5px;
    }
    .comment-wrap {
      display: flex;
      justify-content: flex-start;
      padding: 12px 0;
      background: #fafbfc;
      .input-wrap {
        flex: 1;
        padding-right: 10px;
      }
      .user-avatar {
        width: 35px;
        height: 35px;
        margin: 0 10px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
    }
    .list {
      .reply-textarea {
        margin-top: 10px;
      }
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
      margin: 30px 0 0;
      padding-bottom: 10px;
      .no-data {
        padding: 20px 0 40px;
        color: #ec7259;
        text-align: center;
      }
      .content {
        display: flex;
        justify-content: flex-start;
        margin: 10px 0 15px 60px;
        &.last-content {
          margin-bottom: 0;
        }
        .avator {
          width: 35px;
          height: 32px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .info {
          width: 100%;
          margin-left: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
          &.last-comment {
            border: none;
          }
          .name {
            color: #333;
            font-size: 13px;
            line-height: 1.2;
            .ui-position {
              display: inline-block;
              color: $brand-primary;
            }
            .name-author {
              font-size: 12px;
              margin: 0 3px;
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
            line-height: 1.5;
            margin: 5px 0;
            .replay-color {
              color: #406599;
              .replay-author {
                font-size: 12px;
              }
            }
          }
          .handle {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            ._lt {
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
                  color: #aaa;
                }
                &:hover {
                  color: #666;
                  .icon-icon_huifu-mian {
                    color: #666;
                  }
                }
              }
            }
            ._rt {
              display: none;
              padding-right: 10px;
              cursor: pointer;
              color: #aaa;
            }
          }
          .reply-list {
            margin-top: 10px;
            .reply-item {
              display: flex;
              justify-self: flex-start;
              background: #fafbfc;
              padding: 10px 10px 0;
            }
          }
          .load-more {
            background: #fafbfc;
            text-align: center;
            .more-btn {
              display: inline-block;
              padding: 10px 20px;
              cursor: pointer;
            }
          }
        }
        .info-one:hover .delete-one {
          display: block;
        }
        .info-two:hover .delete-two {
          display: block;
        }
      }
      .more-comment {
        text-align: center;
        span {
          display: inline-block;
          padding: 5px 10px;
          cursor: pointer;
        }
      }
      &.m-list .content {
        margin: 0;
      }
    }

  }
  .replay-content {
    color: #2c3e50;
  }
}
</style>