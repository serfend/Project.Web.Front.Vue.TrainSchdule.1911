<template>
  <CascaderSelector
    ref="companyInnerSelector"
    v-model="companySelectItem"
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
    prop: 'companies',
    event: 'change'
  },
  props: {
    companies: {
      type: Array,
      default: null
    }
  },
  data: () => ({
    companySelectItem: null
  }),
  watch: {
    companySelectItem: {
      handler(val) {
        this.$emit(
          'change',
          val.map(i => ({
            code: i.value,
            name: i.label
          }))
        )
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
