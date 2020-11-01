<template>
  <div>
    <ApplyAuditStreamPreviewInner
      v-if="showDetail"
      :userid="userid"
      :audit-status="auditStatus"
      :now-step="nowStep"
      :solution-name.sync="solutionName"
    />
    <el-popover v-else trigger="click" @show="userHasHover=true">
      <ApplyAuditStreamPreviewInner
        v-if="userHasHover"
        :userid="userid"
        :audit-status="auditStatus"
        :now-step="nowStep"
        :solution-name.sync="solutionName"
      />
      <span v-if="!$slots.content" slot="reference" class="preview-btn">{{ title }}</span>
      <slot v-else slot="reference" name="content" />
    </el-popover>
  </div>
</template>

<script>
import ApplyAuditStreamPreviewInner from './ApplyAuditStreamPreviewInner'
export default {
  name: 'ApplyAuditStreamPreview',
  components: { ApplyAuditStreamPreviewInner },
  props: {
    userid: {
      type: String,
      default: null,
    },
    auditStatus: {
      type: Array,
      default: null,
    },
    showDetail: {
      type: Boolean,
      default: false,
    },
    nowStep: {
      type: Number,
      default: -1,
    },
    title: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    solutionName: null,
    userHasHover: false,
  }),
  watch: {
    solutionName: {
      handler(val) {
        this.$emit('update:solutionName', val)
      },
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.preview-btn {
  transition: all 0.5s;
  cursor: pointer;
  &:hover {
    color: #00f;
  }
}
</style>
