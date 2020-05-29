<template>
  <div>
    <div v-if="solutionName">
      <el-steps
        :active="nowStep>=0?nowStep:(streams?streams.length:0)"
        :finish-status="nowStep>=0?'success':'finish'"
        align-center
      >
        <el-step v-for="s in streams" :key="s.index">
          <template slot="title">
            <div>{{ s.name }}</div>
            <el-tooltip
              :content="`需要${s.firstMemberCompanyName}${s.requireMembersAcceptCount}人进行审批`"
            >
              <div>{{ s.firstMemberCompanyName }}({{ s.requireMembersAcceptCount }})</div>
            </el-tooltip>
          </template>
          <template v-if="!loading" slot="description">
            <span v-for="u in s.membersFitToAudit" :key="u">
              <span
                v-if="managers[s.firstMemberCompanyCode]&&!managers[s.firstMemberCompanyCode][u]&&userStatus[s.index]"
              >
                <UserFormItem :userid="u" :type="userStatus[s.index][u]" />
              </span>
            </span>
          </template>
        </el-step>
      </el-steps>
    </div>
    <div v-else>加载中</div>
  </div>
</template>

<script>
import { auditStream, getUserCompany } from '@/api/user/userinfo'
import { companiesManagers } from '@/api/company'
import UserFormItem from '@/components/User/UserFormItem'
export default {
  name: 'ApplyAuditStreamPreview',
  components: { UserFormItem },
  props: {
    userid: {
      type: String,
      default: null
    },
    auditStatus: {
      type: Array,
      default: null
    },
    nowStep: {
      type: Number,
      default: -1
    }
  },
  data: () => ({
    loading: false,
    solutionName: null,
    streams: [],
    managers: {},
    userStatus: [],
    lastUpdate: new Date()
  }),
  watch: {
    auditStatus: {
      handler(val) {
        this.streams = val
        this.solutionName = '审批流'
      }, deep: true, immediate: true
    },
    userid: {
      handler(val) {
        if (val) {
          this.solutionName = null
          auditStream(val).then(data => {
            this.solutionName = data.solutionName
            this.streams = data.steps
          })
        }
      },
      immediate: true
    },
    solutionName: {
      handler(val) {
        this.$emit('update:solutionName', val)
      },
      immediate: true
    },
    streams: {
      handler(val) {
        if (val) {
          var lastUpdate = new Date()
          this.lastUpdate = lastUpdate
          setTimeout(() => {
            if (lastUpdate !== this.lastUpdate) return
            this.streamModefy(val)
          }, 500)
        }
      }, deep: true, immediate: true
    }
  },
  methods: {
    auditStream,
    streamModefy(val) {
      this.loading = true
      this.initUserStatus(val)
      this.initCompanyManager(val)
    },
    initUserStatus(val) {
      this.userStatus = []
      for (var s of val) {
        if (!this.userStatus[s.index]) this.userStatus[s.index] = {}
        var dic = this.userStatus[s.index]
        for (var u of s.membersFitToAudit) {
          dic[u] = 'primary'
        }
        for (u of s.membersAcceptToAudit) {
          dic[u] = 'success'
        }
      }
    },
    initCompanyManagerDirect(val) {
      var waitToLoad = []
      for (var s of val) {
        waitToLoad.push(s.firstMemberCompanyCode)
      }
      waitToLoad = [...new Set(waitToLoad)]
      companiesManagers(waitToLoad).then(data => {
        for (var c of Object.keys(data.companies)) {
          if (data.companies[c].list) {
            this.managers[c] = data.companies[c].list.map(item => item.id)
          } else {
            this.managers[c] = {}
          }
        }
        this.loading = false
      })
    },
    async initCompanyManager(val) {
      var loadUserCompanyCodeActions = []
      var loadUserCompanyCodeActionsIndex = []
      for (var i = 0; i < val.length; i++) {
        var s = val[i]
        if (!s.firstMemberCompanyCode && s.membersFitToAudit.length > 0) {
          loadUserCompanyCodeActions.push(getUserCompany(s.membersFitToAudit[0], true))
          loadUserCompanyCodeActionsIndex.push(i)
        }
      }
      if (loadUserCompanyCodeActions.length > 0) {
        var datas = await Promise.all(loadUserCompanyCodeActions)
        for (i = 0; i < datas.length; i++) {
          val[loadUserCompanyCodeActionsIndex[i]].firstMemberCompanyCode = datas[i].company.code
        }
      } else {
        this.initCompanyManagerDirect(val)
      }
    }
  }
}
</script>

<style>
</style>
