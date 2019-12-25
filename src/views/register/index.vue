<template>
  <el-card class="box-card">
    <div v-show="waitToAuthRegisterUsersLoadId!==''">
      <el-steps :active="nowStep" simple>
        <el-step
          v-for="opt in stepOptions.filter(i=>!i.remove)"
          :key="opt.index"
          :status="nowStep==opt.index?'success':''"
          :title="opt.name"
          :icon="opt.icon"
        />
      </el-steps>
      <el-form label-position="right" label-width="120px">
        <el-collapse v-model="nowStep" accordion>
          <el-collapse-item
            v-for="opt in stepOptions.filter(i=>!i.remove)"
            :key="opt.index"
            :name="opt.index"
          >
            <template slot="title">
              {{ opt.name }}
              <i :class="opt.icon" />
            </template>
            <el-card :key="opt.index" shadow="hover">
              <component :is="opt.component" :form.sync="registerForm[opt.component]" />
            </el-card>
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <el-button
        v-if="isToRegister"
        type="success"
        :loading="submitLoading"
        :style="{ width: '100%' }"
        @click="submitRegister(true)"
      >提交注册</el-button>
      <el-button
        v-if="!isToRegister"
        type="warning"
        :loading="submitLoading"
        :style="{ width: '100%' }"
        @click="submitRegister(false)"
      >修改信息</el-button>
    </div>
    <div v-if="!isToRegister">
      <el-button-group
        v-show="waitToAuthRegisterUsersLoadId!==''&&selectIsInvalidAccount"
        :style="{ width: '100%' }"
      >
        <el-button
          type="danger"
          :loading="submitLoading"
          :style="{ width: '50%' }"
          @click="submitValidAccount(false)"
        >注册信息不合格</el-button>
        <el-button
          type="success"
          :loading="submitLoading"
          :style="{ width: '50%' }"
          @click="submitValidAccount(true)"
        >注册信息合格</el-button>
      </el-button-group>

      <el-card>
        <div slot="header">
          <el-button
            type="info"
            :loading="submitLoading"
            @click="loadWaitToAuthRegisterUsers"
          >刷新待认证人员</el-button>
          <cascader-selector
            :code.sync="nowSelectCompanyCode"
            placeholder="选择需要检查的单位"
            :child-getter-method="companyChild"
          />
        </div>

        <el-table
          v-loading="tableLoading"
          :data="waitToAuthRegisterUsers"
          :default-sort="{prop: 'accountValid', order: 'descending'}"
          highlight-current-row
          style="width: 100%"
          @current-change="handleCurrentChange"
        >
          <el-table-column prop="avatar" label=" " width="80">
            <template slot-scope="scope">
              <el-avatar shape="square" :size="50" :src="scope.row.avatar" />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="100" />
          <el-table-column prop="duties" label="职务" width="150" />
          <el-table-column prop="vocation.yearlyLength" label="基础假" width="50" />
          <el-table-column prop="vocation.maxTripTimes" label="可休路途次数" width="50" />
          <el-table-column prop="accountValid" label="有效" width="80">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.accountValid?'success':'danger'"
              >{{ scope.row.accountValid?'已认证':'未认证' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="vocation.description" label="休假详情描述" />
        </el-table>
      </el-card>
    </div>
    <el-card>
      <el-button
        v-if="isToRegister"
        type="warning"
        :loading="submitLoading"
        :style="{ width: '20%' }"
        @click="switchFormType"
      >切换到审核认证</el-button>
      <div v-else>
        <el-button
          type="warning"
          :loading="submitLoading"
          :style="{ width: '20%' }"
          @click="switchFormType"
        >切换到普通注册</el-button>
      </div>
    </el-card>
  </el-card>
</template>

<script>
import LangSelect from '@/components/LangSelect'
import Base from './components/Base'
import Application from './components/Application'
import Company from './components/Company'
import Diy from './components/Diy'
import Social from './components/Social'
import Auth from '@/components/AuthCode'
import CascaderSelector from '@/components/CascaderSelector'
import { regnew, authUserRegister, modefyUser } from '@/api/account'
import { getMembers, companyChild } from '@/api/company'
import { getUsersVocationLimit, getUserAvatar } from '@/api/userinfo'
import { getUserAllInfo } from '@/api/usercompany'
export default {
  name: 'Register',
  components: {
    CascaderSelector,
    LangSelect,
    Base,
    Application,
    Social,
    Company,
    Diy,
    Auth
  },
  data() {
    return {
      submitLoading: false,
      tableLoading: false,
      registerForm: this.createForm(),
      nowStep: 1,
      stepOptions: [
        {
          name: '基本',
          index: 1,
          icon: 'el-icon-s-custom',
          component: 'Base'
        },
        {
          name: '系统',
          index: 2,
          icon: 'el-icon-document-copy',
          component: 'Application'
        },
        {
          name: '单位',
          index: 3,
          icon: 'el-icon-office-building',
          component: 'Company'
        },
        {
          name: '家庭',
          index: 4,
          icon: 'el-icon-s-home',
          component: 'Social'
        },
        {
          name: '其他',
          index: 5,
          icon: 'el-icon-s-grid',
          component: 'Diy'
        },
        {
          name: '授权',
          index: 6,
          icon: 'el-icon-s-check',
          component: 'Auth'
        }
      ],
      waitToAuthRegisterUsers: [],
      waitToAuthRegisterUsersLoadId: '',
      selectIsInvalidAccount: false,
      nowSelectCompanyCode: ''
    }
  },
  computed: {
    isToRegister() {
      return this.$store.state.user.isToRegister
    },
    nowLoginUserName() {
      return this.$store.state.user.realName
    }
  },
  watch: {
    nowSelectCompanyCode: {
      handler(val) {
        if (this.isToRegister === false) this.loadWaitToAuthRegisterUsers()
      },
      immediate: true
    }
  },
  mounted() {
    this.refreshFormType()
  },
  methods: {
    modefyUser(form) {
      return modefyUser(form)
    },
    regnew(form) {
      return regnew(form)
    },
    companyChild(id) {
      return companyChild(id)
    },
    createForm() {
      return {
        Base: {},
        Social: {},
        Company: {},
        Application: {},
        Diy: {},
        Auth: {},
        password: '',
        confirmPassword: ''
      }
    },
    returnToLogin() {
      this.$router.push({ path: '/login' })
    },
    switchFormType() {
      this.$store.state.user.isToRegister = !this.$store.state.user.isToRegister
      this.refreshFormType()
    },
    refreshFormType() {
      this.stepOptions[1].remove = !this.isToRegister
      if (this.isToRegister) {
        this.waitToAuthRegisterUsersLoadId = '0'
      }
    },
    // 授权当前账号
    submitValidAccount(valid) {
      if (this.waitToAuthRegisterUsersLoadId === '') {
        return this.$message.error('未选中用户')
      }
      if (
        confirm(
          '即将对用户' +
            this.registerForm.Base.realName +
            '(' +
            this.waitToAuthRegisterUsersLoadId +
            ')的注册进行【' +
            (valid ? '认证' : '退回' + '】操作，请确认')
        )
      ) {
        const username = this.waitToAuthRegisterUsersLoadId
        this.waitToAuthRegisterUsersLoadId = ''
        if (valid) {
          authUserRegister(username).then(() => {
            this.$message.success('授权成功')
            for (var i = 0; i < this.waitToAuthRegisterUsers.length; i++) {
              if (this.waitToAuthRegisterUsers[i].id === username) {
                this.waitToAuthRegisterUsers[i].accountValid = true
                break
              }
            }
          })
        } else {
          for (var i = 0; i < this.waitToAuthRegisterUsers.length; i++) {
            if (this.waitToAuthRegisterUsers[i].id === username) {
              this.waitToAuthRegisterUsers.splice(i, 1)
              break
            }
          }
        }
      }
    },
    // 刷新待认证人员列表
    loadWaitToAuthRegisterUsers() {
      this.tableLoading = true
      this.submitLoading = true
      getMembers({ code: this.nowSelectCompanyCode })
        .then(data => {
          const list = data.list.filter(item => item.inviteBy === null)
          if (list.length === 0) this.$message.success('当前无用户待审批')
          this.waitToAuthRegisterUsers = this.loadUserList(data.list)
          this.loadSingleUser()
        })
        .finally(() => {
          this.tableLoading = false
          this.submitLoading = false
        })
    },
    loadSingleUser() {
      var fn = []
      for (var i = 0; i < this.waitToAuthRegisterUsers.length; i++) {
        fn.push(
          new Promise((resolve, reject) => {
            var item = this.waitToAuthRegisterUsers[i]
            return Promise.all([
              getUserAvatar(item.id),
              getUsersVocationLimit(item.id)
            ])
              .then(([avatar, vocation]) => {
                item.avatar = avatar.url
                item.vocation = vocation
                resolve()
              })
              .catch(err => reject(err))
          })
        )
      }
      Promise.all(fn).then(() => {
        this.$message.success('加载完毕')
      })
    },
    loadUserList(list) {
      var result = list.map(item => {
        var obj = {
          id: item.id,
          name: item.realName,
          duties: item.dutiesName,
          avatar: '',
          vocation: {},
          accountValid: item.inviteBy !== null
        }
        return obj
      })
      return result
    },
    handleCurrentChange(val) {
      if (val === null) return
      this.waitToAuthRegisterUsersLoadId = val.id
      this.submitLoading = true
      this.selectIsInvalidAccount = !val.accountValid
      getUserAllInfo(this.waitToAuthRegisterUsersLoadId)
        .then(data => {
          this.registerForm.Social = data.social
          this.registerForm.Diy = data.diy
          this.registerForm.Base = data.base.base
          this.registerForm.Application = data.application
          this.registerForm.Company = {
            company: {
              name: data.company.company.name,
              code: data.company.company.code
            },
            duties: data.duties
          }
        })
        .finally(() => (this.submitLoading = false))
    },
    submitRegister(regOrModefy) {
      this.submitLoading = true
      this.registerForm.password = this.registerForm.Application.password
      this.registerForm.confirmPassword = this.registerForm.Application.confirmPassword
      var submitForm = {
        Data: this.registerForm,
        verify: {
          code: '201700816'
        },
        Auth: this.registerForm.Auth
      }
      const submitMethod = regOrModefy ? regnew : modefyUser
      // var confirmPassword = submitForm.Data.confirmPassword
      // var password = submitForm.Data.password
      // if (password !== confirmPassword || password === undefined) {
      //   this.nowStep = 2
      //   this.submitLoading = false
      //   return this.$message.warning('密码填写有误')
      // }
      submitMethod(submitForm)
        .then(data => {
          this.$message.success('成功执行')
        })
        .finally(() => {
          this.submitLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
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
.box-card {
  width: 1080px;
}
</style>
