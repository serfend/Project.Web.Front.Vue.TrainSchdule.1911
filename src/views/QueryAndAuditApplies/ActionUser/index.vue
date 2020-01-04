<template>
  <div>
    <el-dialog :visible.sync="authFormShow" title="敏感操作授权">
      <el-form ref="authForm" :model="authForm">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item :title="sensitiveAction" name="auth">
            <template slot="title">
              默认为当前登录
              <el-tag>{{ $store.state.user.name }}</el-tag>
            </template>
            <AuthCode :form.sync="authForm.auth" :auth-check-method="checkAuthCode" />
          </el-collapse-item>
        </el-collapse>
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
    <el-dropdown split-button szie="small" trigger="click" @click="exportApply(row)">
      <i class="el-icon-download" />
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="item in userActionDic" :key="item.name">
          <el-popconfirm :title="`确定要${item.description}吗？`" @onConfirm="hendleExecute(item,row)">
            <el-button
              v-show="row.acessable.indexOf(item.name)>-1"
              slot="reference"
              :type="item.type"
              size="mini"
            >{{ item.description }}</el-button>
          </el-popconfirm>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import AuthCode from '@/components/AuthCode'
import { checkAuthCode } from '@/api/account'
import { exportApplyDetail } from '@/api/static'
import { deleteApply, publish, save, withdrew } from '@/api/apply'
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
      activeName: '',
      userActionDic: [
        {
          name: 'Save',
          description: '保存',
          fn: save,
          type: 'primary'
        },
        {
          name: 'Withdrew',
          description: '撤回',
          fn: withdrew,
          type: 'info'
        },
        {
          name: 'Publish',
          description: '发布',
          fn: publish,
          type: 'success'
        },
        {
          name: 'Delete',
          description: '删除',
          fn: deleteApply,
          type: 'danger'
        }
      ],
      authForm: {},
      authFormShow: false
    }
  },
  computed: {
    sensitiveAction() {
      return '敏感操作'
    }
  },
  methods: {
    checkAuthCode,
    exportApplyDetail,
    hendleExecute(method, row) {
      if (this.onLoading === true) {
        return false
      }
      var params = row.id
      const fn = method.fn
      if (method.name === 'Delete') {
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
      this.onLoading = true
      fn(params)
        .then(data => {
          this.$message.success(method.description + '成功')
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.onLoading = false
          this.$emit('modefied')
        })
    },
    exportApply(row) {
      var dutiesRawType = row.userBase.dutiesRawType
      var applyId = row.id
      exportApplyDetail(dutiesRawType, applyId)
    }
  }
}
</script>

<style>
</style>
