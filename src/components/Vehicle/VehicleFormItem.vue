<template>
  <EntityFormItem v-bind="$props" :data-loader="getVehicle" :data-mapper="x=>`${x.identity}${x.company?x.company.name:null}`" @change="v=>innerData=v">
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
    getVehicle
  }
}
</script>
