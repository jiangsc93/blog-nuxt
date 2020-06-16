<template>
  <div>
    <div class="page-user-follows" v-if="followAuthorList.length === 0 && $route.query.type !== 'articles'">
      <div class="no-data">
        <div class="no-data-icon"><i class="iconfont icon-wushuju"></i></div>
        <div class="no-data-text">暂无数据！</div>
      </div>
    </div>
    <div class="page-user-follows" v-else>
      <ul>
        <li v-for="(item, index) in followAuthorList" :key="index">
          <div class="__item" @click.prevent="toLink(item)">
            <div class="_lt">
              <div class="img"><img :src="item[whosInfo].avatar || ''" alt=""></div>
              <div class="info">
                <div class="user-name">
                  {{item[whosInfo].userName || ''}}
                  <span class="level"></span>
                </div>
                <div class="detail">
                  <span class="positon">{{item[whosInfo].position || ''}}</span>
                  <span class="company" v-if="item[whosInfo].company">
                    @ {{item[whosInfo].company || ''}}
                  </span>
                </div>
              </div>
            </div>
            <div class="_rt" v-if="item[whosInfo]._id !== $store.state.userId"  @click.stop="onFollow(item, index)" :class="{'active': item.isCurentUserFollowed}">
              {{ item.isCurentUserFollowed ? '已关注' : '关注'}}
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import Api from '~/utils/api';
  export default {
    props: {
      followList: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        whosInfo: this.$route.query.type === 'followers' ? 'follower_info' : 'owner_info',
        followAuthorList: this.followList
      }
    },
    watch: {
      followAuthorList: {
        handler: function(val) {
          this.followAuthorList = val;
        },
        deep: true
      }
    },
    mounted() {44
    },
    methods: {
      toLink(item) {
        location.href = `/user/${item[this.whosInfo]._id}`;
      },
      onFollow(item, index) {
        if (!this.$store.state.isLogin) {
          this.$store.commit('setVisible', true);
          this.$store.commit('setHandleFlag', 'login');
          return;
        }
        if (!item.isCurentUserFollowed) { // 还未关注
          let postParams = {
            owner_id: this.$route.query.type === 'followers' ? item.follower_id : item.owner_id,
            follower_id: this.$store.state.userId,
          }
          Api.follow(postParams)
            .then(res => {
              this.followAuthorList[index].isCurentUserFollowed = !this.followAuthorList[index].isCurentUserFollowed;
            })
        } else {
          let postParams = {
            owner_id: this.$route.query.type === 'followers' ? item.follower_id : item.owner_id,
            follower_id: this.$store.state.userId,
          }
          Api.unfollow(postParams)
            .then(res => {
              this.followAuthorList[index].isCurentUserFollowed = false;
            })
        }
      },
    }
  } 
</script>

<style scoped lang="scss">
.page-user-follows {
  .__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: #fff;
    border-bottom: 1px solid #f1f1f1;
    cursor: pointer;
    &:hover {
      background: #fafbfc;
    }
    ._lt {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .img {
        width: 45px;
        height: 45px;
        margin-right: 10px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .info {
        .user-name {
          color: #333;
          font-size: 13px;
          font-weight: bold;
        }
        .detail {
          color: #b9c0c8;
          font-size: 12px;
          margin-top: 4px;
        }
      }
    }
    ._rt {
      width: 60px;
      height: 26px;
      line-height: 23px;
      font-size: 13px;
      text-align: center;
      background: #fff;
      color: #ec7259;
      border-radius: 3px;
      border: 1px solid #ec7259;
      cursor: pointer;
      &.active {
        background: #ec7259;
        opacity: 0.8;
        color: #fff;
      }
      &:hover {
        opacity: 0.7;
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
}
</style>