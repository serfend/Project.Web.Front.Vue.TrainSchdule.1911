<template>
  <div>
    <el-button
      v-if="hide_pannel"
      type="text"
      style="position:absolute;"
      @click="() => (hide_pannel = false)"
    >展开查询</el-button>
    <el-form v-else inline>
      <el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          @click="requireLoadWaitToAuthRegisterUsers"
        >刷新</el-button>
        <el-button
          type="info"
          @click="() => (hide_pannel = true)"
        >隐藏</el-button>
        <CompanyTypeSelector v-model="MembersQuery.userCompanyType" />
      </el-form-item>
      <el-form-item label="选择成员">
        <UserSelector default-info="未选择" @change="handleCurrentUserChange" />
      </el-form-item>
      <el-form-item label="统计年份">
        <el-date-picker
          v-model="vacationYear"
          type="year"
          style="width: 7rem"
        />
      </el-form-item>
      <el-form-item label="包含下级单位">
        <el-switch v-model="MembersQuery.includeChild" />
      </el-form-item>
      <el-form-item label="选择单位">
        <CompanySelector
          v-model="iNowSelectCompany"
          placeholder="选择需要检查的单位"
          style="width: 20rem"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getMembers } from '@/api/company'
import { getUsersVacationLimits } from '@/api/user/userinfo'
import { checkUserValid } from '@/utils/validate'
import { debounce } from '@/utils'
export default {
  name: 'UsersSelectorByCompany',
  components: {
    UserSelector: () => import('@/components/User/UserSelector'),
    CompanySelector: () => import('@/components/Company/CompanySelector'),
    CompanyTypeSelector: () =>
      import('@/components/Company/CompanyTypeSelector')
  },
  props: {
    membersQuery: {
      type: Object,
      default: () => ({
        userCompanyType: 0,
        includeChild: false,
        page: {
          pageIndex: 0,
          pageSize: 10
        }
      })
    },
    nowSelectCompany: { type: Object, default: null },
    currentUser: { type: Object, default: null },
    totalCount: { type: Number, default: 0 },
    list: { type: Array, default: null }
  },
  data: () => ({
    hide_pannel: false,
    inner_loading: false,
    innerNowSelectCompany: null,
    innerMembersQuery: {
      userCompanyType: 0,
      includeChild: false,
      page: {
        pageIndex: 0,
        pageSize: 10
      }
    },
    waitToAuthRegisterUsers: [],
    vacationYear: new Date() // 统计的年份
  }),
  computed: {
    loading: {
      get() {
        return this.inner_loading
      },
      set(v) {
        this.inner_loading = v
        this.$emit('update:loading', v)
      }
    },
    MembersQuery: {
      get() {
        return this.innerMembersQuery
      },
      set(v) {
        this.innerMembersQuery = v
        this.$emit('update:membersQuery')
      }
    },
    iNowSelectCompany: {
      get() {
        return this.innerNowSelectCompany || {}
      },
      set(v) {
        this.innerNowSelectCompany = v
        this.$emit('update:nowSelectCompany', v)
      }
    },
    requireLoadWaitToAuthRegisterUsers() {
      return debounce(() => {
        this.refresh()
      }, 5e2)
    }
  },
  watch: {
    vacationYear: {
      handler(v) {
        this.requireLoadWaitToAuthRegisterUsers()
      }
    },
    includeChild: {
      handler(v) {
        this.requireLoadWaitToAuthRegisterUsers()
      }
    },
    innerNowSelectCompany: {
      handler(val) {
        if (!val) return
        this.requireLoadWaitToAuthRegisterUsers()
      }
    },
    nowSelectCompany: {
      handler(val) {
        if (!val) return
        this.MembersQuery.page.pageIndex = 0
        this.innerNowSelectCompany = val
      },
      immediate: true
    },
    membersQuery: {
      handler(v) {
        this.innerMembersQuery = v
      },
      deep: true,
      immediate: true
    },
    innerMembersQuery: {
      handler(val) {
        if (!val) return
        this.requireLoadWaitToAuthRegisterUsers()
      },
      deep: true
    },
    currentUser: {
      handler(v) {
        // 此处不应该跟踪到单位，而是等到用户主动操作
        // this.handleCurrentUserChange(v, false)
      },
      immediate: true
    }
  },
  mounted() {
    this.requireLoadWaitToAuthRegisterUsers()
  },
  methods: {
    handleCurrentUserChange(v, raise_event = true) {
      if (!v) return
      if (raise_event) this.$emit('update:currentUser', v)
      this.followCurrentUser()
    },
    followCurrentUser() {
      setTimeout(() => {
        const v = this.currentUser
        if (!v) return
        this.iNowSelectCompany = {
          code: v.companyCode
        }
      }, 5e2)
    },
    loadUserList(list) {
      const result = list.map(item => {
        const obj = {
          userHasShow: false,
          avatar: '',
          vacation: {},
          accountAuthStatus: checkUserValid(item.inviteBy)
        }
        return Object.assign(item, obj)
      })
      return result
    },
    refresh() {
      return new Promise((res, rej) => {
        this.loading = true
        this.direct_refresh().finally(() => {
          this.loading = false
        })
      })
    },
    // 刷新待认证人员列表
    async direct_refresh() {
      const code = this.iNowSelectCompany.code
      const { MembersQuery, vacationYear } = this
      const { page } = MembersQuery

      let q = Object.assign({ code }, this.MembersQuery)
      q = Object.assign(q, page)
      const members = await getMembers(q)
      this.$emit('update:totalCount', members.totalCount)
      const list = this.loadUserList(members.list)

      const vacations = await getUsersVacationLimits({
        userids: list.map(x => x.id),
        vacationYear: vacationYear.getFullYear()
      })
      list.map(x => {
        const vac = vacations[x.id]
        if (!vac) return
        x.vacation = vac
      })
      this.$emit('update:list', list)
    }
  }
}
</script>
