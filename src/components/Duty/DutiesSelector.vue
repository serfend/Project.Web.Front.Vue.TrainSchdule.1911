<template>
  <span>
    <el-select
      v-model="iTag"
      :remote-method="tagFilter"
      filterable
      clearable
      default-first-option
      remote
      placeholder="选择类别"
      @change="tagChange"
    >
      <el-option v-for="(item,i) in tags" :key="i" :value="item" :label="item" />
    </el-select>
    <el-autocomplete
      v-if="!onlyTag"
      v-model="iDuties"
      class="inline-input"
      :fetch-suggestions="dutiesQuery"
      placeholder="请输入并选中职务名称"
      @select="handleDutiesSelect"
    />
  </span>
</template>

<script>
import { dutiesQuery, dutiesTag } from '@/api/company'
export default {
  name: 'DutiesSelector',
  model: {
    prop: 'duties',
    event: 'change'
  },
  props: {
    onlyTag: {
      type: Boolean,
      default: false
    },
    tag: {
      type: String,
      default: null
    },
    duties: {
      type: Array,
      default: null
    }
  },
  data: () => ({
    iDuties: null,
    iTag: null,
    tags: []
  }),
  watch: {
    tag: {
      handler(val) {
        this.iTag = val
      },
      immediate: true
    }
  },
  mounted() {
    this.tagFilter()
  },
  methods: {
    tagChange(val) {
      this.iTag = val
      this.$emit('update:tag', val)
      this.iDuties = null
    },
    tagFilter(val) {
      dutiesTag(val).then(d => {
        this.tags = d.list
        this.iDuties = null
      })
    },
    async dutiesQuery(queryString, cb) {
      var data = await dutiesQuery(queryString, this.iTag)
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
