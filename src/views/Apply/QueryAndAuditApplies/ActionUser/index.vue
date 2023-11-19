<template>
  <span>
    <el-dialog :visible.sync="authFormShow" title="敏感操作授权">
      <el-form ref="authForm" :model="authForm">
        <AuthCode :form.sync="authForm.auth" select-name="用户操作" />
        <el-form-item>
          <el-button-group style="width:100%">
            <el-button
              type="info"
              style="width:50%"
              @click="authFormShow = false"
            >取消</el-button>
            <el-button
              type="success"
              style="width:50%"
              @click="hendleExecute(authForm.method, row)"
            >确认</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dropdown
      v-if="
        statusDic &&
          statusDic[row.status] &&
          statusDic[row.status].acessable.length > 0
      "
      v-loading="loading"
      trigger="click"
      size="mini"
      :style="{ width: btnType ? '100%' : null }"
      @command="c => handle_action(c, row)"
    >
      <el-button
        :type="btnType || 'text'"
        :plain="!!btnType"
        :style="{ width: btnType ? '100%' : null }"
      >操作</el-button>
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
            <span v-else>未知操作选项:{{ item }}</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-button
              v-loading="loading"
              type="text"
              @click="exportApply(row)"
            >下载</el-button>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-button
              v-loading="loading"
              type="text"
              @click="showContact(row)"
            >获取联系方式</el-button>
            <el-dialog :visible.sync="currentUserShow" append-to-body>
              <UserBaseInfoCard v-model="currentUser" />
            </el-dialog>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </span>
</template>

<script>
import { doAction } from '@/api/audit/handle'
import { deleteApply } from '@/api/apply/handle'
import { datedifference } from '@/utils'
export default {
  name: 'ActionUser',
  components: {
    AuthCode: () => import('@/components/AuthCode'),
    UserBaseInfoCard: () => import('./UserBaseInfoCard')
  },
  props: {
    row: { type: Object, default: () => ({}) },
    entityType: { type: String, default: 'vacation' },
    btnType: { type: String, default: null }
  },
  data: () => ({
    loading: false,
    activeName: '',
    authForm: {},
    authFormShow: false,
    currentUser: null
  }),
  computed: {
    currentUserShow: {
      set(v) {
        this.currentUser = null
      },
      get() {
        return !!this.currentUser
      }
    },
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
    showContact(row) {
      this.currentUser = row.base
    },
    handle_action(item, row) {
      const action = this.actionDic[item]
      if (!action) return
      const message = `${action.description} 确定要${action.alias}吗？`
      this.$confirm(message, {
        title: `确认${action.alias}`,
        type: 'warning'
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
        fnName === 'Delete'
          ? deleteApply(params, this.entityType)
          : doAction(fnName, params, this.entityType)
      fn.then(data => {
        if (data && data.list && data.list[0]) {
          const opt = {
            message: `<h3>操作失败</h3><div style="margin-top:0.5em">存在${
              data.list.length
            }项冲突，<a style="color:#00f" href="/#/apply/${
              this.entityType
            }/applyDetail?id=${data.list[0]}">点击查看</a>首项</div>`,
            dangerouslyUseHTMLString: true,
            type: 'info',
            duration: 10000
          }
          this.$message(opt)
        } else {
          this.$message.success(`${this.actionDic[method].alias}成功`)
        }
      }).finally(() => {
        this.loading = false
        this.$emit('updated')
      })
    },
    exportApply(data) {
      const r = data.requestInfo
      r.totalLength = datedifference(r.stampReturn, r.stampLeave) + 1
      r.totalLengthHour =
        datedifference(r.stampReturn, r.stampLeave, 'hour') + 1
      const filename =
        {
          vacation: '休假单',
          inday: '请假单'
        }[this.entityType] || '请假单'
      this.$store
        .dispatch('template/download_xlsx', {
          templateName: `${filename}模板.xlsx`,
          data,
          filename: `当前选中数据 - ${filename}.xlsx`
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style></style>
