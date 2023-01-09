<template>
  <div style="height:100%">
    <el-row class="weather-card">
      <WeatherGroup :district="districtUp" />
    </el-row>
    <el-row class="weather-card">
      <WeatherGroup :district="districtDown" />
    </el-row>
  </div>
</template>
<script>
import { getConfig } from '@/api/common/general_config'
import { distinct } from '@/utils'
export default {
  name: 'WeatherCard',
  components: {
    WeatherGroup: () => import('@/components/Weather/WeatherGroup')
  },
  props: {
    configId: { type: String, required: true }
  },
  data: () => ({
    district: []
  }),
  computed: {
    districtUp() {
      const { district } = this
      return district.filter((x, index) => (index + 1) % 2)
    },
    districtDown() {
      const { district } = this
      return district.filter((x, index) => index % 2)
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const { configId } = this
      getConfig({ name: configId }).then(data => {
        try {
          this.district = distinct(JSON.parse(data.model.data), x => x)
        } catch (e) {
          this.$message.error(`未配置有效天气数据:${configId}`)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.weather-card {
  margin: 1rem 0;
  padding: 1rem 0.5rem;
  height: 10rem;
}
</style>
