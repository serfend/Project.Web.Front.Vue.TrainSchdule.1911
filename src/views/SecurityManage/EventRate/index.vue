<template>
  <el-row>
    <el-col :span="10">
      <BaseChart type="pie" :data="data" :height="height" :width="width" :color="color" />
    </el-col>
    <el-col :span="14">
      <BaseChart type="bar" :data="data" :height="height" :width="width" :color="color" />
    </el-col>
  </el-row>
</template>

<script>
import { groupByFiled } from '@/utils/data-handle'

export default {
  name: 'EventRate',
  components: {
    BaseChart: () => import('./BaseChart'),
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
    color: ['#ff6f4f', '#71ff80', '#3581ff', '#cc337f', '#71ccb0', '#f581cc'],
  }),
  computed: {
    data () {
      const { list } = this
      const group = groupByFiled(list, 'type')
      const result = Object.keys(group).map(i => ({ name: i, data: group[i].length }))
      return [result]
    }
  },
  methods: {}
}
</script>
