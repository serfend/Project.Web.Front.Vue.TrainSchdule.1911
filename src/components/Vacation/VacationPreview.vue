<template>
  <el-card :header="`${extractEntityType(entityType)}审批流程预览：${solutionName}`">
    <ApplyAuditStreamPreview
      :solution-name.sync="solutionName"
      :userid="userid"
      :entity-type="entityType"
      :entity-type-desc="entityTypeDesc"
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
    userid: { type: String, default: null },
    entityType: { type: String, default: 'vacation' },
    entityTypeDesc: { type: String, default: null }
  },
  data: () => ({
    solutionName: null
  }),
  methods: {
    extractEntityType(v) {
      return { vacation: '休假', inday: '请假' }[v]
    }
  }
}
</script>

<style>
</style>
