<template>
  <el-dialog :visible.sync="show">
    <el-form v-if="data" label-width="5rem">
      <el-form-item label="名称">
        <el-input v-model="data.name" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="data.description" type="textarea" />
      </el-form-item>
      <el-form-item label="负责单位">
        <CompanySelector :code.sync="data.holdBy" />
      </el-form-item>
      <el-form-item label="负责人">
        <UserSelector :code.sync="data.handleBy" />
      </el-form-item>
      <el-form-item label="考核日期">
        <el-date-picker
          v-model="data.executeTime"
          format="yyyy年MM月dd日"
          value-format="yyyy-MM-dd"
          clearable
        />
      </el-form-item>
      <AuthCode v-model="auth" />
    </el-form>
    <el-alert v-else type="error">数据没有准备好</el-alert>
    <div slot="footer">
      <el-button :disabled="!valid" type="success" @click="save">保存</el-button>
      <el-button :disabled="!valid" type="danger" @click="remove">删除</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { postExam } from '@/api/grade/grade'
import UserSelector from '@/components/User/UserSelector'
import CompanySelector from '@/components/Company/CompanySelector'
import AuthCode from '@/components/AuthCode'
export default {
  name: 'ExamEdit',
  components: { UserSelector, CompanySelector, AuthCode },
  model: {
    prop: 'data',
    event: 'change'
  },
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    show: false,
    loading: false,
    auth: null
  }),
  computed: {
    valid() {
      const f = this.data
      return f && f.name && f.holdBy && f.handleBy && f.executeTime
    }
  },
  methods: {
    remove() {
      const data = Object.assign(this.data, { isRemoved: true })
      this.submit(data)
    },
    save() {
      const data = Object.assign(this.data, { isRemoved: false })
      this.submit(data)
    },
    submit(data) {
      this.$emit('change', data)
      this.$nextTick(() => {
        this.loading = true
        postExam(this.data, this.auth)
          .then(() => {
            this.$message.success('成功')
          })
          .finally(() => {
            this.loading = false
          })
      })
    }
  }
}
</script>

<style>
</style>
