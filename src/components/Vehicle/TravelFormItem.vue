<template>
  <EntityFormItem v-bind="$props" :data-loader="getTravel" :data-mapper="dataMapper" @change="v=>innerData=v">
    <Card v-if="innerData" v-bind="config" :data="innerData" />
  </EntityFormItem>
</template>

<script>
import { getTravel } from '@/api/vehicle'
import { formatTime, parseTime } from '@/utils'
export default {
  name: 'TravelFormItem',
  components: {
    Card: () => import('./Travel'),
    EntityFormItem: () => import('@/components/Form/EntityFormItem')
  },
  props: {
    data: { type: Object, default: () => ({}) },
    userid: { type: String, default: null },
    placement: { type: String, default: 'right' },
    directShowCard: { type: Boolean, default: false },
    config: { type: Object, default: () => ({}) }
  },
  data: () => ({
    innerData: null
  }),
  methods: {
    getTravel, parseTime, formatTime,
    dataMapper (x) {
      if (!x || !x.id) return '无'
      const { driver, vehicle } = x
      const driver_des = (driver && driver.user && driver.user.realName) || '未知驾驶员'
      const vehicle_des = (vehicle && vehicle.identity) || '未知车辆'
      const date_des = formatTime(x.timeStart)
      return `${date_des}:${driver_des}:${vehicle_des}`
    }
  }
}
</script>
