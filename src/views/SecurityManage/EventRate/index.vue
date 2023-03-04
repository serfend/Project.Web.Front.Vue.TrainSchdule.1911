<template>
  <el-row>
    <el-col :span="12">
      <div style=" display: inline-block; height: 100%;  width: 100%;" @click.capture="onColClick">
        <Flip v-model="flip_front" width="100%" height="100%">
          <template #front>
            <BaseChart
              ref="chart_pie"
              type="pie"
              :data="data"
              :height="height"
              :width="width"
              :color="color"
              @chartClick="v => $emit('chartClick', v)"
            />
          </template>
          <template #back>
            <BaseChart
              ref="chart_radar"
              type="radar"
              :data="data"
              :height="height"
              :width="width"
              :color="color"
            />
          </template>
        </Flip>
      </div>
    </el-col>
    <el-col :span="12">
      <BaseChart
        ref="chart_bar"
        type="bar"
        :data="data"
        :height="height"
        :width="width"
        :color="color"
        @chartClick="v => $emit('chartClick', v)"
      />
    </el-col>
  </el-row>
</template>

<script>
import { groupByFiled } from '@/utils/data-handle'
import { getConfig } from '@/api/common/general_config'

export default {
  name: 'EventRate',
  components: {
    BaseChart: () => import('./BaseChart'),
    Flip: () => import('vue-flip')
  },
  model: {
    prop: 'list',
    event: 'change'
  },
  props: {
    width: { type: String, default: '100%' },
    height: { type: String, default: '300px' },
    list: { type: Array, default: () => [] }
  },
  data: () => ({
    color: [
      '#ed55d6',
      '#1565c0',
      '#1976d2',
      '#1e88e5',
      '#2196f3',
      '#42a5f5',
      '#64b5f6',
      '#bbdefb',
      '#e3f2fd'
    ],
    flip_front: false,
    flip_front_refresher: null,
    auto_switcher: null
  }),
  computed: {
    data() {
      const { list } = this
      const group = groupByFiled(list, 'type')
      const result = Object.keys(group).map(i => ({
        name: i,
        data: group[i].length
      })).sort((a, b) => b.data - a.data)
      return [result]
    }
  },
  mounted() {
    this.flip_front_refresher = setInterval(this.onColClick, 10e3)
    this.auto_switcher = setInterval(() => {
      const items = this.$refs
      let timer = 0
      Object.values(items).map(x => {
        if (!x || !x.refresh) return
        timer += 1e3
        setTimeout(() => x.refresh(), timer)
      })
    }, 8e3)
  },
  destroyed() {
    clearInterval(this.flip_front_refresher)
    clearInterval(this.auto_switcher)
  },
  methods: {
    onColClick () {
      this.flip_front = !this.flip_front
    },
    loadConfig() {
      getConfig({ name: 'global.sec.chart.color' }).then(data => {
        if (!data.model || !data.model.data) return
        this.color = data.model.data
      })
    }
  }
}
</script>
