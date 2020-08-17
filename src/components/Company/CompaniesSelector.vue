<template>
  <CascaderSelector
    ref="companyInnerSelector"
    v-model="companySelectItem"
    :child-getter-method="companyChild"
    :multiple="true"
    :placeholder="placeholder.map(i=>i.name).join(' ')"
  />
</template>

<script>
import CascaderSelector from '@/components/CascaderSelector'
import { companyChild } from '@/api/company'
import { debounce } from '@/utils'
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
    companySelectItem: null,
    showPlaceholder: []
  }),
  computed: {
    requireCheckName() {
      return debounce(() => {
        this.checkName()
      }, 500)
    },
    placeholder() {
      const cn = this.companies
      return cn || this.showPlaceholder
    }
  },
  watch: {
    companySelectItem: {
      handler(val) {
        const item = val.map(i => ({
          code: i.value,
          name: i.label
        }))
        this.$emit('change', item)
      }
    },
    immediate: true,
    deep: true
  },
  methods: {
    companyChild,
    checkName() {
      const data = this.companies
      const val = this.placeholder
      if (val || !data) return
      // already implement names display remove this
      // companyDetail(data.code).then(d => {
      //   this.showPlaceholder = data.name
      // })
    }
  }
}
</script>

<style>
</style>
