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
      >
        <i class="el-icon-download" />
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in statusDic[row.status].acessable" :key="item.desc">
            <el-popconfirm
              v-if="actionDic[item]"
              :title="`${actionDic[item].description} 确定要${actionDic[item].alias}吗？`"
              :confirm-button-text="actionDic[item].alias"
              @onConfirm="hendleExecute(item,row)"
            >
              <el-link slot="reference" :type="actionDic[item].type">{{ actionDic[item].alias }}</el-link>
            </el-popconfirm>
            <div v-else>未知操作选项:{{ item }}</div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button v-else v-loading="loading" icon="el-icon-download" @click="exportApply(row)">下载</el-button>
    </el-tooltip>
  </div>
</template>

<script>
import AuthCode from '@/components/AuthCode'
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
    hendleExecute(method, row) {
      if (this.loading) return
      var params = row.id
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
      var fn =
        fnName === 'Delete' ? deleteApply(params) : doAction(fnName, params)
      fn.then(data => {
        this.$message.success(`${this.actionDic[method].alias}成功`)
      }).finally(() => {
        this.loading = false
        this.$emit('updated')
      })
    },
    exportApply(row) {
      var dutiesRawType = confirm('选择是否下载干部类型') ? 0 : 1 // TODO 后期需要修改此处以保证下载正确
      var applyId = row.id
      this.loading = true
      exportApplyDetail(dutiesRawType, applyId).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style>
</style>
