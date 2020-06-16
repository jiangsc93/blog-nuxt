<template>
  <div class="page-notification-item">
    <ul v-if="notificationList.length > 0">
      <li class="item-li"
        v-for="(item, index) in notificationList"
        :key="index">
        <div class="item" v-if="item.itemType === 'comment'">
          <div class="head">
            <a :href="`/user/${item.replier_id}`">
              <div class="_avatar"><img :src="item.replier_info.avatar" alt=""></div>
              <div class="_content">
                <div class="username">{{ item.replier_info.userName }}</div>
                <div class="info">
                  <span class="position">{{ item.replier_info.position }}  @ {{ item.replier_info.company }}</span> - 
                  <span class="create-time">{{ formatTime(item.create_time) }}</span>
                </div>
              </div>
            </a>
          </div>
          <div class="bottom">
            <div class="comment" v-if="item.itemType === 'comment'" v-html="item.content"></div>
            <div class="article">
              <span class="_head"><i class="iconfont" :class="item.itemType === 'comment' ? 'icon-icon_huifu-mian' : 'icon-dianzan1'"></i>
              {{ item.itemType === 'comment' ? '评论了:' : '赞了:' }}
              </span>
              <a :href="`/article/${item.article_id}`">{{ '文章标题标题' }}</a>
            </div>
          </div>
        </div>
        <div class="item" v-else-if="item.itemType === 'like'">
          <a :href="`/user/${item.liker_id}`" class="head" v-if="item.liker_info">
            <!-- <div class="_avatar"><img :src="item.liker_info.avatar" alt=""></div>
            <div class="_content">
              <div class="username">{{ item.liker_info.userName }}</div>
              <div class="info">
                <span class="position">{{ item.liker_info.position }}  @ {{ item.liker_info.company }}</span> - 
                <span class="create-time">{{ formatTime(item.create_time) }}</span>
              </div>
            </div> -->
          </a>
          <div class="bottom">
            <div class="article">
              <span class="_head"><i class="iconfont" :class="item.itemType === 'comment' ? 'icon-icon_huifu-mian' : 'icon-dianzan1'"></i>
              {{ item.itemType === 'comment' ? '评论了:' : '赞了:' }}
              </span>
              <a :href="`/article/${item.article_id}`">文章标题</a>
            </div>
          </div>
        </div>
        <div class="item" v-else>
          <div class="head">
            <a :href="`/user/${item.follower_id}`">
              <div class="_avatar"><img :src="item.follower_info.avatar" alt=""></div>
              <div class="_content">
                <div class="username">{{ item.follower_info.userName }}</div>
                <div class="info">
                  <span class="position">{{ item.follower_info.position }}  @ {{ item.follower_info.company }}</span> - 
                  <span class="create-time">{{ formatTime(item.create_time) }}</span>
                </div>
              </div>
            </a>
          </div>
          <div class="bottom">
            <div class="comment" v-if="item.itemType === 'comment'" v-html="item.content"></div>
            <div class="article follow">
              <div class="_head">关注了我</div>
              <!-- <div class="btn-follow">关注Ta</div> -->
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div class="no-data" v-else>
      <!-- <div><i class="iconfont icon-lingdang"></i></div> -->
      <div>暂无新的通知</div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['notificationList'],
    data() {
      return {
        item: {}
      }
    },
    
    methods: {
      
    }
  } 
</script>

<style scoped lang="scss">
  .page-notification-item {
    .item-li {
      background: #fff;
      padding: 10px 15px;
      margin-bottom: 15px;
      .item {
        .head {
          ._avatar {
            width: 40px;
            height: 40px;
            margin-right: 10px;
            display: inline-block;
            vertical-align: top;
            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          ._content {
            display: inline-block;
            .username {
              font-weight: bold;
              margin-bottom: 5px;
            }
            .info {
              font-size: 12px;
              color: #8a9aa9;
              margin-bottom: 3px;
              .create-time {
                color: #666;
              }
            }
          }
        }
        .bottom {
          margin: 8px 0 5px 50px;
          .comment {
            margin: 5px 0;
          }
          .article {
            padding: 8px 12px;
            background: #f8f8f8;
            ._head {
              color: #a1a9b3;
              .iconfont {
                color: cadetblue;
                opacity: 0.6;
              }
            }
            &.follow {
              display: flex;
              justify-content: space-between;
              align-items: center;
              .btn-follow {
                padding: 2px 10px;
                border: 1px solid $brand-primary;
                color: $brand-primary;
                border-radius: 3px;
                font-weight: bold;
                cursor: pointer;
                &:hover {
                  opacity: 0.7;
                }
              }
            }
          }
        }
      }
    }
    .no-data {
      background: #fff;
      padding: 25px 0;
      text-align: center;
      div {
        text-align: center;
        i {
          font-size: 35px;
          color: #a1a9b3;
        }
      }
    }
  }
</style>