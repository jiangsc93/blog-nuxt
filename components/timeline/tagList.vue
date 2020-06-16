<template>
  <div class="page-timeline-taglist" :class="{'m-page-timeline-taglist': isMobile}">
    <ul class="nav-ul">
      <li class="tag-item"
        :class="{ 'active': isActive(item) }"
        @click="onChooseTag(item)"
        v-for="(item, index) in tagList"
        :key="index">
        {{item}}
      </li>
    </ul>
  </div>
</template>

<script>
import Api from '~/utils/api'
import { mapState } from 'vuex';

export default {
  props: ['tagList'],
  data() {
    return {
      isFixed: false,
      tagLists: []
    }
  },
  computed: {
    ...mapState(['isMobile']),
  },
  mounted() {
  },
  methods: {
    onChooseTag(item) {
      location.href = `${this.$route.path}?tag=${item}`;
    },
    isActive(item) {
      if (item === this.$route.query.tag) {
        return true;
      } else if (!this.$route.query.tag && item === '全部') {
        return true;
      } else {
        return false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-timeline-taglist {
  width: 72%;
  padding: 0 0 10px;
  .tag-item {
    display: inline-block;
    margin: 0 20px 8px 0;
    padding: 4px 10px;
    background: #fff;
    color: $font-color3;
    border-radius: 20px;
    cursor: pointer;
    &.active {
      background: $brand-primary;
      color: #fff;
    }
    &:hover {
      color: $brand-primary;
    }
    &.active:hover {
      background: $brand-primary;
      color: #fff;
    }
  }
  &.m-page-timeline-taglist {
    width: 100%;
    padding: 22px 20px 0 20px;
  }
}
</style>
