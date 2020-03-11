<template>
  <div class="page-archive">
    <el-timeline :class="isMobile ? 'ul_m' : ''">
      <el-timeline-item
        v-for="it in archiveList"
        :key="it.year"
        type="success "
        placement="top"
        hide-timestamp>
        <h3 class="year">{{it.year}}</h3>
        <el-timeline-item
          v-for="(m, index) in it.list"
          :key="index"
          type="warning "
          placement="top">
          <nuxt-link :to="`/article/${m._id}`" target="_blank">
            <h3 class="title">{{m.title}}</h3>
          </nuxt-link>
          <p class="time">{{m.beginDate}}</p>
        </el-timeline-item>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import Api from '~/utils/api'
import { Timeline, TimelineItem } from 'element-ui';
import { mapState } from 'vuex'
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
  data() {
    return {
      archiveList: [],
    }
  },
  components: {
    Timeline,
    TimelineItem
  },
  computed: {
    ...mapState(['isMobile'])
  },
  mounted() {
    this.getArchiveList();
  },
  methods: {
    goArticle(id) {
      window.location.href = `/article/${id}`;
    },
    getArchiveList() {
      let reqParams = {
        type: '2',
        pageIndex: 1,
        pageSize: 10
      };
      Api.getArticleList(reqParams)
        .then(result => {
          if (result.status === 200 && result.data && result.data.data && result.data.data.archive) {
            this.archiveList = result.data.data.archive;
          }
        }).catch (err => {
          console.log('报错了啊')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-timeline .el-timeline-item:last-child .el-timeline-item__tail {
  display: block!important;
}
.page-archive {
  padding: 40px 0;
  .ul_m.el-timeline {
    padding-left: 10px;
  }
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
    padding-bottom: 6px;
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
