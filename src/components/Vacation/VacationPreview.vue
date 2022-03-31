<template>
  <el-card :header="`${extractEntityType(entityType)}审批流程预览：${solutionName||''}`">
    <ApplyAuditStreamPreview
      v-show="!validateInfoInner"
      :solution-name.sync="solutionName"
      :userid="userid"
      :entity-type="entityType"
      :entity-type-desc="entityTypeDesc"
      :show-detail="true"
      :validate-info.sync="validateInfoInner"
    />
    <div v-show="validateInfoInner">
      <span>当前审批流程加载失败：</span>
      <el-tag type="danger">{{ validateInfoInner }}</el-tag>
    </div>
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
    entityTypeDesc: { type: String, default: null },
    validateInfo: { type: String, default: null }
  },
  data: () => ({
    solutionName: null,
    validate_info: null
  }),
  computed: {
    validateInfoInner: {
      get() { return this.validate_info },
      set(v) {
        this.validate_info = v
        this.$emit('update:validateInfo', v)
      }
    }
  },
  methods: {
    extractEntityType(v) {
      return { vacation: '休假', inday: '请假' }[v]
    }
  }
}
</script>

<style>
</style>
