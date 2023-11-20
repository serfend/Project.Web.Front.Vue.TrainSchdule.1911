<template>
  <div v-loading="loading">
    <div v-if="solutionName && !validateInfoInner && userStatus && managers">
      <el-steps
        :active="nowStep || (innerAuditStatus && innerAuditStatus.length) || 0"
        :finish-status="nowStep >= 0 ? 'success' : 'finish'"
        align-center
      >
        <el-step v-for="s in innerAuditStatus" :key="s.index">
          <template #title>
            <div style="white-space:nowrap">{{ s.name }}</div>
            <el-tooltip placement="right" effect="light">
              <template #content>
                <h3>{{ title }}</h3>
                <div style="font-size:18px;color:#ccc">{{ s.name }}</div>
                <div style="font-size:14px">
                  {{
                    `需要[${s.firstMemberCompanyName}]${getNeedAudit(
                      s.requireMembersAcceptCount
                    )}进行审批`
                  }}
                </div>
              </template>
              <div style="white-space:nowrap">
                {{ s.firstMemberCompanyName }}({{
                  getNeedAudit(s.requireMembersAcceptCount)
                }})
              </div>
            </el-tooltip>
          </template>
          <template slot="description">
            <div>
              <div v-for="u in s.membersFitToAudit" :key="`fit_${u}`">
                <span v-if="user_should_show(u, s)">
                  <UserFormItem
                    :userid="u"
                    :type="userStatus[s.index][u]"
                    style="margin-top:0.5rem"
                  />
                </span>
              </div>
              <div v-for="u in s.additionalAccept" :key="`add_${u}`">
                <UserFormItem
                  :userid="u"
                  :type="userStatus[s.index][u]"
                  style="margin-top:0.5rem"
                />
              </div>
            </div>
          </template>
        </el-step>
      </el-steps>
    </div>
    <div v-else>加载中</div>
  </div>
</template>

<script>
import { getUserCompany } from '@/api/user/userinfo'
import { auditStream } from '@/api/audit/handle'
import { companiesManagers } from '@/api/company'
export default {
  name: 'ApplyAuditStreamPreviewInner',
  components: {
    UserFormItem: () => import('@/components/User/UserFormItem')
  },
  props: {
    userid: { type: String, default: null },
    auditStatus: { type: Array, default: null },
    nowStep: { type: Number, default: -1 },
    entityType: { type: String, default: 'vacation' },
    entityTypeDesc: { type: String, default: null },
    title: { type: String, default: null },
    validateInfo: { type: String, default: null }
  },
  data: () => ({
    loading: false,
    solutionName: null,
    p_auditStatus: null,
    managers: null,
    userStatus: null
  }),
  computed: {
    validateInfoInner: {
      get() {
        return this.validateInfo
      },
      set(v) {
        this.$emit('update:validateInfo', v)
      }
    },
    innerAuditStatus: {
      get() {
        return this.p_auditStatus
      },
      set(v) {
        debugger
        this.p_auditStatus = v
        this.$emit('update:auditStatus', v)
      }
    }
  },
  watch: {
    auditStatus: {
      handler(val) {
        console.log('auditStatus', val)
        this.p_auditStatus = val
        this.solutionName = '审批流'
        if (!val) return
        this.p_auditStatus = val.map(x => Object.assign({}, x))
        this.$nextTick(() => {
          this.streamModify()
        })
      },
      deep: true,
      immediate: true
    },
    userid: {
      handler(val) {
        if (!val) return
        this.refresh()
      },
      immediate: true
    },
    entityTypeDesc: {
      handler(val) {
        this.refresh()
      }
    },
    solutionName: {
      handler(val) {
        this.$emit('update:solutionName', val)
      },
      immediate: true
    }
  },
  methods: {
    refresh() {
      console.log('refresh')
      this.loading = true
      this.solutionName = null
      auditStream(this.userid, this.entityTypeDesc || this.entityType)
        .then(data => {
          debugger
          this.solutionName = data.solutionName
          this.innerAuditStatus = data.steps
          this.validateInfoInner = null
        })
        .catch(e => {
          this.validateInfoInner = (e && e.message) || '未知原因'
        })
        .finally(() => {
          this.loading = false
        })
    },
    user_should_show(u, s) {
      const { managers, userStatus } = this
      const company_managers = managers[s.firstMemberCompanyCode]
      const is_manager = company_managers && company_managers.indexOf(u) > -1
      if (!is_manager) return true // 非管理员则直接显示
      const status = userStatus[s.index][u]
      const is_handled = status === 'success' || status === 'danger'
      return is_handled // 管理员则如果处理了则显示
    },
    getNeedAudit(requireAuditMemberCount) {
      if (requireAuditMemberCount < 0) return '无需'
      if (requireAuditMemberCount === 0) return '所有人'
      return `${requireAuditMemberCount}人`
    },
    streamModify() {
      console.log('streamModify')
      this.loading = true
      this.initUserStatus()
      this.initCompanyManager()
    },
    initUserStatus() {
      console.log('initUserStatus')
      this.userStatus = {}
      const steps = this.p_auditStatus
      steps.map((x, i) => {
        const index = x.index
        if (!this.userStatus[index]) this.userStatus[index] = {}
        const dic = this.userStatus[index]
        x.membersFitToAudit.map(u => {
          dic[u] = 'primary'
        })
        x.membersAcceptToAudit.map(u => {
          dic[u] = 'success'
        })
        const fit_dict = Object.keys(x.membersFitToAudit)
        x.membersAcceptToAudit = x.membersAcceptToAudit.filter(
          x => fit_dict[x]
        )

        const additionalAccept = x.membersAcceptToAudit.filter(
          x => !fit_dict[x]
        )
        x.additionalAccept = additionalAccept
      })
    },
    initCompanyManagerDirect() {
      console.log('initCompanyManagerDirect')
      const waitToLoad = {}
      const steps = this.p_auditStatus
      steps.map(x => {
        const mCode = x.firstMemberCompanyCode
        if (!waitToLoad[mCode]) waitToLoad[mCode] = true
      })
      this.loading = true
      const managers = {}
      companiesManagers(Object.keys(waitToLoad))
        .then(data => {
          Object.keys(data.companies).map(c => {
            const c_mgrs = data.companies[c].list
            managers[c] = c_mgrs && c_mgrs.map(item => item.id)
          })
          this.managers = managers
        })
        .finally(() => {
          this.loading = false
        })
    },
    async initCompanyManager() {
      console.log('initCompanyManager')
      const loadUserCompanyCodeActions = []
      const loadUserCompanyCodeActionsIndex = []
      const steps = this.p_auditStatus
      steps.map((x, i) => {
        if (x.firstMemberCompanyCode) return
        if (!x.membersFitToAudit.length) return
        const user_company = getUserCompany(x.membersFitToAudit[0], true)
        loadUserCompanyCodeActions.push(user_company)
        loadUserCompanyCodeActionsIndex.push(i)
      })
      if (!loadUserCompanyCodeActions.length) {
        return this.initCompanyManagerDirect()
      }
      const datas = await Promise.all(loadUserCompanyCodeActions)
      datas.map((x, i) => {
        const index = loadUserCompanyCodeActionsIndex[i]
        steps[index].firstMemberCompanyCode = datas[i].company.code
      })
    }
  }
}
</script>

<style></style>
