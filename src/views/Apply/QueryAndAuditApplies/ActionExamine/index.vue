<template>
  <span>
    <HandleReturnStampDialog
      v-if="showExecuteStatus"
      :entity-type="entityType"
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
      @requireUpdateReason="updateDefaultReason"
    />
    <span v-if="row.status>30&&row.status<75">
      <AuditApplyDialog
        :apply-id="row.id"
        :show.sync="showAudit"
        :entity-type="entityType"
        @updated="requireUpdate"
      />
      <el-link v-show="!showAudit" type="success" @click="showAudit=true">审批</el-link>
    </span>

    <span v-if="row.status==100">
      <el-tooltip v-if="entityTypeHasRecall&&!row.executeStatus&1" content="填写召回单交终审人审批完成后，确认召回生效">
        <el-link type="danger" @click="recallApply(false)">召回</el-link>
      </el-tooltip>
      <el-tooltip
        v-if="entityTypeReturnBeforeEnd || row.stampReturn <= new Date()"
        :content="`${entityTypeReturnBeforeEnd?'':'请假结束后，'}确认实际归队时间`"
      >
        <el-link v-if="!row.executeStatus&1" type="success" @click="confirmExecuteStatus(false)">确认</el-link>
      </el-tooltip>
    </span>
    <el-link v-if="row.recallId!==null" type="primary" @click="recallApply(true)">召回信息</el-link>
    <el-link v-else-if="row.executeStatus&4" type="danger" @click="confirmExecuteStatus(true)">推迟归队</el-link>
    <el-link v-else-if="row.executeStatus&1" type="info" @click="confirmExecuteStatus(true)">已确认</el-link>
  </span>
</template>

<script>
import {
  postRecallOrder,
  getRecallOrder,
  postExecuteStatus,
  getExecuteStatus
} from '@/api/apply/recall'
import { parseTime } from '@/utils'
const INFO_delay_return = '因XXXX，需延迟归队'
const INFO_ontime_return = '按时归队'
const INFO_need_recall_return = '因XXXXX工作需要，此同志需尽快归队'
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
    },
    entityType: { type: String, default: 'vacation' }
  },
  data: () => ({
    showAudit: false,
    showExecuteStatus: false,
    recallOrExecute: false,
    defaultStampReturn: '',
    defaultReason: '',
    dataGetter: null,
    dataSetter: null,
    handleId: null,
    onlyView: false
  }),
  computed: {
    entityTypeConfirmCurrent() {
      return !this.entityTypeHasRecall
    },
    entityTypeHasRecall() {
      return this.entityType === 'vacation'
    },
    entityTypeReturnBeforeEnd() {
      return !this.entityTypeHasRecall
    }
  },
  watch: {
    defaultStampReturn: {
      handler(val) {
        this.updateDefaultReason(val)
      }
    }
  },
  methods: {
    requireUpdate() {
      this.$emit('updated')
    },
    updateDefaultReason(val) {
      if (val > new Date() && this.defaultReason === INFO_ontime_return) {
        this.defaultReason = INFO_delay_return
      } else if (
        val < new Date() - 86400000 &&
        INFO_ontime_return === this.defaultStampReturn
      ) {
        this.defaultReason = INFO_need_recall_return
      }
    },
    recallApply(isOnlyShow) {
      this.handleId = this.row.recallId
      this.dataGetter = getRecallOrder
      this.dataSetter = postRecallOrder
      this.defaultStampReturn = parseTime(new Date())
      this.defaultReason = INFO_need_recall_return
      this.recallOrExecute = true
      this.onlyView = isOnlyShow
      this.showExecuteStatus = true
    },
    confirmExecuteStatus(isOnlyShow) {
      this.handleId = this.row.executeStatusId
      this.dataGetter = getExecuteStatus
      this.dataSetter = postExecuteStatus
      this.defaultStampReturn = this.entityTypeConfirmCurrent
        ? parseTime(new Date())
        : this.row.request.stampReturn
      this.defaultReason = INFO_ontime_return
      this.recallOrExecute = false
      this.onlyView = isOnlyShow
      this.showExecuteStatus = true
    }
  }
}
</script>

<style>
</style>
