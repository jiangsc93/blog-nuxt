<template>
  <div class="item">
    <div class="__lt">
      <h2 class="title">{{responseData.title}}</h2>
      <div class="author">
        <div class="lt">
          <img class="avatar" src="../../assets/images/user_logo.png" alt="">
          <div class="info">
            <div class="name">{{responseData.author}}</div>
            <div>
              <span class="time"><i class="iconfont icon-shijian"></i>{{responseData.beginDate}}</span>
              <span class="wordage">字数 {{responseData.wordage || 2333}}</span>
              <span class="visit inline-b"><i class="iconfont icon-yanjing"></i>{{responseData.visit || '1'}}次浏览</span>
            </div>
          </div>
        </div>
        <div class="tag inline-b">
          <el-tag v-for="(x, y) in handleTag(responseData.tag)" :key="y">{{x}}</el-tag>
        </div>
      </div>
      <div class="cont"><div class="inline-b _wrap article-detail" v-html="responseData.content"></div></div>
    </div>
    <div
      class="__rt fr anchor"
      v-html="responseData.toc"></div>
  </div>
</template>

<script>
import Api from '~/utils/api'
import markdown from '~/utils/markdown'
import { Tag, Loading } from 'element-ui'
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
  asyncData ({ params, error }) {
    return Api.getArticleOne(params.id)
        .then((res) => {
          let responseData = res.data.data;
          if (res.status === 200 && res.data && res.data.data.content) {
            // markdown 处理
            const article = markdown.marked(res.data.data.content);
            article.then((r) => {
              responseData.content = r.content;
              responseData.toc = r.toc;
            });
            return { responseData }
          }
      }).catch (err => {
      console.log('报错了啊')
    })
  },
  components: {
    Tag,
    Loading
  },
  data () {
    return {
      responseData: {},
      content: '',
      toc: ''
    }
  },
  beforeMount() {
    
  },
  mounted() {
    console.log(this.responseData, 'title')
    document.title = this.responseData.title;
    document.querySelector("#keywords").setAttribute("content", this.responseData.tag);
    document.querySelector("#description").setAttribute("content", this.responseData.summary);
  },
  methods: {
    handleArticle() {

    },
    handleTag(tag) {
      if (tag) return tag.split(',')
    }
  }
}
</script>

<style lang="scss">
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
    // &.active {
    //   color: red;
    // }
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
    max-width: 250px;
    border: none;
    -moz-box-shadow: 0 0px 0px #fff;
    -webkit-box-shadow: 0 0px 0px #fff;
    box-shadow: 0 0px 0px #fff;

    li.active {
      color: #009a61;
    }
  }
}
.item {
    width: 100%;
    padding: 10px 0 40px;
    border-radius: 4px;
    background: #fff;
    .__lt {
      width: 66%;
      float: left;
      padding-right: 20px;
    }
    .__rt {
      width: 28%;
      float: right;
      display: block;
      position: sticky;
      top: 213px;
      right: 70px;
    }
    a {
      color: inherit;
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
      // border-bottom: 1px solid #ddd;
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
    .author {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      height: 50px;
      color: #969696;
      margin-bottom: 30px;
      position: relative;
      .lt {
        overflow: hidden;
        position: relative;
        .avatar {
          position: absolute;
          top: 0;
          left: 0;
          width: 45px;
          height: 45px;
          border-radius: 50%;
        }
        .info {
          float: left;
          padding-left: 55px;
          line-height: 1;
          .time {
            .iconfont {
              font-size: 12px;
            }
          }
          .name {
            margin: 5px 0 6px 0;
            color: #555;
            font-size: 13px;
          }
          .visit {
            margin: 0 13px;
          }
          .wordage {
            margin-left: 10px;
          }
        }
      }
      .tag {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
      }
    }
  }
</style>
