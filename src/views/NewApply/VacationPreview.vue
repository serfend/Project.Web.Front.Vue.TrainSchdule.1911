<template>
  <el-card :header="`确认提交 ${solutionName}`">
    <ApplyAuditStreamPreview :solution-name.sync="solutionName" userid="1000021" />
  </el-card>
</template>

<script>
import ApplyAuditStreamPreview from '@/views/ApplyStream/components/ApplyAuditStreamPreview'
export default {
  name: 'VacationPreview',
  components: { ApplyAuditStreamPreview },
  data: () => ({
    solutionName: null
  })
}
</script>

<style>
</style>
