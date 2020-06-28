<template>
  <el-dialog :visible.sync="innerShow" title="召回">
    <el-card v-loading="loading">
      <el-form ref="auditForm" label-width="6rem">
        <el-form-item label="被召回人">
          <UserFormItem :userid="row.userBase.id" />
        </el-form-item>
        <el-form-item v-show="isOnlyToShowRecallMsg" label="召回人">
          <UserFormItem :userid="auditForm.authByUserId" />
        </el-form-item>
        <el-form-item v-show="isOnlyToShowRecallMsg" label="召回创建">
          <el-date-picker
            v-model="auditForm.recallData.create"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            disabled
            style="width:100%"
          />
        </el-form-item>
        <el-form-item label="原归队时">
          <el-date-picker
            v-model="auditForm.recallData.rawStampReturn"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            disabled
            style="width:100%"
          />
        </el-form-item>
        <el-form-item label="召回截止">
          <el-date-picker
            v-model="auditForm.stampReturn"
            format="yyyy-MM-dd"
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
      <el-button-group v-if="!isOnlyToShowRecallMsg">
        <el-button type="info" @click="$emit('update:show',false)">取 消</el-button>
        <el-button type="warning" @click="SubmitRecall">召 回</el-button>
      </el-button-group>
      <el-button v-else @click="$emit('update:isOnlyToShowRecallMsg',false)">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { postRecallOrder, getRecallOrder } from '@/api/apply'
import AuthCode from '@/components/AuthCode'
import UserFormItem from '@/components/User/UserFormItem'
export default {
  name: 'RecallApplyDialog',
  components: { AuthCode, UserFormItem },
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
      loading: false,
      auditForm: {
        auth: {},
        recallData: {}
      }
    }
  },
  computed: {
    myUserid() {
      return this.$store.state.user.userid
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
      const row = this.row
      const sr = row.request.stampReturn
      this.auditForm.applyId = row.id
      this.auditForm.recallData = {
        rawStampReturn: sr
      }
    },
    showRecallMsg() {
      const row = this.row
      const auditForm = this.auditForm
      auditForm.recallData.rawStampReturn = row.request.stampReturn
      this.loading = true
      getRecallOrder(row.recallId)
        .then(res => {
          const { create, returnStamp, reason, recallBy } = res
          const { realName, id } = recallBy
          auditForm.recallData.create = create
          auditForm.stampReturn = returnStamp
          auditForm.remark = reason
          auditForm.authByUserName = realName
          auditForm.authByUserId = id
          this.$notify.success(`${auditForm.authByUserName}召回的人员`)
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
