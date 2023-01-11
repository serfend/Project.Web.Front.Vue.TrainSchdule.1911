<template>
  <Weather v-model="currentWeather" @dateChange="dateChange" />
</template>
<script>
export default {
  name: 'WeatherGroup',
  components: {
    Weather: () => import('../index'),
  },
  props: {
    district: { type: Array, default: null },
    weatherData: { type: Array, default: null }, // 与district 2选1
    interval: { type: Number, default: 5000 }
  },
  data: () => ({
    current: 0,
    group: [],
    switchTimer: null,
    canUpdateTime: new Date()
  }),
  computed: {
    currentWeather () {
      const { group, current } = this
      if (group.length <= current) return null
      return group[current]
    }
  },
  watch: {
    district: {
      handler(v) {
        if (!v) return
        this.group = v
      },
      immediate: true
    },
    weatherData: {
      handler (v) {
        if (!v) return
        this.group = v
      },
      immediate: true
    }
  },
  mounted() {
    this.resetTimer()
  },
  destroyed() {
    this.resetTimer(true)
  },
  methods: {
    resetTimer (removeTimerOnly) {
      clearInterval(this.switchTimer)
      if (removeTimerOnly) return
      this.switchTimer = setInterval(this.refresh, this.interval + 500 * Math.random())
    },
    dateChange () {
      this.canUpdateTime = new Date(new Date().getTime() + 5e3)
    },
    refresh () {
      if (this.canUpdateTime > new Date()) return
      this.current++
      if (this.current >= this.group.length) this.current = 0
    },
  },
}
</script>
<style lang="scss" scoped>

</style>
