<template>
  <CascaderSelector
    ref="companyInnerSelector"
    v-model="companySelectItem"
    :child-getter-method="companyChild"
    :placeholder="placeholder"
  />
</template>

<script>
import CascaderSelector from '@/components/CascaderSelector'
import { companyChild, companyDetail } from '@/api/company'
import { debounce } from '@/utils'
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
    value: null,
    showPlaceholder: null
  }),
  computed: {
    requireCheckName() {
      return debounce(() => {
        this.checkName()
      }, 500)
    },
    placeholder() {
      const cn = this.companySelectName
      return cn || this.showPlaceholder
    }
  },
  watch: {
    companySelectItem: {
      handler(val) {
        this.$emit('change', {
          code: val.value,
          name: val.label
        })
      }
    },
    data: {
      handler() {
        this.requireCheckName()
      },
      deep: true
    },
    placeholder: {
      handler() {
        this.requireCheckName()
      },
      immediate: true
    }
  },
  methods: {
    companyChild,
    companyDetail,
    checkName() {
      const data = this.data
      const val = this.placeholder
      if (val || !data) return
      companyDetail(data.code).then(d => {
        this.showPlaceholder = data.name
      })
    }
  }
}
</script>

<style>
</style>
