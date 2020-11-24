<template>
  <div>
    <el-card v-if="currentUser&&currentUser.id||!init_page_over" style="max-width:60rem">
      <div v-if="is_register" class="reg-header">
        <h2>欢迎注册</h2>
        <p>
          已有账号
          <el-button type="text" @click="switch_login">登录</el-button>
        </p>
      </div>
      <el-form v-loading="loading" label-position="right" label-width="5rem">
        <el-tabs v-model="nowStep" accordion>
          <el-tab-pane
            v-for="opt in stepOptions.filter((i) => !i.removed)"
            :key="opt.index"
            :label="opt.name"
          >
            <div :key="opt.index">
              <component
                :is="opt.component"
                :form.sync="registerForm[opt.component]"
                :is-register="is_register"
                :child-index="opt.childIndex"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <el-card v-if="!is_register" style="margin-top:1rem">
        <el-form>
          <el-form-item label="认证状态">
            <el-tag :type="selectIsInvalidAccountType">{{ selectIsInvalidAccountDescription }}</el-tag>
          </el-form-item>
          <el-form-item label="账号操作" style="margin-top:1rem">
            <el-button type="warning" plain :loading="loading" @click="submitRegister(false)">修改信息</el-button>
            <el-button type="danger" plain :loading="loading" @click="removeAccount">删除账号</el-button>
          </el-form-item>
          <el-form-item label="账号认证" style="margin-top:1rem">
            <el-button
              :disabled="selectIsInvalidAccount!==0"
              type="success"
              plain
              :loading="loading"
              @click="submitValidAccount(true)"
            >注册信息合格</el-button>
            <el-button
              :disabled="selectIsInvalidAccount!==0"
              type="danger"
              plain
              :loading="loading"
              @click="submitValidAccount(false)"
            >注册信息不合格</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-button
        v-else-if="showSubmitButton"
        type="success"
        plain
        :loading="loading"
        style="width:100%;margin-top:1rem"
        @click="submitRegister(true)"
      >提交注册</el-button>
    </el-card>
    <el-dialog :visible="card_should_show" append-to-body>
      <NotLoginRegisterNotice />
    </el-dialog>
    <el-dialog :visible.sync="remove_account.show" append-to-body>
      <h2 slot="title">删除账号 - 敏感操作授权</h2>
      <div style="color:#c00">您确定要删除用户吗</div>
      <div style="color:#c00">用户名：{{ current_select_id }}</div>
      <div style="color:#c00;margin-top:1rem">此操作将永久移除账号，移除后将不可恢复。</div>
      <el-form style="margin-top:1rem">
        <AuthCode v-model="remove_account.auth" />
      </el-form>
      <template slot="footer">
        <el-button type="text" style="color:#d77" @click="remove_account_confirm">确认</el-button>
        <el-button type="success" @click="remove_account.show=false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
