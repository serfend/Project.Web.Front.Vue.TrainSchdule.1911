<template>
  <ApplyAuditStreamPreviewInner
    v-if="showDetail"
    :userid="userid"
    :audit-status="auditStatus"
    :now-step="nowStep"
    :entity-type="entityType"
    :entity-type-desc="entityTypeDesc"
    :solution-name.sync="solutionName"
  />
  <el-popover v-else trigger="hover" @show="userHasHover=true">
    <ApplyAuditStreamPreviewInner
      v-if="userHasHover"
      :userid="userid"
      :audit-status="auditStatus"
      :now-step="nowStep"
      :entity-type="entityType"
      :entity-type-desc="entityTypeDesc"
      :solution-name.sync="solutionName"
      :title="title"
    />
    <span v-if="!$slots.content" slot="reference" class="preview-btn">{{ title }}</span>
    <slot v-else slot="reference" style="display:flex" name="content" />
  </el-popover>
</template>

<script>
import ApplyAuditStreamPreviewInner from './ApplyAuditStreamPreviewInner'
export default {
  name: 'ApplyAuditStreamPreview',
  components: { ApplyAuditStreamPreviewInner },
  props: {
    userid: { type: String, default: null },
    auditStatus: { type: Array, default: null },
    showDetail: { type: Boolean, default: false },
    nowStep: { type: Number, default: -1 },
    title: { type: String, default: null },
    entityType: { type: String, default: 'vacation' },
    entityTypeDesc: { type: String, default: null }
  },
  data: () => ({
    solutionName: null,
    userHasHover: false
  }),
  watch: {
    solutionName: {
      handler(val) {
        this.$emit('update:solutionName', val)
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-btn {
  text-decoration: underline;
  transition: all 0.2s ease;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    text-decoration: none;
    color: #00f;
    opacity: 0.8;
  }
}
</style>
