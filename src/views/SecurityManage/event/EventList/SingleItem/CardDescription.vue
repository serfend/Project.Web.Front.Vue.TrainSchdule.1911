<template>
  <div class="card-item">
    <div class="card-title" :style="{width:`${size*10}rem`}">
      <el-tooltip>
        <template #content>
          <div>{{ formatTime(data.create) }}</div>
          <div>{{ data.create }}</div>
        </template>
        <div class="card-title" :style="{height:`${6*size}rem`,'padding-right':`${0.7*size}rem`}">
          <div class="title-content" :style="{'font-size':`${2.2*size}rem`}">{{ data.tag.title }}</div>
          <div class="title-description" :style="{'font-size':`${1.2*size}rem`}">{{ data.tag.desc }}</div>
        </div>
      </el-tooltip>
    </div>
    <div class="card-summary" :style="{'margin-bottom':`${2*size}rem`}">
      <div class="card-summary-title" :style="{'font-size':`${1.8*size}rem`}">{{ summary || '无标题' }}</div>
      <div
        class="card-summary-decription"
        :style="{'font-size':`${1.2*size}rem`}"
      >{{ data.content||'无详细内容' }}</div>
    </div>
  </div>
</template>

<script>
import { formatTime } from '@/utils'
export default {
  name: 'CardDescription',
  props: {
    data: { type: Object, required: true },
    size: { type: Number, default: 1 }
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
    .card-summary-decription {
      opacity: 0.6;
      overflow-wrap: break-word;
    }
    .card-summary-title {
      overflow: hidden;
    }
  }
}
</style>