const createForm = () => ({
  Base: {},
  Social: {},
  Company: {
    // company component require this prop
    company: {},
    title: {},
    duties: {},
  },
  Application: {},
  Diy: {},
  Auth: {},
  password: '',
  confirmPassword: '',
})
import SvgIcon from '@/components/SvgIcon'
import Base from '../components/Base'
import Application from '../components/Application'
import Company from '../components/Company'
import Diy from '../components/Diy'
import Social from '../components/Social'
import Auth from '@/components/AuthCode'
import {
  regnew,
  modifyUser,
  removeAccount,
  authUserRegister,
} from '@/api/account'
import { getUserAllInfo } from '@/api/user/usercompany'
import NotLoginRegisterNotice from '../NotLoginRegisterNotice'
import Login from '@/views/login'
import { checkUserValid } from '@/utils/validate'
import AuthCode from '@/components/AuthCode'
const Const_DisabledVacation = 4
export default {
  name: 'Register',
  components: {
    SvgIcon,
    Base,
    Application,
    Social,
    Company,
    Diy,
    Auth,
    NotLoginRegisterNotice,
    Login,
    AuthCode,
  },
  props: {
    showSubmitButton: {
      type: Boolean,
      default: true,
    },
    userInfo: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      registerForm: createForm(),
      selectIsInvalidAccount: false,
      current_select_id: null,
      nowStep: '0',
      stepOptions: [
        {
          name: '基本',
          index: 1,
          childIndex: 0,
          childNum: 1,
          icon: 'el-icon-s-custom',
          component: 'Base',
        },
        {
          name: '系统',
          index: 2,
          childIndex: 0,
          childNum: 1,
          icon: 'el-icon-document-copy',
          component: 'Application',
        },
        {
          name: '单位',
          index: 3,
          childIndex: 0,
          childNum: 1,
          icon: 'el-icon-office-building',
          component: 'Company',
        },
        {
          name: '家庭',
          index: 4,
          childIndex: 0,
          childNum: 4,
          icon: 'el-icon-s-home',
          component: 'Social',
        },
        {
          name: '其他(可不填)',
          index: 5,
          childIndex: 0,
          childNum: 1,
          icon: 'el-icon-s-grid',
          component: 'Diy',
        },
        {
          name: '授权(可不填)',
          index: 6,
          childIndex: 0,
          childNum: 1,
          icon: 'el-icon-s-check',
          component: 'Auth',
        },
      ],
      not_login_show: false,
      init_page_over: false,
      card_should_show: false,
      remove_account: {
        auth: null,
        show: false,
      },
    }
  },
  computed: {
    is_register() {
      return this.userInfo === null
    },
    currentUser() {
      return this.$store.state.user.data
    },
    is_login() {
      return this.currentUser && this.currentUser.id
    },
    selectIsInvalidAccountType() {
      const s = this.selectIsInvalidAccount
      return s === 0 ? 'info' : s === 1 ? 'success' : 'danger'
    },
    selectIsInvalidAccountDescription() {
      const s = this.selectIsInvalidAccount
      const c = '用户信息认证'
      switch (s) {
        case -1:
          return c + '已驳回'
        case 0:
          return c + '待审批'
        case 1:
          return c + '已通过'
      }
      return '未知状态:' + s
    },
  },
  watch: {
    init_page_over(val) {
      this.card_should_show = val && !this.is_login
    },
    is_login(val) {
      this.card_should_show = !val && this.init_page_over
    },
    userInfo: {
      handler(val) {
        return this.handleCurrentChange(val)
      },
      immediate: true,
    },
  },
  mounted() {
    setTimeout(() => {
      this.init_page_over = true
    }, 5000)
  },
  methods: {
    modifyUser,
    regnew,
    next_step(step) {
      let now_index = parseInt(this.nowStep)
      const target = this.stepOptions[now_index]
      if (
        target.childIndex + step < target.childNum &&
        target.childIndex + step >= 0
      ) {
        target.childIndex += step
        return
      }
      if (now_index + step < this.stepOptions.length && now_index + step >= 0) {
        now_index += step
        this.nowStep = now_index.toString()
      }
    },
    // 授权当前账号
    submitValidAccount(valid) {
      if (this.current_select_id === '') {
        return this.$message.error('未选中用户')
      }
      const actionName = valid ? '认证' : '退回'
      const tip_auth = `即将对用户${this.registerForm.Base.realName}(${this.current_select_id})的注册进行【${actionName}】操作`
      this.$confirm(tip_auth, `${actionName}提示`, { type: 'warning' }).then(
        () => {
          const username = this.current_select_id
          this.loading = true
          authUserRegister(username, valid)
            .then(() => {
              this.$message.success(
                valid ? '授权成功，可通知登录' : '驳回成功，可通知重新注册'
              )
            })
            .finally(() => {
              this.loading = false
            })
        }
      )
    },
    handleCurrentChange(val) {
      if (!val) return
      this.current_select_id = val.id
      this.loading = true
      this.selectIsInvalidAccount = 0
      getUserAllInfo(this.current_select_id)
        .then((data) => {
          const f = this.registerForm
          f.Social = data.social
          f.Diy = data.diy
          f.Base = data.base.base
          f.Application = data.application
          const duties = data.duties || {}
          const company = data.company.company
          f.Company = {
            company,
            duties: {
              name: duties.name,
            },
            title: {
              name: duties.title,
            },
            titleDate: duties.titleDate,
          }
          const { invitedBy } = data.application
          this.selectIsInvalidAccount = checkUserValid(invitedBy)
          this.nowSelectCompany = company
        })
        .finally(() => {
          this.loading = false
        })
    },
    async submitRegister(regOrModify) {
      const confirm_action = await this.$confirm('确定要提交吗？').catch(
        (e) => {
          this.$message.error('已取消')
        }
      )
      if (!confirm_action) return
      this.loading = true
      const f = this.registerForm
      f.password = f.Application.password
      f.confirmPassword = f.Application.confirmPassword
      // debugger
      // reset status to normal
      if (!f.Application.accountStatus) f.Application.accountStatus = 0
      if ((f.Application.accountStatus & Const_DisabledVacation) > 0) {
        console.log('reset vacation')
        f.Application.accountStatus -= Const_DisabledVacation
      }
      // syn status to disabled vacation
      if (f.Company.disabledVacation) {
        console.log('disabled vacation')
        f.Application.accountStatus += Const_DisabledVacation
      }
      const submitForm = {
        Data: f,
        verify: {
          code: '201700816',
        },
        Auth: f.Auth,
      }
      const submitMethod = regOrModify ? regnew : modifyUser
      // var confirmPassword = submitForm.Data.confirmPassword
      // var password = submitForm.Data.password
      // if (password !== confirmPassword || password === undefined) {
      //   this.nowStep = 2
      //   this.loading = false
      //   return this.$message.warning('密码填写有误')
      // }
      submitMethod(submitForm)
        .then((data) => {
          this.$message.success(regOrModify ? '注册成功' : '修改成功')
          if (regOrModify) {
            this.$router.push('/')
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    removeAccount() {
      this.$confirm('删除后将不可恢复，确定要删除此账号吗？', '警告', {
        type: 'error',
      }).then(() => {
        this.remove_account.show = true
      })
    },
    remove_account_confirm() {
      this.loading = true
      removeAccount({
        id: this.current_select_id,
        auth: this.remove_account.auth,
      })
        .then(() => {
          this.$emit('requireUpdate')
          this.$emit('requireHide')
          this.$message.success('已删除账号')
        })
        .finally(() => {
          this.loading = false
          this.remove_account.show = false
        })
    },
    switch_login() {
      this.$store.dispatch('user/logout')
      this.$router.push({ path: '/vacation/myApply' })
    },
  },
}
</script>

<style lang="scss" scoped>
.tab-container {
  .el-tab-pane {
    animation: fade 0.5s ease;
  }

  @keyframes fade {
    from {
      opacity: 0;
      transform: translateX(100%);
    }

    to {
      opacity: 1;
    }
  }
}

.top-enter,
.top-leave-to {
  transform: translate3d(0, -100%, 0);
}

.top-leave,
.top-enter-to {
  transform: translate3d(0, 0, 0);
}

.top-enter-active,
.top-leave-active {
  transition: all 0.2s;
}
</style>
