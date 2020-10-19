<template>
  <div>
    <el-card v-if="currentUser&&currentUser.id">
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
          <CompanySelector v-model="nowSelectCompany" placeholder="选择需要检查的单位" style="width: 40%" />
          <div style="margin-top: 0.5rem">
            <el-button
              type="primary"
              :loading="loading"
              @click="requireLoadWaitToAUthRegisterUsers"
            >刷新待认证人员</el-button>
          </div>
        </el-card>
      </div>

      <el-table
        v-loading="loading"
        :data="waitToAuthRegisterUsers"
        highlight-current-row
        style="width: 100%"
        @row-click="handleCurrentChange"
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
        <el-table-column label="全年假" width="70">
          <template slot-scope="scope">{{ scope.row.vacation.yearlyLength }}天</template>
        </el-table-column>
        <el-table-column label="路途" width="50">
          <template slot-scope="scope">{{ scope.row.vacation.maxTripTimes }}次</template>
        </el-table-column>
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
      <Pagination :pagesetting.sync="MembersQuery" :total-count="MembersQueryTotalCount" />
    </el-card>
    <Login v-else />
    <el-dialog :visible.sync="approve_show">
      <register
        :user-info="current_select_id"
        @requireUpdate="requireLoadWaitToAUthRegisterUsers"
        @requireHide="approve_show = false"
      />
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import VacationDescription from '@/components/Vacation/VacationDescription'
import Login from '@/views/login'
import UserSelector from '@/components/User/UserSelector'
import CompanySelector from '@/components/Company/CompanySelector'
import User from '@/components/User'
import { getMembers } from '@/api/company'
import { getUsersVacationLimit, getUserAvatar } from '@/api/user/userinfo'
import { checkUserValid } from '@/utils/validate'
import { debounce } from '@/utils'
import register from '../register/RegForm'
export default {
  name: 'Approve',
  components: {
    UserSelector,
    CompanySelector,
    VacationDescription,
    Pagination,
    Login,
    User,
    register,
  },
  data: () => ({
    MembersQuery: {
      pageIndex: 0,
      pageSize: 10,
    },
    nowSelectRealName: '', // 通过姓名选择器选中的人员
    MembersQueryTotalCount: 0,
    waitToAuthRegisterUsers: [],
    current_select_id: null,
    nowSelectCompany: null,
    loading: false,
  }),
  computed: {
    currentUser() {
      return this.$store.state.user.data
    },
    currentCmp() {
      return this.$store.state.user.companyid
    },
    requireLoadWaitToAUthRegisterUsers() {
      return debounce(() => {
        this.loadWaitToAuthRegisterUsers()
      }, 500)
    },
    approve_show: {
      get() {
        return this.current_select_id !== null
      },
      set(val) {
        if (!val) {
          this.current_select_id = null
        }
      },
    },
  },
  watch: {
    currentCmp: {
      handler(val) {
        this.nowSelectCompany = {
          code: val,
        }
        this.not_login_show = !val
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
  methods: {
    handleCurrentChange(val) {
      console.log('approve user change to', val)
      if (!val) return
      this.current_select_id = val
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
          accountAuthStatus: checkUserValid(item.inviteBy),
        }
        return Object.assign(item, obj)
      })
      return result
    },
    // 刷新待认证人员列表
    async loadWaitToAuthRegisterUsers() {
      this.loading = true
      getMembers({
        code: this.nowSelectCompany.code,
        page: this.MembersQuery.pageIndex,
        pageSize: this.MembersQuery.pageSize,
      })
        .then(async (data) => {
          this.MembersQueryTotalCount = data.totalCount
          this.waitToAuthRegisterUsers = this.loadUserList(data.list)
          await this.loadSingleUser()
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style>
</style>
