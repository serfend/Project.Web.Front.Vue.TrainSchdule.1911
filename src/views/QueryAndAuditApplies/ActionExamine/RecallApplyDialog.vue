<template>
  <el-dialog :visible.sync="innerShow" title="召回">
    <el-form ref="auditForm" :model="auditForm" label-width="80px" :rules="rules">
      <el-row>
        <el-col :span="6">
          <el-form-item v-show="innerIsOnlyToShowRecallMsg" label="召回创建" prop="recallData.create">
            <el-date-picker
              v-model="auditForm.recallData.create"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="原归队时" prop="recallData.rawStampReturn">
            <el-date-picker
              v-model="auditForm.recallData.rawStampReturn"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="召回截止" prop="stampReturn">
            <el-date-picker
              v-model="auditForm.stampReturn"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="24" :md="24" :lg="12">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="auditForm.remark" placeholder="请输入备注" type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
      <AuthCode :form.sync="auditForm.auth" />
    </el-form>
    <span slot="footer">
      <el-button-group v-if="!innerIsOnlyToShowRecallMsg">
        <el-button type="info" @click="innerShow = false">取 消</el-button>
        <el-button type="warning" @click="SubmitRecall">召 回</el-button>
      </el-button-group>
      <el-button v-else @click="innerIsOnlyToShowRecallMsg=innerShow=false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { postRecallOrder, getRecallOrder } from '@/api/apply'
import AuthCode from '@/components/AuthCode'
export default {
  name: 'RecallApplyDialog',
  components: { AuthCode },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    isOnlyToShowRecallMsg: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      auditForm: {
        auth: {},
        recallData: {}
      },
      stampReturn: '',
      recallByUser: null,
      rules: {
        stampReturn: [
          { require: true, message: '请选择召回截止时间', trigger: 'blur' },
          {
            validator: this.stampReturnValidator,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    myUserid() {
      return this.$store.state.user.userid
    },
    innerIsOnlyToShowRecallMsg: {
      get() {
        return this.isOnlyToShowRecallMsg
      },
      set(val) {
        this.$emit('update:isOnlyToShowRecallMsg', val)
      }
    },
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
    show: {
      handler(val) {
        if (val) {
          if (this.isOnlyToShowRecallMsg) {
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
    stampReturnValidator(r, val, cb) {
      if (new Date(val) >= new Date(this.auditForm.recallData.rawStampReturn)) {
        return cb(new Error('召回时间不得晚于正常归队时间'))
      }
      cb()
    },
    SubmitRecall() {
      const model = {
        apply: this.auditForm.applyId,
        reason: this.auditForm.remark,
        returnStamp: this.auditForm.stampReturn,
        recallBy: this.myUserid
      }
      postRecallOrder({
        data: model,
        Auth: this.auditForm.auth
      }).then(result => {
        this.$notify.success('召回操作已提交')
        this.innerShow = false
        this.$emit('updated')
      })
    },
    recallApply() {
      var row = this.row
      this.auditForm.applyId = row.id
      this.auditForm.recallData = {
        rawStampReturn: row.request.stampReturn
      }
      this.recallByUser = null
    },
    showRecallMsg() {
      var row = this.row
      this.auditForm.recallData.rawStampReturn = row.request.stampReturn
      var auditForm = this.auditForm
      getRecallOrder(row.recallId).then(res => {
        auditForm.recallData.create = res.create
        auditForm.stampReturn = res.returnStamp
        auditForm.remark = res.reason
        auditForm.authByUserName = res.recallBy.realName
        auditForm.authByUserId = res.recallBy.id
        this.$notify.success(`${auditForm.authByUserName}召回的人员`)
        this.innerShow = true
        this.recallByUser = this.auditForm.authByUserName
          ? this.auditForm.authByUserName
          : '授权召回'
      })
    }
  }
}
</script>

<style>
</style>
