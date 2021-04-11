<template>
  <el-dialog :visible.sync="innerShow" :title="`${displayName}完成时间`" append-to-body>
    <el-card v-loading="loading">
      <el-form ref="auditForm" label-width="6rem">
        <el-form-item :label="`被${displayName}人`">
          <UserFormItem :userid="row.userBase?row.userBase.id:row.base.id" />
        </el-form-item>
        <el-form-item :label="`${displayName}人`">
          <UserSelector :code.sync="auditForm.handleBy" />
        </el-form-item>
        <el-form-item v-show="onlyView" :label="`${displayName}创建`">
          <el-date-picker
            v-model="auditForm.recallData.create"
            disabled
            type="datetime"
            style="width:100%"
          />
        </el-form-item>
        <el-form-item label="离队时间">
          <el-date-picker
            v-model="auditForm.rawStampLeave"
            type="datetime"
            disabled
            style="width:100%"
          />
        </el-form-item>
        <el-form-item label="原归队时">
          <el-date-picker
            v-model="auditForm.recallData.rawStampReturn"
            type="datetime"
            disabled
            style="width:100%"
          />
        </el-form-item>
        <el-form-item :label="`${displayName}后时间`">
          <el-date-picker v-model="auditForm.stampReturn" type="datetime" style="width:100%" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="auditForm.remark" placeholder="请输入备注" type="textarea" />
        </el-form-item>
        <AuthCode :form.sync="auditForm.auth" :select-name="`${displayName} - 归队时间`" />
      </el-form>
    </el-card>
    <span slot="footer">
      <el-button-group v-if="!onlyView">
        <el-button type="info" @click="$emit('update:show',false)">取 消</el-button>
        <el-button type="warning" @click="SubmitRecall">确 定</el-button>
      </el-button-group>
      <el-button v-else @click="$emit('update:show',false)">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { parseTime } from '@/utils'
export default {
  name: 'HandleReturnStampDialog',
  components: {
    AuthCode: () => import('@/components/AuthCode'),
    UserFormItem: () => import('@/components/User/UserFormItem'),
    UserSelector: () => import('@/components/User/UserSelector')
  },
  props: {
    show: { type: Boolean, default: false },
    onlyView: { type: Boolean, default: false },
    row: {
      type: Object,
      default() {
        return {}
      }
    },
    defaultStampReturn: { type: [String, Date], default: '' },
    defaultReason: { type: String, default: '' },
    displayName: { type: String, required: true },
    dataGetter: { type: Function, required: true },
    dataSetter: { type: Function, required: true },
    handleId: { type: String, default: null },
    entityType: { type: String, default: 'vacation' }
  },
  data: () => ({
    loading: false,
    auditForm: {
      auth: {
        authByUserId: null,
        code: null
      },
      recallData: {},
      stampReturn: null,
      remark: null,
      handleBy: null
    }
  }),
  computed: {
    innerShow: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit('update:show', val)
      }
    }
  },
  watch: {
    'auditForm.auth.authByUserId': {
      handler(val) {
        if (!this.onlyView) this.auditForm.handleBy = val
      }
    },
    defaultStampReturn: {
      handler(val) {
        this.auditForm.stampReturn = val
      },
      immediate: true
    },
    defaultReason: {
      handler(val) {
        this.auditForm.remark = val
      },
      immediate: true
    },
    'auditForm.stampReturn': {
      handler(val) {
        this.$emit('requireUpdateReason', val)
      }
    },
    show: {
      handler(val) {
        if (val) {
          if (this.onlyView) {
            this.showRecallMsg()
          } else {
            this.recallApply()
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    SubmitRecall() {
      const model = {
        apply: this.auditForm.applyId,
        reason: this.auditForm.remark,
        returnStamp: parseTime(this.auditForm.stampReturn),
        handleBy: this.auditForm.handleBy
      }
      const fn = this.dataSetter
      fn({
        data: model,
        auth: this.auditForm.auth,
        entityType: this.entityType
      }).then(result => {
        this.$notify.success(`${this.displayName}操作已提交`)
        this.innerShow = false
        this.$emit('updated')
      })
    },
    recallApply() {
      const row = this.row
      const sr = row.request.stampReturn
      const sl = row.request.stampLeave
      const auditForm = this.auditForm
      auditForm.applyId = row.id
      auditForm.rawStampLeave = sl
      auditForm.recallData = {
        rawStampReturn: sr
      }
    },
    showRecallMsg() {
      const row = this.row
      const auditForm = this.auditForm
      auditForm.recallData.rawStampReturn = row.request.stampReturn
      this.loading = true
      const fn = this.dataGetter
      fn({ id: this.handleId, entityType: this.entityType })
        .then(res => {
          const { create, returnStamp, reason, handleBy } = res
          const { realName, id } = handleBy
          auditForm.recallData.create = create
          auditForm.stampReturn = returnStamp
          const row = this.row
          auditForm.rawStampLeave = row && row.request.stampLeave
          auditForm.remark = reason
          auditForm.handleBy = id
          this.$notify.success(`${realName}${this.displayName}的人员`)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style>
</style>
