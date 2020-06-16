<template>
  <div class="page-authors-item" v-if="list.length > 0">
    <ul>
      <li v-for="(item, index) in list" :key="index">
        <div class="__item" @click.prevent="toLink(item)">
          <div class="_lt">
            <div class="img"><img :src="item.avatar || ''" alt=""></div>
          </div>
          <div class="info">
            <div class="user-name">
              {{item.userName || ''}}
              <span class="level" :style="{backgroundColor:levelToColor(item.level)}">Lv{{item.level || '1'}}</span>
              <span class="delete" v-if="$store.state.userName === 'jiangsc93'" @click.stop="deleteUser(item._id)">删除</span>
            </div>
            <div class="detail">
              <span class="positon">
                {{item.position || ''}}
              </span>
              <span class="company" v-if="item.company">
                @ {{item.company || ''}}
              </span>
            </div>
            <div class="introduce">{{item.introduce}}</div>
          </div>
          <div class="_rt" v-if="item.userName != $store.state.userName" @click.stop="onFollow(item, index)" :class="{'active': item.isCurentUserFollowed}">
            <span>{{ item.isCurentUserFollowed ? '已关注' : '关注'}}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
  <div class="page-authors-item" v-else>
    <div class="no-data">
      <div class="no-data-icon"><i class="iconfont icon-wushuju"></i></div>
      <div class="no-data-text">暂无数据！</div>
    </div>
  </div>
</template>

<script>
  import Api from '~/utils/api';
  export default {
    props: ['authorsList'],
    data() {
      return {
        list: this.authorsList
      }
    },
    mounted() {
    },
    methods: {
      deleteUser(id) {
        Util.UI.confirm('确定删除吗?', '提示').then(() => {
          Api.deleteUser({id})
            .then(res => {
              Util.UI.toast('用户删除成功!', 'success');
              window.location.reload();
            })
          }, () => {
          })
      },
      toLink(item) {
        location.href = `/user/${item._id}`;
      },
      onFollow(item, index) {
        if (!this.$store.state.isLogin) {
          this.$store.commit('setVisible', true);
          this.$store.commit('setHandleFlag', 'login');
          return;
        }
        if (!item.isCurentUserFollowed) { // 还未关注
          let postParams = {
            owner_id: item._id,
            follower_id: this.$store.state.userId,
          }
          Api.follow(postParams)
            .then(res => {
              this.list[index].isCurentUserFollowed = true;
            })
        } else {
          let postParams = {
            owner_id: item._id,
            follower_id: this.$store.state.userId,
          }
          Api.unfollow(postParams)
            .then(res => {
              this.list[index].isCurentUserFollowed = false;
            })
        }
      },
    }
  } 
</script>

<style scoped lang="scss">
.page-authors-item {
  .__item {
    display: flex;
    align-items: center;
    padding: 15px;
    background: #fff;
    border-bottom: 1px solid #f1f1f1;
    cursor: pointer;
    &:hover {
      background: #fafbfc;
    }
    ._lt {
      flex: 0 0 auto;
      .img {
        width: 45px;
        height: 45px;
        margin-right: 15px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
    }
    .info {
      flex: 1 1 auto;
      .user-name {
        color: #333;
        font-size: 13px;
        font-weight: bold;
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
        .delete {
          color: #555;
          font-size: 13px;
          margin-left: 5px;
          font-weight: normal;
        }
      }
      .detail {
        color: #b9c0c8;
        font-size: 12px;
        margin-top: 4px;
      }
    }
    ._rt {
      flex: 0 0 auto;
      margin-left: 15px;
      width: 61px;
      height: 26px;
      line-height: 26px;
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