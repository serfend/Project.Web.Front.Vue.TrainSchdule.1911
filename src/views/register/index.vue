<template>
  <div>
    <el-tabs v-model="current_tab" type="border-card" class="tab-container">
      <el-tab-pane :disabled="waitToAuthRegisterUsersLoadId == ''" name="reg" label="用户信息">
        <el-form v-loading="submitLoading" label-position="right" label-width="120px">
          <el-collapse v-model="nowStep" accordion>
            <el-collapse-item
              v-for="opt in stepOptions.filter((i) => !i.removed)"
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
          @click="submitRegister(true)"
        >提交注册</el-button>
        <el-button
          v-if="isToRegister"
          type="primary"
          :loading="submitLoading"
          @click="switchFormType"
        >切换到审核认证</el-button>
        <el-button
          v-if="!isToRegister"
          type="warning"
          :loading="submitLoading"
          @click="submitRegister(false)"
        >修改信息</el-button>
        <span
          v-show="
            waitToAuthRegisterUsersLoadId !== '' && selectIsInvalidAccount
          "
        >
          <el-button
            type="danger"
            :loading="submitLoading"
            @click="submitValidAccount(false)"
          >注册信息不合格</el-button>
          <el-button
            type="success"
            :loading="submitLoading"
            @click="submitValidAccount(true)"
          >注册信息合格</el-button>
        </span>
      </el-tab-pane>
      <el-tab-pane :disabled="isToRegister" name="lst" label="用户列表">
        <el-card>
          <div slot="header">
            <el-card>
              <span>选择成员</span>
              <UserSelector
                :code.sync="nowSelectRealName"
                default-info="未选择"
                style="display: inline; margin: 0 1rem 0 0"
                @change="handleCurrentChange"
              />
              <span>选择单位</span>
              <CompanySelector
                v-model="nowSelectCompany"
                placeholder="选择需要检查的单位"
                style="width: 40%"
              />
              <div style="margin-top: 0.5rem">
                <el-button
                  type="primary"
                  :loading="submitLoading"
                  @click="requireLoadWaitToAUthRegisterUsers"
                >刷新待认证人员</el-button>
                <el-button
                  v-if="!isToRegister"
                  type="primary"
                  :loading="submitLoading"
                  @click="switchFormType"
                >切换到普通注册</el-button>
              </div>
            </el-card>
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
                  @show="scope.row.userHasShow = true"
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
                  :type="scope.row.accountAuthStatus == 1?'success': scope.row.accountAuthStatus == 0?'info':'danger'"
                >{{ scope.row.accountAuthStatus == 1 ? '已认证' : scope.row.accountAuthStatus == 0 ? '待认证' : '已退回' }}</el-tag>
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
        <Pagination
          v-if="!isToRegister"
          :pagesetting.sync="MembersQuery"
          :total-count="MembersQueryTotalCount"
        />
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible="init_page_over && not_login_show">
      <SvgIcon
        icon-class="Message_error"
        style-normal="width:6rem;height:6rem;margin: auto;color:rgb(243, 126, 125)"
        class-name="item-put-center"
      />
      <div class="item-put-center" style="margin: 3rem 0 2rem 0; font-size: 2rem">进入注册页面失败</div>
      <div class="item-put-center" style="margin: 3rem 0 2rem 0; font-size: 1rem">为保证您的账号安全</div>

      <div class="item-put-center" style="margin: 3rem 0 2rem 0; font-size: 1.2rem">
        <span>请</span>
        <el-link href="/" type="danger">登录任何一名其他成员的账号</el-link>
        <span>执行注册操作</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
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
import { debounce } from '@/utils'

