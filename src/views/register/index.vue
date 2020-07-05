<template>
  <el-card>
    <div v-show="waitToAuthRegisterUsersLoadId!==''">
      <el-steps :active="nowStep" simple>
        <el-step
          v-for="opt in stepOptions.filter(i=>!i.removed)"
          :key="opt.index"
          :status="nowStep==opt.index?'success':''"
          :title="opt.name"
          :icon="opt.icon"
        />
      </el-steps>
      <el-form label-position="right" label-width="120px">
        <el-collapse v-model="nowStep" accordion>
          <el-collapse-item
            v-for="opt in stepOptions.filter(i=>!i.removed)"
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
            style="margin:0 1rem 0 0"
            @click="loadWaitToAuthRegisterUsers"
          >刷新待认证人员</el-button>
          <span>选择成员</span>
          <UserSelector
            :code.sync="nowSelectRealName"
            default-info="未选择"
            style="display:inline;margin:0 1rem 0 0"
            @change="handleCurrentChange"
          />
          <span>选择单位</span>
          <CompanySelector v-model="nowSelectCompany" placeholder="选择需要检查的单位" style="width:40%" />
        </div>

        <el-table
          v-loading="tableLoading"
          :data="waitToAuthRegisterUsers"
          highlight-current-row
          style="width: 100%"
          @current-change="handleCurrentChange"
        >
          <el-table-column label="姓名" width="100">
            <template slot-scope="scope">
              <el-popover
                placement="right-start"
                trigger="hover"
                @show="scope.row.userHasShow=true"
              >
                <User :data="scope.row" :can-load-avatar="scope.row.userHasShow" />
                <span slot="reference">{{ scope.row.realName }}</span>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="dutiesName" label="职务" width="150" />
          <el-table-column prop="vacation.yearlyLength" label="基础假" width="50" />
          <el-table-column prop="vacation.maxTripTimes" label="可休路途次数" width="50" />
          <el-table-column prop="accountAuthStatus" label="状态" width="100">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.accountAuthStatus==1?'success':scope.row.accountAuthStatus==0?'info':'danger'"
              >{{ scope.row.accountAuthStatus==1?'已认证':scope.row.accountAuthStatus==0?'待认证':'已退回' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="vacation.description" label="休假详情描述">
            <template slot-scope="scope">
              <span slot="reference">{{ scope.row.vacation.description }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="vacation.description" label="休假率">
            <template slot-scope="scope">
              <VacationDescription :users-vacation="scope.row.vacation" />
            </template>
          </el-table-column>
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
        <Pagination :pagesetting.sync="MembersQuery" :total-count="MembersQueryTotalCount" />
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
import User from '@/components/User'
import UserSelector from '@/components/User/UserSelector'

import CompanySelector from '@/components/Company/CompanySelector'
import VacationDescription from '@/components/Vacation/VacationDescription'
import { regnew, authUserRegister, modefyUser } from '@/api/account'
import { getMembers } from '@/api/company'
import { getUsersVacationLimit, getUserAvatar } from '@/api/user/userinfo'
import { getUserAllInfo } from '@/api/user/usercompany'
import Pagination from '@/components/Pagination'

export default {
  name: 'Register',
  components: {
    CompanySelector,
    LangSelect,
    Pagination,
    Base,
    Application,
    Social,
    Company,
    Diy,
    Auth,
    User,
    VacationDescription,
    UserSelector
  },
  data() {
    return {
      submitLoading: false,
      tableLoading: false,
      isToRegister: true,
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
          name: '其他(可不填)',
          index: 5,
          icon: 'el-icon-s-grid',
          component: 'Diy'
        },
        {
          name: '授权(可不填)',
          index: 6,
          icon: 'el-icon-s-check',
          component: 'Auth'
        }
      ],
      MembersQuery: {
        pageIndex: 0,
        pageSize: 10
      },
      MembersQueryTotalCount: 0,
      waitToAuthRegisterUsers: [],
      waitToAuthRegisterUsersLoadId: '',
      nowSelectRealName: '', // 通过姓名选择器选中的人员
      selectIsInvalidAccount: false,
      nowSelectCompany: null
    }
  },
  computed: {
    nowLoginUserName() {
      return this.$store.state.user.realName
    }
  },
  watch: {
    nowSelectCompany: {
      handler(val) {
        if (val) {
          this.loadWaitToAuthRegisterUsers()
        }
      }
    },
    MembersQuery: {
      handler(val) {
        if (val) {
          this.loadWaitToAuthRegisterUsers()
        }
      },
      deep: true
    }
  },
  mounted() {
    if (this.$route.query) {
      this.isToRegister = this.$route.query.isRegister
    }
    this.refreshFormType()
  },
  methods: {
    modefyUser,
    regnew,
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
    switchFormType() {
      this.isToRegister = !this.isToRegister
      this.refreshFormType()
    },
    refreshFormType() {
      this.stepOptions[1].removed = !this.isToRegister
      if (this.isToRegister) {
        this.waitToAuthRegisterUsersLoadId = '0'
      }
    },
    // 授权当前账号
    submitValidAccount(valid) {
      if (this.waitToAuthRegisterUsersLoadId === '') {
        return this.$message.error('未选中用户')
      }
      var actionName = valid ? '认证' : '退回'
      this.$confirm(
        `即将对用户${this.registerForm.Base.realName}(${this.waitToAuthRegisterUsersLoadId})的注册进行【${actionName}】操作`,
        `${actionName}提示`,
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const username = this.waitToAuthRegisterUsersLoadId
        this.waitToAuthRegisterUsersLoadId = ''
        authUserRegister(username, valid).then(() => {
          this.$message.success(
            valid ? '授权成功，可通知登录' : '驳回成功，可通知重新注册'
          )
          for (var i = 0; i < this.waitToAuthRegisterUsers.length; i++) {
            if (this.waitToAuthRegisterUsers[i].id === username) {
              this.waitToAuthRegisterUsers[i].accountAuthStatus = valid ? 1 : -1
              break
            }
          }
        })
      })
    },
    // 刷新待认证人员列表
    loadWaitToAuthRegisterUsers() {
      this.tableLoading = true
      this.submitLoading = true
      getMembers({
        code: this.nowSelectCompany.code,
        page: this.MembersQuery.pageIndex,
        pageSize: this.MembersQuery.pageSize
      })
        .then(data => {
          const list = data.list.filter(item => item.inviteBy === null)
          this.MembersQueryTotalCount = data.totalCount
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
              getUsersVacationLimit(item.id)
            ])
              .then(([avatar, vacation]) => {
                item.avatar = avatar.url
                item.vacation = vacation
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
          userHasShow: false,
          id: item.id,
          realName: item.realName,
          dutiesName: item.dutiesName,
          companyName: item.companyName,
          avatar: '',
          vacation: {},
          accountAuthStatus: this.checkUserValid(item.inviteBy)
        }
        return obj
      })
      return result
    },
    checkUserValid(val) {
      return val === null ? 0 : val === '00Invalid' ? -1 : 1 // 通过邀请人判断当前用户，当邀请人为invalid，表示审核不通过，需要重新注册
    },
    handleCurrentChange(val) {
      if (!val) return
      this.waitToAuthRegisterUsersLoadId = val.id
      this.submitLoading = true
      this.selectIsInvalidAccount = val.accountAuthStatus === 0
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
            duties: data.duties,
            title: {
              name: data.duties.title
            },
            titleDate: data.duties.titleDate
          }
          const { inviteBy } = data.application
          this.selectIsInvalidAccount = this.checkUserValid(inviteBy)
          this.nowSelectCompany = data.company.company
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
          this.$message.success(regOrModefy ? '注册成功' : '修改成功')
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
</style>
