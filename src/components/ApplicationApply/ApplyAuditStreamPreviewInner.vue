<template>
  <div v-loading="loading">
    <div v-if="solutionName && !validateInfoInner">
      <el-steps
        :active="nowStep >= 0 ? nowStep : streams ? streams.length : 0"
        :finish-status="nowStep >= 0 ? 'success' : 'finish'"
        align-center
      >
        <el-step v-for="s in streams" :key="s.index">
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
            <div v-if="userStatus && managers">
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
  </div>
</template>

<script>
import { getUserCompany } from '@/api/user/userinfo'
import { auditStream } from '@/api/audit/handle'
import { companiesManagers } from '@/api/company'
import UserFormItem from '@/components/User/UserFormItem'
export default {
  name: 'ApplyAuditStreamPreviewInner',
  components: { UserFormItem },
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
    streams: [],
    managers: {},
    userStatus: {}
  }),
  computed: {
    validateInfoInner: {
      get() {
        return this.validateInfo
      },
      set(v) {
        this.$emit('update:validateInfo', v)
      }
    }
  },
  watch: {
    auditStatus: {
      handler(val) {
        this.streams = val
        this.solutionName = '审批流'
      },
      deep: true,
      immediate: true
    },
    userid: {
      handler(val) {
        if (val) {
          this.refresh()
        }
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
    },
    streams: {
      handler(val) {
        if (val) this.streamModify()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    refresh() {
      this.loading = true
      this.solutionName = null
      auditStream(this.userid, this.entityTypeDesc || this.entityType)
        .then(data => {
          this.solutionName = data.solutionName
          this.$set(this, 'streams', data.steps)
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
      const is_manager = managers[s.firstMemberCompanyCode].indexOf(u) > -1
      const status = userStatus[s.index][u]
      const is_handled = status === 'success' || status === 'danger'
      return !is_manager || is_handled
    },
    getNeedAudit(requireAuditMemberCount) {
      if (requireAuditMemberCount < 0) return '无需'
      if (requireAuditMemberCount === 0) return '所有人'
      return `${requireAuditMemberCount}人`
    },
    streamModify() {
      this.loading = true
      this.initUserStatus()
      this.initCompanyManager()
    },
    initUserStatus() {
      this.userStatus = {}
      this.streams.map((x, i) => {
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
        this.$set(
          x,
          'membersAcceptToAudit',
          x.membersAcceptToAudit.filter(x => fit_dict[x])
        )

        const additionalAccept = x.membersAcceptToAudit.filter(
          x => !fit_dict[x]
        )
        this.$set(x, 'additionalAccept', additionalAccept)
      })
    },
    initCompanyManagerDirect() {
      const waitToLoad = {}
      this.streams.map(x => {
        const mCode = x.firstMemberCompanyCode
        if (!waitToLoad[mCode]) waitToLoad[mCode] = true
      })
      this.loading = true
      companiesManagers(Object.keys(waitToLoad))
        .then(data => {
          Object.keys(data.companies).map(c => {
            if (!data.companies[c].list) {
              this.managers[c] = {}
              return
            }
            this.managers[c] = data.companies[c].list.map(item => item.id)
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    async initCompanyManager() {
      const loadUserCompanyCodeActions = []
      const loadUserCompanyCodeActionsIndex = []
      this.streams.map((x, i) => {
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
        this.streams[index].firstMemberCompanyCode = datas[i].company.code
      })
    }
  }
}
</script>

<style></style>
