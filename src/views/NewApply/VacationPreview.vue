<template>
  <el-card :header="`审批流程预览：${solutionName}`">
    <ApplyAuditStreamPreview
      :solution-name.sync="solutionName"
      :userid="userid"
      :show-detail="true"
    />
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
