<template>
  <CascaderSelector
    :code.sync="companyCode"
    :child-getter-method="companyChild"
    :placeholder="companySelectName"
    @select-change="companySelectChange"
  />
</template>

<script>
import CascaderSelector from '@/components/CascaderSelector'
import { companyChild } from '@/api/company'
export default {
  name: 'CompanySelector',
  components: { CascaderSelector },
  props: {
    companySelectName: {
      type: String,
      default: null
    }
  },
  data: () => ({
    companyCode: null
  }),
  watch: {
    companyCode: {
      handler(val) {
        this.$emit('update:code', val)
      }
    }
  },
  methods: {
    companyChild,
    companySelectChange(val) {
      this.$emit('companySelectChange', val)
    }
  }
}
</script>

<style>
</style>
