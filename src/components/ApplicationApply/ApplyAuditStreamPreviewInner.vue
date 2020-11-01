<template>
  <div v-loading="!solutionName">
    <div v-if="solutionName">
      <el-steps
        :active="nowStep>=0?nowStep:(streams?streams.length:0)"
        :finish-status="nowStep>=0?'success':'finish'"
        align-center
      >
        <el-step v-for="s in streams" :key="s.index">
          <template slot="title">
            <div style="white-space:nowrap">{{ s.name }}</div>
            <el-tooltip
              :content="`需要${s.firstMemberCompanyName}${getNeedAudit(s.requireMembersAcceptCount)}进行审批`"
            >
              <div
                style="white-space:nowrap"
              >{{ s.firstMemberCompanyName }}({{ getNeedAudit(s.requireMembersAcceptCount) }})</div>
            </el-tooltip>
          </template>
          <template v-if="!loading" slot="description">
            <div v-for="u in s.membersFitToAudit" :key="u">
              <span
                v-if="managers[s.firstMemberCompanyCode]&&managers[s.firstMemberCompanyCode].indexOf(u)===-1&&userStatus[s.index]"
              >
                <UserFormItem :userid="u" :type="userStatus[s.index][u]" style="margin-top:0.5rem" />
              </span>
            </div>
          </template>
        </el-step>
      </el-steps>
    </div>
  </div>
</template>

<script>
import { auditStream, getUserCompany } from '@/api/user/userinfo'
import { companiesManagers } from '@/api/company'
import UserFormItem from '@/components/User/UserFormItem'
import { debounce } from '@/utils'
export default {
  name: 'ApplyAuditStreamPreview',
  components: { UserFormItem },
  props: {
    userid: {
      type: String,
      default: null,
    },
    auditStatus: {
      type: Array,
      default: null,
    },
    nowStep: {
      type: Number,
      default: -1,
    },
  },
  data: () => ({
    loading: false,
    solutionName: null,
    streams: [],
    managers: {},
    userStatus: [],
  }),
  computed: {
    updatedStream() {
      return debounce(() => {
        this.streamModify()
      }, 500)
    },
  },
  watch: {
    auditStatus: {
      handler(val) {
        this.streams = val
        this.solutionName = '审批流'
      },
      deep: true,
      immediate: true,
    },
    userid: {
      handler(val) {
        if (val) {
          this.solutionName = null
          auditStream(val).then((data) => {
            this.solutionName = data.solutionName
            this.streams = data.steps
          })
        }
      },
      immediate: true,
    },
    solutionName: {
      handler(val) {
        this.$emit('update:solutionName', val)
      },
      immediate: true,
    },
    streams: {
      handler(val) {
        if (val) this.updatedStream()
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    auditStream,
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
      this.userStatus = []
      const streams = this.streams
      for (let i = 0; i < streams.length; i++) {
        const index = streams[i].index
        if (!this.userStatus[index]) this.userStatus[index] = {}
        const dic = this.userStatus[index]
        for (var u of streams[i].membersFitToAudit) {
          dic[u] = 'primary'
        }
        for (u of streams[i].membersAcceptToAudit) {
          dic[u] = 'success'
        }
      }
    },
    initCompanyManagerDirect() {
      const waitToLoad = []
      const streams = this.streams
      for (let i = 0; i < streams.length; i++) {
        const mCode = streams[i].firstMemberCompanyCode
        if (waitToLoad.indexOf(mCode) === -1) waitToLoad.push(mCode)
      }
      companiesManagers(waitToLoad).then((data) => {
        for (var c of Object.keys(data.companies)) {
          if (data.companies[c].list) {
            this.managers[c] = data.companies[c].list.map((item) => item.id)
          } else {
            this.managers[c] = {}
          }
        }
        this.loading = false
      })
    },
    async initCompanyManager() {
      const streams = this.streams
      const loadUserCompanyCodeActions = []
      const loadUserCompanyCodeActionsIndex = []
      for (let i = 0; i < streams.length; i++) {
        const s = streams[i]
        if (!s.firstMemberCompanyCode && s.membersFitToAudit.length > 0) {
          loadUserCompanyCodeActions.push(
            getUserCompany(s.membersFitToAudit[0], true)
          )
          loadUserCompanyCodeActionsIndex.push(i)
        }
      }
      if (loadUserCompanyCodeActions.length > 0) {
        const datas = await Promise.all(loadUserCompanyCodeActions)
        for (let i = 0; i < datas.length; i++) {
          streams[loadUserCompanyCodeActionsIndex[i]].firstMemberCompanyCode =
            datas[i].company.code
        }
      } else {
        this.initCompanyManagerDirect()
      }
    },
  },
}
</script>

<style>
</style>
