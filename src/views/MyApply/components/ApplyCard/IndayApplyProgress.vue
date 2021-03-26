<template>
  <span>
    <el-progress
      v-if="!executeItem"
      :percentage="percent"
      :format="formatPercent"
      :stroke-width="24"
      text-inside
    />
    <span v-else>
      <el-tooltip :content="executeItem.returnStamp">
        <span>{{ formatTime(executeItem.returnStamp) }}</span>
      </el-tooltip>
      <span>已归队</span>
      <span v-if="executeItem.reason">({{ executeItem.reason }})</span>
    </span>
  </span>
</template>

<script>
import { datedifference, formatTime } from '@/utils'
import { getExecuteStatus } from '@/api/apply/recall'
export default {
  name: 'IndayApplyProgress',
  props: {
    stampLeave: { type: [Date, String], default: null },
    stampReturn: { type: [Date, String], default: null },
    executeId: { type: String, default: null },
    show: { type: Boolean, default: true }
  },
  data: () => ({
    entityType: 'inday',
    executeItem: null,
    refresher: null,
    percent: 0,
    spent: 0,
    total: 0
  }),
  watch: {
    executeId: {
      handler(val) {
        if (!val) this.executeItem = null
        else this.updateExecuteItem()
      },
      immediate: true
    }
  },
  mounted() {
    this.refresher = setInterval(() => {
      this.update()
    }, 1000)
  },
  destroyed() {
    clearInterval(this.refresher)
  },
  methods: {
    formatTime,
    updateExecuteItem() {
      getExecuteStatus({
        id: this.executeId,
        entityType: this.entityType
      }).then(data => {
        this.executeItem = data
      })
    },
    update() {
      if (!this.show) return
      this.percent = this.get_percent()
    },
    get_total() {
      if (!this.stampReturn) return 1
      return 1 + datedifference(this.stampReturn, this.stampLeave, 'second')
    },
    get_spent() {
      if (!this.stampReturn) return 0
      return 1 + datedifference(new Date(), this.stampLeave, 'second')
    },
    get_percent() {
      this.total = this.get_total()
      const total = this.total
      const spent = (this.spent = this.get_spent())
      if (total === 0) return 10
      if (spent < 0) return 0
      if (spent > total) return 100
      return (spent / total) * 100
    },
    formatPercent(val) {
      const left = (this.total - this.spent) / 1e3
      const h = Math.floor(left / 3600)
      const m = Math.floor((left % 3600) / 60)
      const s = Math.floor(left % 60)
      const left_desc = `${h}h${m}m${s}s`
      if (this.spent <= 0) return `${left_desc} 未开始`
      if (val >= 100) return '已结束'
      const percent = `${Math.round((this.spent / this.total) * 10000) / 100}%`
      return `${left_desc} ${percent}`
    }
  }
}
</script>
