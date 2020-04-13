<template>
  <div class="page-archive">
    <el-timeline>
      <el-timeline-item
        v-for="(item, index) in experienceList"
        :key="index"
        type="success "
        placement="top"
        hide-timestamp>
        <el-card>
          <h3 class="title">{{item.title}}</h3>
          <p class="description">{{ item.description }}</p>
          <p class="time">
            <span>{{item.start_time  || ''}}</span> -- 
            <span>{{item.end_time || ''}}</span>
          </p>
        </el-card>
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
      title: '历程',
      meta: [
        { hid: 'keywords', name: 'keywords', content: '历程'},
        { hid: 'description', name: 'description', content: '蒋少川从事前端的个人历程' }
      ]
    }
  },
  async asyncData() {
    return Api.getExperienceList()
        .then(res => {
          if (res.status === 200 && res.data && res.data.data.list) {
            let experienceList = res.data.data.list;
            return { experienceList };
          }
      }).catch (err => {
        console.log('报错了啊')
      })
  },
  data() {
    return {
      experienceList: [],
    }
  },
  components: {
    Timeline,
    TimelineItem
  },
}
</script>

<style lang="scss" scoped>
.page-archive {
  padding: 40px 0;
  ul {
    padding-left: 16px;
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
    color: #333;
    font-weight: 600;
  }
  .description {
    padding: 6px 0;
    color: #333;
    font-size: 13px;
    line-height: 1.5;
  }
  .time {
    color: #666;
    font-size: 12px;
  }
}
</style>
