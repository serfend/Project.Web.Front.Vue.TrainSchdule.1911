<template>
  <div>
    <el-row>
      <el-col class="primary-icon" :span="7">
        <LottieIcon
          :animation-data="weather_dict[0].data"
          :animate-speed="0.5"
          style="width:90%;margin: auto;color:#fff"
        />
      </el-col>
      <el-col :span="8">
        <h2 class="primary-tempature">{{ getTemperature(weather_dict[0]) }}</h2>
        <span class="primary-subtitle">{{ getProp(weather_dict[0],'subLabel') || getWeatherName(getProp(weather_dict[0],'type')) }}</span>
      </el-col>
      <el-col class="primary-title" :span="8">
        <span>{{ getProp(weather_dict[0],'label') }}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col v-for="(i,index) in ['今天','明天','后天']" :key="index" :span="8">
        <div v-if="weather_dict[index]">
          <el-row class="secondary-title">
            <span>{{ i }}</span>
          </el-row>
          <el-row class="secondary-icon">
            <LottieIcon
              :animation-data="weather_dict[index].data"
              :animate-speed="0.5"
              style="width:90%;margin: auto;color:#fff"
            />
          </el-row>
          <el-row class="secondary-subtitle">
            <span>{{ (index>0 && getProp(weather_dict[index],'subLabel')) || getTemperatureRange(weather_dict[index]) }}</span>
          </el-row>
        </div>
        <NoData v-else :size="0.5" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import weatherData from './weather'
import { getDistrictWeather } from '@/api/common/weather'
import { getProp } from '@/utils/data-handle'
import { datedifference } from '@/utils'
export default {
  name: 'Weather',
  components: {
    LottieIcon: () => import('@/components/LottieIcon'),
    NoData: () => import('@/views/Loading/NoData'),
  },
  model: {
    prop: 'data',
    event: 'change'
  },
  props: {
    data: {
      type: [Object, Number], // 数据对象 或 区域代码
      default: () => ({
        name: '晴',
        temperature: { current: 8, hourSeries: [] },
        label: '北京',
        sublabel: '东南风 2-3级 寒冷',
        children: [
          {
            name: '晴',
            temperature: { min: 4, max: 17 },
            label: '今天'
          },
          {
            name: '多云',
            temperature: { min: 3, max: 15 },
            label: '明天'
          },
          {
            name: '阴',
            temperature: { min: 3, max: 16 },
            label: '后天'
          }
        ]
      })
    },
    weatherData: { type: Array, default: null }
  },
  data: () => ({
    weather_dict: [],
    loading: false
  }),
  watch: {
    data: {
      handler() {
        this.initWeatherData()
      },
      immediate: true
    }
  },
  methods: {
    getProp,
    getSingle (weather) {
      const n = weather.name || this.getWeatherName(weather.type)
      let v = weatherData[n]
      if (!v) v = weatherData['无']
      v = v()
      return Object.assign({ data: v }, weather)
    },
    getTemperatureRange (w) {
      const max = getProp(w, ['temperature', 'max'])
      const min = getProp(w, ['temperature', 'min'])
      if (max === null || min === null) return '-'
      return `${min}-${max}℃`
    },
    getTemperature (w) {
      const max = getProp(w, ['temperature', 'max'])
      const min = getProp(w, ['temperature', 'min'])
      if (max === null || min === null) return '-'
      const v = min + (max - min) * weatherData.temperatureMockDict[new Date().getHours()]
      return `${Math.round(v)}℃`
    },
    getWeatherName (type) {
      return weatherData.weatherDict[type] || '未知'
    },
    initWeatherData() {
      const { data } = this
      if (!data) return
      this.weather_dict = [{}]

      // 当前为对象 则直接加载
      if (Object.prototype.toString.call(data) !== '[object Number]') {
        this.weather_dict[0] = this.getSingle(data) || {}
        data.children.map((i, index) => {
          this.weather_dict[index + 1] = this.getSingle(i)
        })
        this.$emit('update:weatherData', data)
        return
      }

      // 否则从远程获取
      const datestart = new Date()
      const dateend = new Date(datestart.getTime() + 86400e3 * 3)
      const district = data
      this.loading = true
      getDistrictWeather({ district, datestart, dateend })
        .then(weatherData => {
          const v = new Array(3).fill({ label: null }) // 有且仅统计近三天的
          const list = weatherData.list
          list.map(i => {
            const diff = datedifference(new Date(i.date), datestart, 'day')
            if (diff > 3) return
            v[diff] = i
          })
          if (!v[0].label) { // 填充地理位置
            v.map(i => { if (i.label) v[0].label = i.label })
            v[0].label = `${district}(无)`
          }
          this.weather_dict = v.map(i => this.getSingle(i) || {})
          this.$emit('update:weatherData', v)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.secondary-subtitle{
  justify-content: center;
  text-align: center;
  font-size: 0.8rem;
}
.secondary-icon{
  text-align: center;
  width:50%;
  margin: auto;
}
.secondary-title{
  justify-content: center;
  text-align: center;
}
.primary-title{
  justify-content: center;
  text-align: right;
}
.primary-subtitle{
  justify-content: center;
}
.primary-tempature{
  justify-content: center;

}
.primary-icon{
  justify-content: center;
}
</style>
