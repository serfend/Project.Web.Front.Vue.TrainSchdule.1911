<template>
  <div>
    <div v-if="currentUser && currentUser.id">
      <el-card>
        <UsersSelectorByCompany
          ref="UsersSelectorByCompany"
          :current-user.sync="current_user_entity"
          :total-count.sync="MembersQueryTotalCount"
          :now-select-company.sync="nowSelectCompany"
          :members-query.sync="MembersQuery"
          :list.sync="waitToAuthRegisterUsers"
          :loading.sync="loading"
        />
        <BatchOperation
          v-if="currentFocusUsers.length"
          ref="BatchOperation"
          v-model="currentFocusUsers"
          class="right-hover-panel flashing-layout-right"
          @requireUpdate="requireUpdate"
        />
        <el-table
          v-loading="loading"
          :data="waitToAuthRegisterUsers"
          highlight-current-row
          style="width: 100%"
          @row-dblclick="handleCurrentChange"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="姓名" width="100">
            <template slot-scope="scope">
              <el-popover
                placement="right-start"
                trigger="hover"
                @show="scope.row.userHasShow = true"
              >
                <User
                  :data="scope.row"
                  :can-load-avatar="scope.row.userHasShow"
                />
                <span slot="reference">{{ scope.row.realName }}</span>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="dutiesName" label="职务" width="150" />
          <el-table-column label="全年假" width="70">
            <template
              slot-scope="scope"
            >{{ scope.row.vacation.yearlyLength }}天</template>
          </el-table-column>
          <el-table-column label="路途" width="50">
            <template
              slot-scope="scope"
            >{{ scope.row.vacation.maxTripTimes }}次</template>
          </el-table-column>
          <el-table-column prop="accountAuthStatus" label="状态" width="100">
            <template slot-scope="scope">
              <el-tag
                :type="
                  scope.row.accountAuthStatus == 1
                    ? 'success'
                    : scope.row.accountAuthStatus == 0
                      ? 'info'
                      : 'danger'
                "
              >
                {{
                  scope.row.accountAuthStatus == 1
                    ? "已认证"
                    : scope.row.accountAuthStatus == 0
                      ? "待认证"
                      : "已退回"
                }}</el-tag>
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
        <Pagination
          :pagesetting.sync="MembersQuery.page"
          :total-count="MembersQueryTotalCount"
        />
      </el-card>
    </div>

    <Login v-else />
    <el-dialog :visible.sync="approve_show">
      <el-tabs v-model="detail_pane">
        <el-tab-pane label="基本信息">
          <Register
            v-if="detail_pane == '0'"
            :user-info="current_user_entity"
            @requireUpdate="requireUpdate"
            @requireHide="approve_show = false"
          />
        </el-tab-pane>
        <el-tab-pane label="权限管理">
          <UserPermission
            v-if="detail_pane == '1'"
            :user-id="current_user_entity && current_user_entity.id"
          />
        </el-tab-pane>
        <el-tab-pane label="操作日志">
          <div v-if="detail_pane == '2'">
            <Loading />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { getUserSummary } from '@/api/user/userinfo'
export default {
  name: 'Approve',
  components: {
    VacationDescription: () =>
      import('@/components/Vacation/VacationDescription'),
    Pagination: () => import('@/components/Pagination'),
    Login: () => import('@/views/login'),
    User: () => import('@/components/User'),
    Register: () => import('../register/RegForm'),
    UserPermission: () => import('./UserPermission'),
    Loading: () => import('@/views/Loading'),
    BatchOperation: () => import('./BatchOperation'),
    UsersSelectorByCompany: () => import('@/components/Company/UsersSelectorByCompany')
  },
  data: () => ({
    isFromUrl: false,
    nowSelectCompany: null,
    MembersQuery: {
      userCompanyType: 0,
      includeChild: false,
      page: {
        pageIndex: 0,
        pageSize: 10
      }
    },
    MembersQueryTotalCount: 0,
    waitToAuthRegisterUsers: [],
    current_user_entity: null,
    loading: false,
    detail_pane: '',
    currentFocusUsers: []
  }),
  computed: {
    currentUser() {
      return this.$store.state.user.data
    },
    currentCmp() {
      return this.$store.state.user.companyid
    },
    approve_show: {
      get() {
        return this.current_user_entity !== null
      },
      set(val) {
        if (!val) {
          this.current_user_entity = null
        }
      }
    }
  },
  watch: {
    currentCmp: {
      handler(val) {
        if (this.isFromUrl) return
        this.nowSelectCompany = {
          code: val
        }
        this.not_login_show = !val
      },
      immediate: true
    }
  },
  mounted() {
    const { query } = this.$route
    const usr = query && query.userid
    if (!usr) return
    this.isFromUrl = true
    const f = async () => {
      const user_entity = await getUserSummary(usr)
      this.handleCurrentChange(user_entity)
      setTimeout(() => {
        this.requireUpdate('followCurrentUser')
      }, 5e2)
    }
    f()
  },
  methods: {
    requireUpdate(method = 'refresh') {
      const c = this.$refs.UsersSelectorByCompany
      const f = c && c[method]
      if (!f) return
      f()
    },
    handleSelectionChange(v) {
      this.currentFocusUsers = v
    },
    handleCurrentChange(val) {
      if (!val) return
      this.current_user_entity = val
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/animation.scss";
</style>
