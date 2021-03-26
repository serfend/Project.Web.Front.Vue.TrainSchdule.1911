<template>
  <el-progress :percentage="percent" :format="formatPercent" :stroke-width="24" text-inside />
</template>

<script>
import { datedifference } from '@/utils'
export default {
  name: 'IndayApplyProgress',
  props: {
    stampLeave: { type: [Date, String], default: null },
    stampReturn: { type: [Date, String], default: null },
    show: { type: Boolean, default: true }
  },
  data: () => ({
    refresher: null,
    percent: 0,
    spent: 0,
    total: 0
  }),
  mounted() {
    this.refresher = setInterval(() => {
      this.update()
    }, 1000)
  },
  destroyed() {
    clearInterval(this.refresher)
  },
  methods: {
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
