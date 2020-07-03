<template>
  <CascaderSelector
    ref="companyInnerSelector"
    :code.sync="iCompaniesCode"
    :child-getter-method="companyChild"
    :multiple="true"
  />
</template>

<script>
import CascaderSelector from '@/components/CascaderSelector'
import { companyChild } from '@/api/company'
export default {
  name: 'CompaniesSelector',
  components: { CascaderSelector },
  model: {
    prop: 'companiesCode',
    event: 'change'
  },
  props: {
    companiesCode: {
      type: [Array, String],
      default: null
    }
  },
  data: () => ({
    iCompaniesCode: null
  }),
  watch: {
    // can only return info , for reason that level was shift down when emit out
    // companiesCode: {
    //   handler(val) {
    //     const c = this.companiesCode
    //     const isString = Object.prototype.toString.call(c) === '[object Array]'
    //     this.iCompaniesCode = isString ? c : [c]
    //   },
    //   deep: true
    // },
    iCompaniesCode: {
      handler(val) {
        const codes = val.map(i => i[i.length - 1])
        this.$emit('change', codes)
      },
      deep: true
    }
  },
  methods: {
    companyChild
  }
}
</script>

<style>
</style>
