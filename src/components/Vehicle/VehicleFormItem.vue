<template>
  <EntityFormItem v-bind="$props" :data-loader="getVehicle" :data-mapper="dataMapper" @change="v=>innerData=v">
    <Card v-if="innerData" v-bind="config" :data="innerData" />
  </EntityFormItem>
</template>

<script>
import { getVehicle } from '@/api/vehicle'
export default {
  name: 'VehicleFormItem',
  components: {
    Card: () => import('./index'),
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
    getVehicle,
    dataMapper (x) {
      if (!x || !x.id) return '无'
      const { identity, company } = x
      const identity_des = identity || '未知车牌'
      const company_des = (company && company.name) || '未知单位'
      return `${company_des} ${identity_des}`
    }
  }
}
</script>
