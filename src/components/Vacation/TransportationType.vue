<template>
  <el-tooltip :content="description">
    <SvgIcon :icon-class="iconClass" />
  </el-tooltip>
</template>

<script>
const transportationType = {
  0: ['huoche', '火车'],
  1: ['feiji', '飞机'],
  2: ['qiche', '汽车'],
  3: ['beijing-metro', '地铁'],
  default: ['guide', '未知']
}
export default {
  name: 'TransportationType',
  components: { SvgIcon: () => import('@/components/SvgIcon') },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: { type: Number, default: 0 }
  },
  computed: {
    type() {
      const v = this.value
      return transportationType[v] || transportationType['default']
    },
    description() {
      return this.type[1]
    },
    iconClass() {
      return this.type[0]
    }
  }
}
</script>
