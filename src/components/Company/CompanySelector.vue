<template>
  <CascaderSelector
    ref="companyInnerSelector"
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
    companyCode: null,
    value: null
  }),
  watch: {
    companyCode: {
      handler(val) {
        this.$nextTick(() => {
          this.$emit('update:code', val)
        })
      }
    }
  },
  methods: {
    companyChild,
    companySelectChange(val) {
      this.$nextTick(() => {
        this.$emit('change', {
          code: this.companyCode,
          name: val
        })
      })
    }
  }
}
</script>

<style>
</style>
