<template>
  <div class="page-archive">
    <el-timeline>
      <el-timeline-item
        v-for="it in articleList"
        :key="it.year"
        type="success "
        placement="top"
        hide-timestamp>
        <h3 class="year">{{it.year}}</h3>

        <el-timeline-item
          v-for="item in it.list"
          :key="item._id"
          :color="item.state === 1 ? 'green' : item.state === 3 ? 'red' : ''"
          type="warning "
          placement="top"
          hide-timestamp>
          <a :href="`/article/${item._id}`">
            <h3 class="title">{{item.title}}</h3>
            </a>
          <p class="time">{{item.beginDate}}</p>
        </el-timeline-item>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import Api from '~/utils/api'
import { Timeline, TimelineItem } from 'element-ui';
export default {
  layout: 'article',
  head() {
    return {
      title: '归档',
      meta: [
        { hid: 'keywords', name: 'keywords', content: '归档，博客'},
        { hid: 'description', name: 'description', content: '博客笔记的时间档案' }
      ]
    }
  },
  // asyncData ({ params, router, error, req }) {
  //   return Api.articlelist(params.id, 1, 10)
  //       .then((res) => {
  //         return { articleData: res.data}
  //       }).catch (err => {
  //     console.log('报错了啊')
  //   })
  // },
  data() {
    return {
      articleList: []
    }
  },
  components: {
    Timeline,
    TimelineItem
  },
  computed: {
  },
  mounted() {
    let reqParams = {
        type: '2',
        pageIndex: 1,
        pageSize: 10
      };
    Api.articlelist(reqParams)
      .then((res) => {
        console.log(res.data.data.archive, 'ress');
        this.articleList = res.data.data.archive;
        // return { articleData: res.data}
      }).catch (err => {
      console.log('报错了啊')
    })

  }
}
</script>

<style lang="scss" scoped>
.page-archive {
  padding: 40px 0;
  .year {
    font-size: 30px;
    font-weight: bold;
    color: #000;
    margin-top: 0;
  }
  a {
    text-decoration: none;
  }

  .title {
    color: #333;
    &:hover {
      color: #409eff;
    }
  }
  .time {
    color: #333;
  }
}
</style>
