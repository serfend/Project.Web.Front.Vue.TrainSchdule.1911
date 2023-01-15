<template>
  <div v-if="weather_dict && weather_dict[0]" v-loading="loading">
    <el-row>
      <el-col class="primary-icon" :span="7">
        <LottieIcon
          :animation-data="weather_dict[0].data"
          :animate-speed="0.5"
          style="width:70%;margin: auto;color:#fff"
        />
      </el-col>
      <el-col :span="8">
        <div class="primary-temperature">
          {{ getTemperature(weather_dict[0]) }}
        </div>
        <div class="primary-subtitle">
          {{
            getProp(weather_dict[0], "subLabel") ||
              getWeatherName(getProp(weather_dict[0], "type"))
          }}
        </div>
      </el-col>
      <el-col class="primary-title" :span="8">
        <span>{{ getProp(weather_dict[0], "label") }}</span>
        <el-button
          type="text"
          class="primary-btn"
          @click="move_date(-1)"
        >&lt;-</el-button>
        <span
          class="primary-title-date"
        >{{ new Date(datestart.getTime() + 86400e3).getDate() }}日</span>
        <el-button
          type="text"
          class="primary-btn"
          @click="move_date(1)"
        >-&gt;</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col
        v-for="(i, index) in new Array(3).fill(0)"
        :key="index"
        :span="8"
      >
        <div v-if="weather_dict[index]">
          <el-row class="secondary-title">
            <span>{{ dateConvert(index) }}</span>
          </el-row>
          <el-row class="secondary-icon">
            <LottieIcon
              :animation-data="weather_dict[index].data"
              :animate-speed="0.5"
              style="width:90%;margin: auto;color:#fff"
            />
          </el-row>
          <el-row class="secondary-subtitle">
            <span>{{
              (index > 0 && getProp(weather_dict[index], "subLabel")) ||
                getTemperatureRange(weather_dict[index])
            }}</span>
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
    NoData: () => import('@/views/Loading/NoData')
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
            temperature: { min: 4, max: 17 }
          },
          {
            name: '多云',
            temperature: { min: 3, max: 15 }
          },
          {
            name: '阴',
            temperature: { min: 3, max: 16 }
          }
        ]
      })
    },
    weatherData: { type: Array, default: null }
  },
  data: () => ({
    weather_dict: [],
    loading: false,
    datestart: new Date(),
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
    getSingle(weather) {
      const n = weather.name || this.getWeatherName(weather.type)
      let v = weatherData[n]
      if (!v) v = weatherData['无']
      v = v()
      return Object.assign({ data: v }, weather)
    },
    getTemperatureRange(w) {
      const max = getProp(w, ['temperature', 'max'])
      const min = getProp(w, ['temperature', 'min'])
      if (max === null || min === null) return '-'
      return `${min}-${max}℃`
    },
    getTemperature(w) {
      const max = getProp(w, ['temperature', 'max'])
      const min = getProp(w, ['temperature', 'min'])
      if (max === null || min === null) return '-'
      const v =
        min +
        (max - min) * weatherData.temperatureMockDict[new Date().getHours()]
      return `${Math.round(v)}℃`
    },
    getWeatherName(type) {
      return weatherData.weatherDict[type] || '未知'
    },
    move_date(count_day) {
      const d = this.datestart
      d.setDate(d.getDate() + count_day)
      this.datestart = d
      this.initWeatherData()
      this.$emit('dateChange')
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
      const { datestart } = this
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
          if (!v[0].label) {
            // 填充地理位置
            v.map(i => {
              if (i.label) v[0].label = i.label
            })
            v[0].label = `${district}(无)`
          }
          this.weather_dict = v.map(i => this.getSingle(i) || {})
          this.$emit('update:weatherData', v)
        })
        .finally(() => {
          this.loading = false
        })
    },
    dateConvert (index) {
      const r = []
      const date = new Date(new Date(this.datestart).getTime() + index * 86400e3).getDate()
      r.push(date)
      const a = new Date(this.datestart).getTime() % 86400e3
      const b = new Date().getTime() % 86400e3
      if (a === b) r.push(['今天', '明天', '后天'][index]) // 日期不同则不返回相对时间
      return r.join('')
    }
  }
}
</script>
<style lang="scss" scoped>
.secondary-subtitle {
  justify-content: center;
  text-align: center;
  font-size: 0.8rem;
}
.secondary-icon {
  text-align: center;
  width: 50%;
  margin: auto;
}
.secondary-title {
  justify-content: center;
  text-align: center;
}
.primary-title {
  justify-content: center;
  text-align: right;
  color: #ffffffb6;
  font-size: 1.2rem;
}
.primary-title-date {
  font-size: 0.8rem;
}
.primary-subtitle {
  justify-content: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-clamp: 2;
  width: 200%;
}
.primary-temperature {
  justify-content: center;
  font-size: 2rem;
}
.primary-icon {
  justify-content: center;
}
</style>
