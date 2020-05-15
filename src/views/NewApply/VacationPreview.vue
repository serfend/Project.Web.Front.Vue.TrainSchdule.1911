<template>
  <el-card :header="`确认提交 ${solutionName}`">
    <ApplyAuditStreamPreview :solution-name.sync="solutionName" :userid="userid" />
  </el-card>
</template>

<script>
import ApplyAuditStreamPreview from '@/components/ApplicationApply/ApplyAuditStreamPreview'
export default {
  name: 'VacationPreview',
  components: { ApplyAuditStreamPreview },
  props: {
    userid: { type: String, default: null }
  },
  data: () => ({
    solutionName: null
  })
}
</script>

<style>
</style>
