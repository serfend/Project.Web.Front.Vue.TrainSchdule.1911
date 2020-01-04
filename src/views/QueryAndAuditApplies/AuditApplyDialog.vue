<template>
  <div>
    <el-dialog :visible.sync="auditShow" title="提交审核" width="30%">
      <el-form ref="auditForm" :model="auditForm" label-width="80px">
        <el-form-item label="审核结果">
          <el-switch
            v-model="auditForm.action"
            :active-value="1"
            :inactive-value="2"
            active-color="#13ce66"
            active-text="通过"
            class="pt-2"
            inactive-color="#ff4949"
            inactive-text="驳回"
            style="display: block"
          />
        </el-form-item>
        <el-form-item label="批复内容">
          <el-input v-model="auditForm.remark" placeholder="请输入批复" type="textarea" />
        </el-form-item>
        <el-form-item label="安全码" prop="code">
          <el-input v-model="auditForm.code" placeholder="请输入安全码" />
        </el-form-item>
        <el-form-item label="审核人">
          <el-input v-model="auditForm.authByUserId" placeholder="请输入审核人的id" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="auditShow = false">取 消</el-button>
        <el-button type="primary" @click="SubmitAuditForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AuditApplyDialog',
  data() {
    return {}
  },
  methods: {
    auditFormInit() {
      return {
        recallData: {
          create: '',
          stampReturn: '',
          rawStampReturn: '',
          recallBy: {}
        },
        action: 1,
        remark: '',
        code: '',
        authByUserId: this.myUserid
      }
    }
  }
}
</script>

<style>
</style>