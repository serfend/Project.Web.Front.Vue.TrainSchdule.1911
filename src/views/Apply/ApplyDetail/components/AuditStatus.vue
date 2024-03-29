<template>
  <el-card v-if="detail" v-loading="loading" shadow="hover">
    <h3 slot="header">
      <span>{{ `审批进度(${solutionRuleNames})` }}</span>
      <span>{{ detail.status == 20 ? "(已撤回)" : null }}</span>
      <ApplyCompany :data="detail.baseInfo" />
    </h3>
    <el-steps
      v-if="detail.steps && detail.steps.length > 0"
      :space="200"
      :active="nowStep"
      finish-status="success"
    >
      <el-step
        v-for="step in detail.steps"
        :key="step.id"
        :status="stepStatus(step)"
      >
        <el-popover slot="description" trigger="click">
          <el-table :data="get_audit_list(step)" stripe style="width:32rem">
            <el-table-column
              header-align="center"
              align="center"
              label="审核人"
            >
              <template
                slot-scope="{ row }"
                style="display:flex;margin-top:0.5rem"
              >
                <el-tooltip
                  v-if="row.auditingUserId"
                  :content="get_status_desc(row)"
                >
                  <UserFormItem
                    :userid="row.auditingUserId"
                    :type="get_status_type(row)"
                  />
                </el-tooltip>
                <span v-else-if="row.auditingUserRealName">{{
                  row.auditingUserRealName
                }}</span>
                <span v-else>无</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="时间">
              <template slot-scope="{ row }">
                <el-tooltip v-if="row.handleStamp" effect="light">
                  <span slot="content">{{ row.handleStamp }}</span>
                  <span>{{ formatTime(row.handleStamp) }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="留言">
              <template slot-scope="{ row }">
                <span
                  v-if="row.auditingUserId || row.auditingUserRealName"
                  style="margin-left:1rem"
                >
                  <el-popover
                    v-if="row.remark && row.remark.length > 5"
                    trigger="hover"
                  >
                    <p style="margin-left:1rem">{{ row.remark }}</p>
                    <el-button slot="reference" type="text">查看留言</el-button>
                  </el-popover>
                  <span v-else style="font-size:0.7rem">{{ row.remark }}</span>
                </span>
                <span v-else style="color:#ccc;font-size:0.7rem">{{
                  row.remark
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              label="操作"
              width="60rem"
            >
              <template slot-scope="{ row }">
                <el-tooltip content="通过站内信和豆豆通知其尽快审批此申请">
                  <el-button
                    :disabled="row.status_urged"
                    type="text"
                    @click="send_notice_urged(row)"
                  >催促</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <div slot="reference" class="audit-process-card">
            <div class="audit-process-name">
              <i class="el-icon-collection-tag audit-title" />
              <span>{{ step.name }}</span>
            </div>
            <div class="audit-process-companyName">
              <i class="el-icon-office-building black--text audit-title mr-1" />
              <el-badge is-dot :hidden="!hasRemark(step)">
                <span>{{ step.firstMemberCompanyName }}</span>
                <i
                  v-if="isAuditing(step)"
                  class="el-icon-loading audit-title red--text"
                />
              </el-badge>
            </div>
            <div class="row layout justify-space-between black--text">
              <span
                class="audit-process-person"
              >{{ step.membersAcceptToAudit.length }}/{{
                getNeedAudit(step.requireMembersAcceptCount)
              }}</span>
              <span class="audit-process-handleStamp">
                <el-tooltip v-if="step.timeStamp" effect="light">
                  <span slot="content">{{ step.timeStamp }}</span>
                  <span>{{ formatTime(step.timeStamp) }}</span>
                </el-tooltip>
                <span v-else>无</span>
              </span>
            </div>
          </div>
        </el-popover>
      </el-step>
    </el-steps>
    <div v-else-if="detail.response">
      <el-steps :space="200" :active="getStatus()" finish-status="success">
        <el-step v-for="(v, i) in detail.response" :key="i">
          <div slot="description">
            <div>时间 {{ formatTime(v.handleStamp) }}</div>
            <div>
              状态
              {{
                v.status == 0
                  ? "待接收"
                  : v.status === 1
                    ? "待审核"
                    : v.status == 4
                      ? "通过"
                      : "驳回"
              }}
            </div>
            <div>备注 {{ v.remark }}</div>
          </div>
          <div slot="title">{{ v.auditingUserRealName || "未知" }}</div>
        </el-step>
      </el-steps>
    </div>
    <div v-else-if="!detail.steps">加载中</div>
    <div v-else>加载失败</div>
  </el-card>
</template>

<script>
import { formatTime, parseTime } from '@/utils'
export default {
  name: 'AuditStatus',
  components: {
    UserFormItem: () => import('@/components/User/UserFormItem'),
    ApplyCompany: () => import('../../CommonComponents/ApplyCompany')
  },
  props: {
    data: {
      type: Object,
      default() {
        return null
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({ detail: {}}),
  computed: {
    solutionRuleNames() {
      const not_found = '未知审批流程'
      const detail = this.detail
      if (!detail) return not_found
      const { auditSolutionRule: a, auditSolution: b } = detail
      if (!a && !b) return not_found
      return `规则:${a} -> 应用审批流:${b}`
    },
    statusDic() {
      return this.$store.state.vacation.statusDic
    },
    status() {
      return this.statusDic[this.detail.status]
    },
    responses() {
      const result = {}
      const { detail } = this
      if (!detail) return result
      const { response } = detail
      response.map(x => {
        if (!result[x.index]) result[x.index] = []
        result[x.index].push(x)
      })
      return result
    },
    isAbord() {
      const { detail } = this
      if (detail.status === 75) return true // 驳回
      return false
    },
    nowStep() {
      const { detail } = this
      const { nowStep, status, steps } = detail
      if (status === 100 || status === 120) return steps.length // 通过或作废的标识已审批完成
      if (!nowStep) return null
      return nowStep.index
    }
  },
  watch: {
    data: {
      handler(val) {
        if (val && val.steps) {
          this.detail = val
          this.refresh()
        }
      },
      immediate: true
    }
  },
  methods: {
    formatTime,
    parseTime,
    hasRemark(step) {
      const { responses } = this
      const usr_resp = responses[step.index]
      return usr_resp && usr_resp.find(x => x.remark)
    },
    stepStatus(step) {
      const { isAbord, nowStep } = this
      if (nowStep !== step.index) return null
      return isAbord ? 'error' : null
    },
    isAuditing(step) {
      const { nowStep, isAbord } = this
      if (isAbord) return false // 驳回
      return step.index === nowStep
    },
    getStatus() {
      // 兼容上古的申请
      const res = this.detail.response
      if (!res || res.length === 0) return null
      const r = res.findIndex(
        i => i.status === 0 || i.status === 1 || i.status === 8
      )
      return r < 0 ? res.length : r
    },
    send_notice_urged(row) {
      row.status_urged = true
      this.$message.error('开发中')
      setTimeout(() => {
        row.status_urged = false
      }, 3000)
    },
    get_status_desc(row) {
      return row.status === 4 ? '通过' : row.status === 8 ? '驳回' : '未处理'
    },
    get_status_type(row) {
      return row.status === 4
        ? 'success'
        : row.status === 8
          ? 'danger'
          : 'info'
    },
    get_audit_list(step) {
      let list = this.detail.response
      const user_dict = {}
      list = list.filter(i => {
        const cur = i.index === step.index
        if (cur) user_dict[i.auditingUserId] = 1
        return cur
      })
      const unhandle_list = step.membersFitToAudit
        .filter(i => !user_dict[i])
        .map(i => ({ auditingUserId: i }))
      list = list.concat(unhandle_list)
      return list.map(i => {
        i.status_urged = this.get_status_desc(i) !== '未处理'
        return i
      })
    },
    getNeedAudit(requireAuditMemberCount) {
      if (requireAuditMemberCount < 0) return '无需'
      if (requireAuditMemberCount === 0) return '所有人'
      return `${requireAuditMemberCount}人`
    },
    GetHandleTimeAgo(step) {
      const arr = this.detail.response.filter(r => r.index === step.index)
      if (arr.length > 0) {
        const item = arr.reduce((prev, cur) =>
          prev.handleStamp > cur.handleStamp ? prev : cur
        )
        return item.handleStamp
      }
      return null
    },
    refresh() {
      const { detail, statusDic } = this
      if (!detail || !statusDic || statusDic.length === 0) {
        return
      }
      for (let i = 0; i < detail.steps.length; i++) {
        const step = detail.steps[i]
        step.timeStamp = this.GetHandleTimeAgo(step)
      }
    }
  }
}
</script>

<style scoped>
.audit-process-card {
  margin: 10px;
  border-width: 1px;
  border-color: #3f3f3f;
  cursor: pointer;
}
.audit-title {
  font-size: 1rem;
}
.audit-process-name {
  color: #cccccc;
}
</style>
