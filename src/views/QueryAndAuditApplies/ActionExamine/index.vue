<template>
  <span>
    <HandleReturnStampDialog
      v-if="showExecuteStatus"
      :display-name="recallOrExecute?'召回':'确认'"
      :default-stamp-return.sync="defaultStampReturn"
      :default-reason.sync="defaultReason"
      :show.sync="showExecuteStatus"
      :only-view.sync="onlyView"
      :row="row"
      :data-getter="dataGetter"
      :data-setter="dataSetter"
      :handle-id="handleId"
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
    <span v-if="row.status==100">
      <el-link v-if="CheckIfShowRecall(row)" type="warning" @click="recallApply(false)">召回</el-link>
      <el-link v-else-if="row.recallId!==null" type="primary" @click="recallApply(true)">召回信息</el-link>
      <el-tooltip v-else-if="row.executeStatusId==null" content="休假结束后，确认实际归队时间">
        <el-link type="warning" @click="confirmExecuteStatus(false)">待确认时间</el-link>
      </el-tooltip>
      <el-link
        v-else-if="row.executeStatus!==1"
        type="danger"
        @click="confirmExecuteStatus(true)"
      >推迟归队</el-link>
    </span>
  </span>
</template>

<script>
import {
  postRecallOrder,
  getRecallOrder,
  postExecuteStatus,
  getExecuteStatus
} from '@/api/apply/recall'

import HandleReturnStampDialog from './HandleReturnStampDialog'
import AuditApplyDialog from '../AuditApplyDialog'
export default {
  name: 'ActionExamine',
  components: { HandleReturnStampDialog, AuditApplyDialog },
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
      showExecuteStatus: false,
      recallOrExecute: false,
      defaultStampReturn: '',
      defaultReason: '',
      dataGetter: null,
      dataSetter: null,
      handleId: null,
      onlyView: false
    }
  },
  methods: {
    requireUpdate() {
      this.$emit('updated')
    },
    recallApply(isOnlyShow) {
      this.handleId = this.row.recallId
      this.dataGetter = getRecallOrder
      this.dataSetter = postRecallOrder
      this.defaultStampReturn = new Date()
      this.defaultReason = '因工作需要，此同志需尽快归队'
      this.recallOrExecute = true
      this.onlyView = isOnlyShow
      this.showExecuteStatus = true
    },
    confirmExecuteStatus(isOnlyShow) {
      this.handleId = this.row.executeStatusId
      this.dataGetter = getExecuteStatus
      this.dataSetter = postExecuteStatus
      this.defaultStampReturn = this.row.request.stampReturn
      this.defaultReason = '按时归队'
      this.recallOrExecute = false
      this.onlyView = isOnlyShow
      this.showExecuteStatus = true
    },
    CheckIfShowRecall(row) {
      return (
        row.recallId === null && new Date(row.request.stampReturn) > new Date()
      )
    }
  }
}
</script>

<style>
</style>
