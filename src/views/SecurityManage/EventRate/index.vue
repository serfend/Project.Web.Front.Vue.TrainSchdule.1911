<template>
  <el-row>
    <el-col :span="10">
      <BaseChart type="pie" :data="data" :height="height" :width="width" />
    </el-col>
    <el-col :span="14">
      <BaseChart type="bar" :data="data":height="height" :width="width" />
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'EventRate',
  components: {
    BaseChart: () => import('./BaseChart'),
  },
  props: {
    width: { type: String, default: '100%' },
    height: { type: String, default: '300px' },
  },
  data: () => ({
    color: ['#ff6f4f', '#71ff80', '#3581ff', '#cc337f', '#71ccb0', '#f581cc'],
    data: [
      [
        {
          name: '车辆事件',
          data: [31]
        },
        {
          name: '人员事件',
          data: [24]
        },
        {
          name: '装备事件',
          data: [22]
        },
        {
          name: '保密事件',
          data: [11]
        },
        {
          name: '枪支事件',
          data: [10]
        },
      ]
    ],
  }),
  methods: {}
}
</script>
