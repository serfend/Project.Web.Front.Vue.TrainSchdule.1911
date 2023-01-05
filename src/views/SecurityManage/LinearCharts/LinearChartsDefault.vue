<template>
  <Index v-loading="loading" :chart-data1="chartData1" :chart-data2="chartData2" :height="height" :width="width" />
</template>
<script>
import { getConfig } from '@/api/common/general_config'
export default {
  name: 'LinearChartsDefault',
  components: {
    Index: () => import('./index')
  },
  props: {
    width: { type: String, default: '100%' },
    height: { type: Number, default: 34 },
  },
  data: () => ({
    loading: false,
    chartData1: null,
    chartData2: null,
    refresher: null
  }),
  computed: {
  },
  mounted () {
    setTimeout(this.refresh, 1e3)
    this.refresher = setInterval(this.refresh, 60e3)
  },
  destroyed() {
    clearInterval(this.refresher)
  },
  methods: {
    refresh () {
      const name = 'global.sec.linearCharts'
      this.loading = true
      getConfig({ name }).then((result) => {
        try {
          const data = JSON.parse(result.model.data)
          this.chartData1 = data.chartData1
          this.chartData2 = data.chartData2
        } catch {
          this.$message.error(`折线数据加载失败:${name}`)
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
