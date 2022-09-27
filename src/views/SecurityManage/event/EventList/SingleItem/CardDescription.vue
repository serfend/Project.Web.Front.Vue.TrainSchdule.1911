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
      <div class="card-summary-title">{{ summary || '无标题' }}</div>
      <div
        class="card-summary-decription"
      >{{ data.content||'无详细内容' }}</div>
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
      if (!data) return '无效信息'
      return data.title
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
    margin-bottom:2rem;
    .card-summary-decription {
      opacity: 0.6;
      font-size: 1.2rem;
      overflow-wrap: break-word;
    }
    .card-summary-title {
      font-size: 1.8rem;
      overflow: hidden;
    }
  }
  .card-title {
    width: 10rem;
  }
}
</style>