export default {
  name: 'Register',
  components: {
    SvgIcon,
    CompanySelector,
    Pagination,
    Base,
    Application,
    Social,
    Company,
    Diy,
    Auth,
    User,
    VacationDescription,
    UserSelector,
  },
  data() {
    return {
      submitLoading: false,
      tableLoading: false,
      isToRegister: true,
      current_tab: 'lst',
      registerForm: this.createForm(),
      nowStep: 1,
      stepOptions: [
        {
          name: '基本',
          index: 1,
          icon: 'el-icon-s-custom',
          component: 'Base',
        },
        {
          name: '系统',
          index: 2,
          icon: 'el-icon-document-copy',
          component: 'Application',
        },
        {
          name: '单位',
          index: 3,
          icon: 'el-icon-office-building',
          component: 'Company',
        },
        {
          name: '家庭',
          index: 4,
          icon: 'el-icon-s-home',
          component: 'Social',
        },
        {
          name: '其他(可不填)',
          index: 5,
          icon: 'el-icon-s-grid',
          component: 'Diy',
        },
        {
          name: '授权(可不填)',
          index: 6,
          icon: 'el-icon-s-check',
          component: 'Auth',
        },
      ],
      MembersQuery: {
        pageIndex: 0,
        pageSize: 10,
      },
      MembersQueryTotalCount: 0,
      waitToAuthRegisterUsers: [],
      waitToAuthRegisterUsersLoadId: null,
      nowSelectRealName: '', // 通过姓名选择器选中的人员
      selectIsInvalidAccount: false,
      nowSelectCompany: null,
      not_login_show: false,
      init_page_over: false,
    }
  },
  computed: {
    requireLoadWaitToAUthRegisterUsers() {
      return debounce(() => {
        this.loadWaitToAuthRegisterUsers()
      }, 500)
    },
    currentCmp() {
      return this.$store.state.user.companyid
    },
  },
  watch: {
    currentCmp: {
      handler(val) {
        this.nowSelectCompany = {
          code: val,
        }
        this.not_login_show = !val
        const to_tab = this.isToRegister ? 'reg' : 'lst'
        if (to_tab !== this.current_tab) {
          setTimeout(() => {
            this.current_tab = to_tab
          }, 2000)
        }
      },
      immediate: true,
    },
    nowSelectCompany: {
      handler(val) {
        if (val) {
          this.requireLoadWaitToAUthRegisterUsers()
        }
      },
      immediate: true,
    },
    MembersQuery: {
      handler(val) {
        if (val) {
          this.requireLoadWaitToAUthRegisterUsers()
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.isToRegister =
      this.$route.query && this.$route.query.isRegister === 'true'
    this.refreshFormType()
    setTimeout(() => {
      this.init_page_over = true
    }, 5000)
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
        confirmPassword: '',
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
        this.current_tab = 'reg'
      } else {
        this.current_tab = 'lst'
        this.waitToAuthRegisterUsersLoadId = null
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
          type: 'warning',
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
    async loadWaitToAuthRegisterUsers() {
      this.tableLoading = true
      this.submitLoading = true
      getMembers({
        code: this.nowSelectCompany.code,
        page: this.MembersQuery.pageIndex,
        pageSize: this.MembersQuery.pageSize,
      })
        .then(async(data) => {
          this.MembersQueryTotalCount = data.totalCount
          this.waitToAuthRegisterUsers = this.loadUserList(data.list)
          await this.loadSingleUser()
        })
        .finally(() => {
          this.tableLoading = false
          this.submitLoading = false
        })
    },
    async loadSingleUser() {
      const fn = []
      for (let i = 0; i < this.waitToAuthRegisterUsers.length; i++) {
        fn.push(
          new Promise((resolve, reject) => {
            const item = this.waitToAuthRegisterUsers[i]
            return Promise.all([
              getUserAvatar(item.id),
              getUsersVacationLimit(item.id),
            ])
              .then(([avatar, vacation]) => {
                item.avatar = avatar.url
                item.vacation = vacation
                resolve()
              })
              .catch((err) => reject(err))
          })
        )
      }
      await Promise.all(fn)
    },
    loadUserList(list) {
      const result = list.map((item) => {
        const obj = {
          userHasShow: false,
          avatar: '',
          vacation: {},
          accountAuthStatus: this.checkUserValid(item.inviteBy),
        }
        return Object.assign(item, obj)
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
      this.current_tab = 'reg'
      getUserAllInfo(this.waitToAuthRegisterUsersLoadId)
        .then((data) => {
          const f = this.registerForm
          f.Social = data.social
          f.Diy = data.diy
          f.Base = data.base.base
          f.Application = data.application
          const duties = data.duties || {}
          const company = data.company.company
          f.Company = {
            company: {
              name: company.name,
              code: company.code,
            },
            duties: {
              name: duties.name,
            },
            title: {
              name: duties.title,
            },
            titleDate: duties.titleDate,
          }
          const { inviteBy } = data.application
          this.selectIsInvalidAccount = this.checkUserValid(inviteBy)
          this.nowSelectCompany = company
        })
        .finally(() => {
          this.submitLoading = false
        })
    },
    async submitRegister(regOrModefy) {
      const confirm_action = await this.$confirm('确定要提交吗？').catch(
        (e) => {
          this.$message.error('已取消')
        }
      )
      if (!confirm_action) return
      this.submitLoading = true
      const f = this.registerForm
      f.password = f.Application.password
      f.confirmPassword = f.Application.confirmPassword
      const submitForm = {
        Data: f,
        verify: {
          code: '201700816',
        },
        Auth: f.Auth,
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
        .then((data) => {
          this.$message.success(regOrModefy ? '注册成功' : '修改成功')
        })
        .finally(() => {
          this.submitLoading = false
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.item-put-center {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}

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
