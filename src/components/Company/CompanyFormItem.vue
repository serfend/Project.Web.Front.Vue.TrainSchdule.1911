<template>
  <el-tooltip placement="right" effect="light">
    <div slot="content">
      <Company :data="data" />
    </div>
    <el-tag>{{ data.name }}</el-tag>
  </el-tooltip>
</template>

<script>
import Company from './index'
export default {
  name: 'CompanyFormItem',
  components: { Company },
  props: {
    data: {
      type: Object,
      default() {
        return {
          realName: 'null'
        }
      }
    }
  },
  mounted() {}
}
</script>

<style>
</style>
