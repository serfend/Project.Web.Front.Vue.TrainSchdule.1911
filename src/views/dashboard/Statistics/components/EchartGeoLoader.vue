<template>
  <div v-loading="loading" class="display-item">geo data loader</div>
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'StatisticsDataDriver',
  props: {
    fileLoad: {
      type: Function,
      default: null
    }
  },
  data: () => ({
    loading: false
  }),
  methods: {
    async refresh() {
      if (this.fileLoad == null) return this.$message.error('配置获取失败')
      var geoJson = await this.fileLoad('china-200524.json')
      echarts.registerMap('china', geoJson)
    }
  }
}
</script>
<style lang="scss" scoped>
.display-item {
  color: #aaa;
  font-size: 0.3em;
}
</style>
