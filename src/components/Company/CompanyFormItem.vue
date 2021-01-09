<template>
  <el-popover placement="right" trigger="hover" @show="canLoad = true">
    <Company
      v-model="inner_id"
      :data.sync="form"
      :can-load="canLoad"
      @formUpdate="handleChange"
    />
    <span slot="reference">
      <el-tag v-if="form">{{ form.name }}</el-tag>
      <el-tag v-else>{{ id }}无效</el-tag>
    </span>
  </el-popover>
</template>

<script>
import Company from './index'
export default {
  name: 'CompanyFormItem',
  components: { Company },
  model: {
    prop: 'id',
    event: 'change',
  },
  props: {
    data: {
      type: Object,
      default() {
        return {
          realName: 'null',
        }
      },
    },
    id: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    form: null,
    canLoad: false,
    inner_id: null,
  }),
  watch: {
    data: {
      handler(val) {
        this.form = val
      },
      immediate: true,
    },
    id: {
      handler(val) {
        if (val) this.canLoad = true
        this.inner_id = val
      },
      immediate: true,
    },
  },
  methods: {
    handleChange() {
      this.$emit('update:data', this.form)
      this.$emit('change', this.inner_id)
    },
  },
}
</script>

<style></style>
