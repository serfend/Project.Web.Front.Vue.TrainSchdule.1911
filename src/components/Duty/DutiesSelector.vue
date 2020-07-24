<template>
  <el-autocomplete
    v-model="iDuties"
    class="inline-input"
    :fetch-suggestions="dutiesQuery"
    placeholder="请输入并选中职务名称"
    @select="handleDutiesSelect"
  />
</template>

<script>
import { dutiesQuery } from '@/api/company'
export default {
  name: 'DutiesSelector',
  model: {
    prop: 'duties',
    event: 'change'
  },
  props: {
    duties: {
      type: Array,
      default: null
    }
  },
  data: () => ({
    iDuties: null
  }),
  methods: {
    async dutiesQuery(queryString, cb) {
      var data = await dutiesQuery(queryString)
      await this.queryItem(data, cb)
    },
    async queryItem(data, cb) {
      var list = data.list
      var result = list.map(item => {
        return {
          value: item.name,
          code: item.code
        }
      })
      cb(result)
    },
    handleDutiesSelect(val) {
      this.$message.success(`已选中${val.value}(${val.code})`)
      const list = this.duties
      const existed = list.map(i => i.code).indexOf(val.code)
      if (existed > -1) return
      this.$emit('change', list.concat([val]))
      this.$nextTick(() => {
        this.iDuties = null
      })
    }
  }
}
</script>

<style>
</style>
