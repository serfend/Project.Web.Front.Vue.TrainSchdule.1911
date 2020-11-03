<template>
  <el-dialog :visible.sync="innerShow" :title="`${displayName}休假`" append-to-body>
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
            format="yyyy年MM月dd日"
            value-format="yyyy-MM-dd"
            disabled
            style="width:100%"
          />
        </el-form-item>
        <el-form-item label="原归队时">
          <el-date-picker
            v-model="auditForm.recallData.rawStampReturn"
            format="yyyy年MM月dd日"
            value-format="yyyy-MM-dd"
            disabled
            style="width:100%"
          />
        </el-form-item>
        <el-form-item :label="`${displayName}后时间`">
          <el-date-picker
            v-model="auditForm.stampReturn"
            format="yyyy年MM月dd日"
            value-format="yyyy-MM-dd"
            style="width:100%"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="auditForm.remark" placeholder="请输入备注" type="textarea" />
        </el-form-item>
        <AuthCode :form.sync="auditForm.auth" />
      </el-form>
    </el-card>
    <span slot="footer">
      <el-button-group v-if="!onlyView">
        <el-button type="info" @click="$emit('update:show',false)">取 消</el-button>
        <el-button type="warning" @click="SubmitRecall">确 定</el-button>
      </el-button-group>
      <el-button v-else @click="$emit('update:onlyView',false)">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import AuthCode from '@/components/AuthCode'
import UserFormItem from '@/components/User/UserFormItem'
import UserSelector from '@/components/User/UserSelector'
export default {
  name: 'HandleReturnStampDialog',
  components: { AuthCode, UserFormItem, UserSelector },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    onlyView: {
      type: Boolean,
      default: false,
    },
    row: {
      type: Object,
      default() {
        return {}
      },
    },
    defaultStampReturn: {
      type: [String, Date],
      default: '',
    },
    defaultReason: {
      type: String,
      default: '',
    },
    displayName: {
      type: String,
      required: true,
    },
    dataGetter: {
      type: Function,
      required: true,
    },
    dataSetter: {
      type: Function,
      required: true,
    },
    handleId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      auditForm: {
        auth: {
          authByUserId: null,
          code: null,
        },
        recallData: {},
        stampReturn: null,
        remark: null,
        handleBy: null,
      },
    }
  },
  computed: {
    innerShow: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit('update:show', val)
      },
    },
  },
  watch: {
    'auditForm.auth.authByUserId': {
      handler(val) {
        if (!this.onlyView) this.auditForm.handleBy = val
      },
    },
    defaultStampReturn: {
      handler(val) {
        this.auditForm.stampReturn = val
      },
      immediate: true,
    },
    defaultReason: {
      handler(val) {
        this.auditForm.remark = val
      },
      immediate: true,
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
      immediate: true,
    },
  },
  methods: {
    SubmitRecall() {
      const model = {
        apply: this.auditForm.applyId,
        reason: this.auditForm.remark,
        returnStamp: this.auditForm.stampReturn,
        handleBy: this.auditForm.handleBy,
      }
      const fn = this.dataSetter
      fn({
        data: model,
        Auth: this.auditForm.auth,
      }).then((result) => {
        this.$notify.success(`${this.displayName}操作已提交`)
        this.innerShow = false
        this.$emit('updated')
      })
    },
    recallApply() {
      const row = this.row
      const sr = row.request.stampReturn
      this.auditForm.applyId = row.id
      this.auditForm.recallData = {
        rawStampReturn: sr,
      }
    },
    showRecallMsg() {
      const row = this.row
      const auditForm = this.auditForm
      auditForm.recallData.rawStampReturn = row.request.stampReturn
      this.loading = true
      const fn = this.dataGetter
      fn(this.handleId)
        .then((res) => {
          const { create, returnStamp, reason, handleBy } = res
          const { realName, id } = handleBy
          auditForm.recallData.create = create
          auditForm.stampReturn = returnStamp
          auditForm.remark = reason
          auditForm.handleBy = id
          this.$notify.success(`${realName}${this.displayName}的人员`)
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style>
</style>
