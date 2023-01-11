<template>
  <div class="chart-container">
    <el-row>
      <Square>
        <div slot="title">{{ data[0].name }}</div>
        <div slot="chart" :style="{ height: `${height / 2}rem` }">
          <LineChartDigger
            slot="chart"
            type="line"
            :data="data[0].data"
            :height="`${height / 2}rem`"
            :width="width"
            :color="color"
          />
        </div>
      </Square>
    </el-row>
    <el-row>
      <Square>
        <div slot="title">{{ data[1].name }}</div>
        <div slot="chart" :style="{ height: `${height / 2}rem` }">
          <Bar3DChart
            slot="chart"
            :data="data[1].data"
            :height="`${height / 2}rem`"
            :width="width"
            :axis="data[1].axis"
          />
        </div>
      </Square>
    </el-row>
  </div>
</template>
<script>

export default {
  name: 'SingleCard',
  components: {
    Square: () => import('@/views/dashboard/Statistics/components/Square'),
    Bar3DChart: () => import('./Bar3DChart'),
    LineChartDigger: () => import('./LineChartDigger')
  },
  props: {
    width: { type: String, default: '100%' },
    height: { type: Number, default: 34 },
    chartData1: { type: Object, default: null }, // 图表1的数据
    chartData2: { type: Object, default: null },
  },
  data: () => ({
    color: ['#ff6f4f', '#71ff80', '#3581ff', '#cc337f', '#71ccb0', '#f581cc']
  }),
  computed: {
    data() {
      const { chartData1, chartData2 } = this
      const list = [chartData1, chartData2]
      const r = list.map(i => i || {})
      return r
    }
  },
  mounted() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.data {
  margin-top: 1rem;
  font-size: 4rem;
  color: #25f0f0;
  text-shadow: #21f0ff 0 0 0.5rem;
}
.title {
  font-size: 1.5rem;
  color: #ffffff;
}
.progress {
  margin-top: 1rem;
}
.card-container {
  display: inline-block;
  text-align: center;
  border-radius: 0.4rem;
}
</style>
