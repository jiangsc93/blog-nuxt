<template>
  <div v-if="articleList.length > 0">
    <div class="content-item" v-for="(item, index) in articleList" :key="index">
      <div class="__head">
        <div class="_lt">
          <div class="img">
            <img :src="userInfo.avatar" alt="头像">
          </div>
          <div class="user-info">
            <div class="user-name">{{userInfo.userName}}</div>
            <div class="other">
              <span class="position">{{userInfo.position}}</span>
              <span class="interval" v-if="userInfo.position && userInfo.company"> @ </span>
              <span class="company">{{userInfo.company}}</span>
              <span class="interval" v-if="userInfo.position || userInfo.company"> - </span>
              <span v-text="formatTime(item.beginDate)"></span>
            </div>
          </div>
        </div>
        <div class="_rt">
          <div class="follow-wrap" v-if="$store.state.isUserself && $store.state.userId === userInfo._id">
            <el-dropdown @command="onCommand">
              <span class="el-dropdown-link">
                <i class="iconfont icon-gengduo"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="composeValue(1, item._id)">编辑</el-dropdown-item>
                <el-dropdown-item :command="composeValue(2, item._id)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
      <div class="__middle">
        <h2 class="__title ellipsis">
          <a :href="`/article/${item._id}`">{{item.title}}</a>
        </h2>
        <div class="__content" @click="toLink(item)">
          <div class="_lt" :class="{'m_lt': isMobile}" v-if="item.imgSrc">
            <img :src="item.imgSrc" alt="封面">
          </div>
          <div class="_rt">
            <div class="summary ellipsis"><span class="_summary"><a :href="`/article/${item._id}`">{{item.summary}}</a></span></div>
          </div>
        </div>
        <div class="__footer">
          <div class="like"><i class="iconfont icon-dianzan1"></i> {{item.like}}</div>
          <div class="comments"><i class="iconfont icon-icon_huifu-mian"></i> {{item.comments_num}}</div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="no-data">
    <div class="no-data-icon"><i class="iconfont icon-wushuju"></i></div>
    <div class="no-data-text">暂无数据！</div>
  </div>
</template>

<script>
  import Api from '~/utils/api';
  import { mapState } from 'vuex';
  export default {
    props: ['articleList', 'userInfo'],
    data() {
      return {
      }
    },
    computed: {
      ...mapState(['isMobile']),
    },
    mounted() {
    },
    methods: {
      toLink(item) {
        location.href = `/article/${item._id}`;
      },
      deletArticle(id) {
        Util.UI.confirm('确定删除吗?', '提示').then(() => {
          Api.deleteArticleAdmin({id})
            .then(res => {
              Util.UI.toast('文章删除成功!', 'success');
              window.location.reload();
            })
          }, () => {
          })
      },
      onCommand(command) {
        if (command.command === 1) {
          location.href = `/edit?aid=${command.id}`;
        } else {
          this.deletArticle(command.id);
        }
      },
      composeValue(command, id) {
        return {
          command,
          id
        }
      }
    }
  } 
</script>

<style lang="scss">
.follow-wrap .el-dropdown-link {
  display: inline-block;
  padding: 0 15px;
  cursor: pointer;
  .iconfont {
    color: #b2bac2;
    font-size: 18px;
    &:hover {
      color: #888;
    }
  }
}
</style>

<style scoped lang="scss">
  .content-item {
    display: block;
    width: 100%;
    padding: 15px 20px;
    margin-bottom: 10px;
    background: #fff;
    border-bottom: 1px solid #f2f2f2;
    &:hover {
      background: #fcfcfc;
    }
    .__head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      ._lt {
        display: flex;
        justify-content: flex-start;
        .img {
          width: 40px;
          height: 40px;
          margin-right: 10px;
          img {
            border-radius: 50%;
          }
        }
        .user-info {
          .user-name {
            color: #1a1a1a;
          }
          .other {
            color: #8a9aa9;
          }
        }
      }
      ._rt {
        .follow {
          width: 54px;
          height: 30px;
          line-height: 30px;
          border: 1px solid $brand-primary;
          color: $brand-primary;
          border-radius: 4px;
          text-align: center;
          cursor: pointer;
          &:hover {
            border: 1px solid rgba(95,158,160, .8);
            color: rgba(95,158,160, .8);
          }
        }
      }
    }
    .__middle {
      margin-left: 45px;
      .__title {
        margin: 0;
        font-size: 18px;
        font-weight: bold;
        line-height: 2.5;
        color: #1a1a1a;
        a {
          display: inline-block;
          width: 100%;
        }
      }
      .__content {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 10px;
        cursor: pointer;
        ._lt {
          width: 23%;
          margin-right: 20px;
          height: 100px;
          &.m_lt {
            height: 70px;
          }
          img {
            border-radius: 4px;
          }
        }
      }
      .__footer {
        div {
          display: inline-block;
          margin-right: 15px;
          color: #b2bac2;
        }
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
</style>