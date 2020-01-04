<template>
  <el-dialog :visible.sync="innerShow" title="召回">
    <el-form ref="auditForm" :model="auditForm" label-width="80px">
      <el-row>
        <el-col :span="6">
          <el-form-item v-show="innerIsOnlyToShowRecallMsg" label="召回创建">
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
          <el-form-item label="原归队时">
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
          <el-form-item label="召回截止">
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
          <el-form-item label="备注">
            <el-input v-model="auditForm.remark" placeholder="请输入备注" type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-collapse>
        <el-collapse-item :title="recallByUser" :disabled="innerIsOnlyToShowRecallMsg">
          <AuthCode :form.sync="auditForm.auth" :auth-check-method="checkAuthCode" />
        </el-collapse-item>
      </el-collapse>
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
import { checkAuthCode } from '@/api/account'
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
    }
  },
  data() {
    return {
      auditForm: {
        auth: {},
        recallData: {}
      },
      recallByUser: ''
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
  methods: {
    checkAuthCode,
    SubmitRecall() {
      const model = {
        apply: this.auditForm.applyId,
        reason: this.auditForm.remark,
        returnStamp: this.auditForm.stampReturn,
        recallBy: this.myUserid
      }
      const Auth = {
        code: this.auditForm.code,
        authByUserId: this.auditForm.authByUserId
      }
      postRecallOrder({
        data: model,
        Auth: Auth
      })
        .then(result => {
          this.$notify.success('已召回' + result.id)
          this.searchData()
        })
        .catch(err => {
          this.$message.error(err.message)
        })
        .finally(() => {
          this.innerShow = false
        })
    },
    showRecallMsg(row) {
      this.innerIsOnlyToShowRecallMsg = true
      this.auditForm.recallData.rawStampReturn = row.request.stampReturn
      var auditForm = this.auditForm
      getRecallOrder(row.recallId).then(res => {
        auditForm.recallData.create = res.create
        auditForm.recallData.stampReturn = res.returnStamp
        auditForm.remark = res.reason
        auditForm.authByUserName = res.recallBy.realName
        auditForm.authByUserId = res.recallBy.id
        this.$notify.success(`${auditForm.authByUserName}召回的人员`)
        this.innerShow = true
        this.recallByUser = this.auditForm.authByUserName
          ? `召回命令下达:${this.auditForm.authByUserName}`
          : '授权召回'
      })
    },
    recallApply(row) {
      // 打开召回弹框
      this.innerShow = true
      this.innerIsOnlyToShowRecallMsg = false
      this.auditForm.applyId = row.id
      this.auditForm.recallData.rawStampReturn = row.request.stampReturn
    }
  }
}
</script>

<style>
</style>
