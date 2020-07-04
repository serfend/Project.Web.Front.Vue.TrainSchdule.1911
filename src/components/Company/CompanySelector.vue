<template>
  <CascaderSelector
    ref="companyInnerSelector"
    v-model="companySelectItem"
    :child-getter-method="companyChild"
    :placeholder="companySelectName"
  />
</template>

<script>
import CascaderSelector from '@/components/CascaderSelector'
import { companyChild } from '@/api/company'
export default {
  name: 'CompanySelector',
  components: { CascaderSelector },
  model: {
    prop: 'data',
    event: 'change'
  },
  props: {
    companySelectName: {
      type: String,
      default: null
    },
    data: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    companySelectItem: null,
    value: null
  }),
  watch: {
    companySelectItem: {
      handler(val) {
        this.$emit('change', {
          code: val.value,
          name: val.label
        })
      }
    }
  },
  methods: {
    companyChild
  }
}
</script>

<style>
</style>
