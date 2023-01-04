<template>
  <Flip
    v-model="flip_front"
    width="100%"
    height="100%"
  >
    <template #front>
      <WeatherBody v-model="innerData" :weather-data.sync="weatherData" />
    </template>
    <template #back>
      <el-card class="weather-back">
        <div v-if="desc">
          <h3>{{ desc.city }} {{ parseTime(desc.date,'{m}月{d}日') }}</h3>
          <div class="weather-warning">{{ desc.description }}</div></div>
      </el-card>
    </template>
  </Flip>
</template>
<script>
import { parseTime } from '@/utils'

export default {
  name: 'Weather',
  components: {
    WeatherBody: () => import('./WeatherBody'),
    Flip: () => import('vue-flip')
  },
  model: {
    prop: 'data',
    event: 'change'
  },
  props: {
    data: {
      type: [Object, Number], // 数据对象 或 区域代码
      default: null
    }
  },
  data: () => ({
    flip_front: false,
    flip_last: new Date(), // 用于避免值变更冲突
    flip_counter: null,
    weatherData: null
  }),
  computed: {
    typeAttribute () {
      const { weatherData } = this
      if (!weatherData || !weatherData[0]) return null
      const { weatherTypeAttribute } = weatherData[0]
      return weatherTypeAttribute
    },
    innerData: {
      get() {
        return this.data
      },
      set (v) {
        this.$emit('change', v)
      }
    },
    hasBack () {
      const { typeAttribute } = this
      return !!typeAttribute
    },
    desc () {
      const { weatherData, typeAttribute, hasBack } = this
      if (!hasBack) return null
      const item = weatherData[0]
      return {
        city: item.label,
        date: item.date,
        description: typeAttribute.description
      }
    }
  },
  watch: {
    data: {
      handler (val) {
        this.flip_last = new Date()
        this.flip_front = false
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.flip_counter = setInterval(this.doFlip, 5e3)
  },
  destroyed() {
    clearInterval(this.flip_counter)
  },
  methods: {
    parseTime,
    doFlip() {
      if (!this.hasBack || new Date() - this.flip_last < 1e3) return
      this.flip_front = !this.flip_front
    }
  }
}
</script>
<style>
.front {
  width: 100%;
  height: 100%;
}
.back {
  width: 100%;
  height: 100%;
}
</style>
<style lang="scss" scoped>
.weather-warning{
  color:#db370e;
  font-weight: bold;
}
</style>
