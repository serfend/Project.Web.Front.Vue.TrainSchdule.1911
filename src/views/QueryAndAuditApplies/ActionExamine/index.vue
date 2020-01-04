<template>
  <div>
    <RecallApplyDialog
      v-if="showRecall"
      ref="recallDialog"
      :show.sync="showRecall"
      :is-only-to-show-recall-msg.sync="showRecallIsOnlyShowMsg"
    />
    <AuditApplyDialog
      v-if="showAudit"
      ref="auditApplyDialog"
      :apply-id="row.id"
      :show.sync="showAudit"
    />
    <el-button v-if="CheckIfShowRecall(row)" size="mini" type="warning" @click="recallApply(row)">召回</el-button>
    <div v-else-if="row.status>30&&row.status<100">
      <el-button v-show="!showAudit" size="mini" type="success" @click="showAudit=true">审批</el-button>
    </div>
    <el-button
      v-else-if="row.recallId!==null"
      type="primary"
      size="mini"
      @click="$refs.recallDialog.showRecallMsg(row)"
    >召回信息</el-button>
    <el-tag v-else-if="row.status===100" type="success">正常休假</el-tag>
    <el-tag v-else-if="row.status>30" type="warning">审批中</el-tag>
    <el-tag v-else-if="row.status===30" type="danger">已失效</el-tag>
    <el-tag v-else type="info">未提交申请</el-tag>
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
