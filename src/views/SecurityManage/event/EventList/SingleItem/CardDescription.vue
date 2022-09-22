<template>
  <div class="card-item">
    <div class="card-title">
      <el-tooltip>
        <template #content>
          <div>{{ formatTime(data.create) }}</div>
          <div>{{ data.create }}</div>
        </template>
        <div class="card-title">
          <div class="title-content">{{ data.tag.title }}</div>
          <div class="title-description">{{ data.tag.desc }}</div>
        </div>
      </el-tooltip>
    </div>
    <div class="card-summary">
      <div class="card-summary-title">{{ summary }}</div>
      <div
        class="card-summary-decription"
      >{{ (data.content && data.content.substr(0,50))||'无详细内容' }}</div>
    </div>
  </div>
</template>

<script>
import { formatTime } from '@/utils'
export default {
  name: 'CardDescription',
  props: {
    data: { type: Object, required: true }
  },
  computed: {
    summary() {
      const data = this.data
      if (!data) return '无'
      const host = data.host && data.host.userSummary
      const hostDesc = (host && host.realName) || '无主持'
      return `${data.title} ${hostDesc}`
    }
  },
  methods: {
    formatTime
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/common-list';
.card-item {
  display: flex;
  .card-summary {
    width: 100%;
    .card-summary-decription {
      opacity: 0.6;
      font-size: 0.8rem;
      overflow-wrap: break-word;
    }
    .card-summary-title {
      font-size: 1.2rem;
      overflow: hidden;
    }
  }
  .card-title {
    width: 3.7rem;
  }
}
</style>
