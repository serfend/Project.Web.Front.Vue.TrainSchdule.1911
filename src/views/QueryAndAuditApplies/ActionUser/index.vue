<template>
  <div>
    <el-dialog :visible.sync="authFormShow" title="敏感操作授权">
      <el-form ref="authForm" :model="authForm">
        <AuthCode :form.sync="authForm.auth" />
        <el-form-item>
          <el-button-group style="width:100%">
            <el-button type="info" style="width:50%" @click=" authFormShow = false ">取消</el-button>
            <el-button
              type="success"
              style="width:50%"
              @click="hendleExecute(authForm.method,row)"
            >确认</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-tooltip content="点击下载休假单" placement="left">
      <el-dropdown
        v-if="statusDic&&statusDic[row.status]&&statusDic[row.status].acessable.length>0"
        v-loading="loading"
        split-button
        trigger="click"
        @click="exportApply(row)"
        @command="c=>handle_action(c,row)"
      >
        <i class="el-icon-download" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="item in statusDic[row.status].acessable"
              :key="item.desc"
              :command="item"
            >
              <el-link
                v-if="actionDic[item]"
                :type="actionDic[item].type"
                style="width:100%"
              >{{ actionDic[item].alias }}</el-link>
              <div v-else>未知操作选项:{{ item }}</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-button v-else v-loading="loading" icon="el-icon-download" @click="exportApply(row)">下载</el-button>
    </el-tooltip>
  </div>
</template>

<script>
import AuthCode from '@/components/AuthCode'
import { MessageBox } from 'element-ui'
import { exportApplyDetail } from '@/api/common/static'
import { deleteApply, doAction } from '@/api/apply/handle'
export default {
  name: 'ActionUser',
  components: {
    AuthCode
  },
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
      loading: false,
      activeName: '',
      authForm: {},
      authFormShow: false
    }
  },
  computed: {
    sensitiveAction() {
      return '敏感操作'
    },
    statusDic() {
      return this.$store.state.vacation.statusDic
    },
    actionDic() {
      return this.$store.state.vacation.actionDic
    }
  },
  methods: {
    exportApplyDetail,
    handle_action(item, row) {
      const action = this.actionDic[item]
      if (!action) return
      const message = `${action.description} 确定要${action.alias}吗？`
      this.$confirm(message, {
        title: `确认${action.alias}`,
        type: 'warning',
      }).then(() => {
        this.hendleExecute(item, row)
      })
    },
    hendleExecute(method, row) {
      if (this.loading) return
      let params = row.id
      const fnName = method
      if (fnName === 'Delete') {
        if (!this.authFormShow) {
          this.authForm.method = method
          this.authFormShow = true
          return
        }
        this.authFormShow = false
        params = {
          id: row.id,
          auth: this.authForm.auth
        }
      }
      this.loading = true
      const fn =
        fnName === 'Delete' ? deleteApply(params) : doAction(fnName, params)
      fn.then(data => {
        this.$message.success(`${this.actionDic[method].alias}成功`)
      }).finally(() => {
        this.loading = false
        this.$emit('updated')
      })
    },
    exportApply(row) {
      const decider = {
        'confirm': 0,
        'cancel': 1,
        'close': -1
      }
      // TODO 此处应根据人员类别直接选取
      // TODO 允许用户选取自定义任意导出模板
      const opt = {
        message: '选择是否下载干部类型', type: 'info', title: '导出', confirmButtonText: '干部', cancelButtonText: '其他人员',
        distinguishCancelAndClose: true, showCancelButton: true, callback: action => {
          const dutiesType = decider[action]
          if (dutiesType === -1) return
          const applyId = row.id
          this.loading = true
          exportApplyDetail(dutiesType, applyId).finally(() => {
            this.loading = false
          })
        }
      }
      MessageBox(opt)
    }
  }
}
</script>

<style>
</style>
