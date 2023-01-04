<template>
  <Weather v-model="currentWeather" />
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
    interval: { type: Number, default: 10000 }
  },
  data: () => ({
    current: 0,
    group: [],
    switchTimer: null
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
      this.switchTimer = setInterval(() => {
        this.current++
        if (this.current >= this.group.length) this.current = 0
      }, this.interval + 500 * Math.random())
    }
  },
}
</script>
<style lang="scss" scoped>

</style>
