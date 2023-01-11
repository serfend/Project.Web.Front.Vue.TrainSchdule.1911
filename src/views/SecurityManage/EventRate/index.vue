<template>
  <el-row>
    <el-col :span="10">
      <BaseChart
        type="pie"
        :data="data"
        :height="height"
        :width="width"
        :color="color"
        @chartClick="v => $emit('chartClick', v)"
      />
    </el-col>
    <el-col :span="14">
      <BaseChart
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
    BaseChart: () => import('./BaseChart')
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
    ]
  }),
  computed: {
    data() {
      const { list } = this
      const group = groupByFiled(list, 'type')
      const result = Object.keys(group).map(i => ({
        name: i,
        data: group[i].length
      }))
      return [result]
    }
  },
  methods: {
    loadConfig() {
      getConfig({ name: 'global.sec.chart.color' }).then(data => {
        if (!data.model || !data.model.data) return
        this.color = data.model.data
      })
    }
  }
}
</script>
