<template>
  <div>
    <RecallApplyDialog
      v-if="showRecall"
      :show.sync="showRecall"
      :is-only-to-show-recall-msg.sync="showRecallIsOnlyShowMsg"
      :row="row"
      @updated="requireUpdate"
    />
    <AuditApplyDialog
      v-if="showAudit"
      :apply-id="row.id"
      :show.sync="showAudit"
      @updated="requireUpdate"
    />
    <el-link
      v-if="row.status>30&&row.status<75&&!showAudit"
      type="success"
      @click="showAudit=true"
    >审批</el-link>
    <el-link v-if="CheckIfShowRecall(row)" type="warning" @click="recallApply(false)">召回</el-link>
    <el-link
      v-else-if="row.recallId!==null"
      type="primary"
      size="mini"
      @click="recallApply(true)"
    >召回信息</el-link>
  </div>
</template>

<script>
import RecallApplyDialog from './RecallApplyDialog'
import AuditApplyDialog from '../AuditApplyDialog'
export default {
  name: 'ActionExamine',
  components: { RecallApplyDialog, AuditApplyDialog },
  props: {
    row: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      showAudit: false,
      showRecall: false,
      showRecallIsOnlyShowMsg: false
    }
  },
  methods: {
    requireUpdate() {
      this.$emit('updated')
    },
    recallApply(isOnlyShow) {
      this.showRecallIsOnlyShowMsg = isOnlyShow
      this.showRecall = true
    },
    CheckIfShowRecall(row) {
      return (
        row.status === 100 &&
        row.recallId === null &&
        new Date(row.request.stampReturn) > new Date()
      )
    }
  }
}
</script>

<style>
</style>
