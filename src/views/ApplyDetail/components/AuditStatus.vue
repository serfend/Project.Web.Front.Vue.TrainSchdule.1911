<template>
  <el-card v-if="detail" v-loading="loading" shadow="hover">
    <h3 slot="header">{{ `审批进度(${detail.auditSolution||'审批流程'})` }}</h3>
    <el-steps
      v-if="detail.steps&&detail.steps.length>0"
      :space="200"
      :active="nowActiveAudit"
      finish-status="success"
    >
      <el-step v-for="step in detail.steps" :key="step.id">
        <el-popover slot="description" trigger="click">
          <div style="width:12rem">
            <div>
              <span style="margin-left:2rem">审核人</span>
              <span style="display:flex;float:right;margin-right:2rem">留言</span>
            </div>
            <div
              v-for="(rec,index) in detail.response.filter(i=>i.index===step.index)"
              :key="index"
              style="display:flex;margin-top:0.5rem"
            >
              <el-tooltip
                v-if="rec.auditingUserId"
                :content="rec.status===4?'通过':rec.status===8?'驳回':'未处理'"
              >
                <UserFormItem
                  :userid="rec.auditingUserId"
                  :type="rec.status===4?'success':rec.status===8?'danger':'info'"
                />
              </el-tooltip>
              <span v-else-if="rec.auditingUserRealName">{{ rec.auditingUserRealName }}</span>
              <span v-else style="color:#ccc">{{ rec.remark }}</span>
              <span v-if="rec.auditingUserId||rec.auditingUserRealName" style="margin-left:1rem">
                <el-popover v-if="rec.remark&&rec.remark.length>5" trigger="hover">
                  <b>留言：</b>
                  <p style="margin-left:1rem">{{ rec.remark }}</p>
                  <el-button slot="reference" type="text">查看留言</el-button>
                </el-popover>
                <span v-else style="font-size:0.7rem">{{ rec.remark }}</span>
              </span>
            </div>
          </div>
          <div slot="reference" class="audit-process-card">
            <div v-if="detail.nowStep" class="audit-process-status">
              <span v-if="step.index > detail.nowStep.index">
                <i class="el-icon-more-outline title grey-text" />
                <span>未收到审批</span>
              </span>
              <span v-if="step.index === detail.nowStep.index&&detail.status!==75">
                <i class="el-icon-loading title red--text" />
                <span>审批中</span>
              </span>
              <span v-if="step.index < detail.nowStep.index">
                <i class="el-icon-success title green--text" />
                <span>通过审核</span>
              </span>
              <span v-if="step.index === detail.nowStep.index&&detail.status===75">
                <i class="el-icon-circle-close title red--text" />
                <span>驳回</span>
              </span>
            </div>
            <div v-else-if="detail.status<30">未收到审批</div>
            <div v-else>审批已结束</div>

            <div class="audit-process-companyName grey--text row layout justify-start align-center">
              <i class="el-icon-office-building black--text title mr-1" />
              <el-badge
                is-dot
                :hidden="detail.response.filter(i=>i.index===step.index && i.remark).length==0"
              >
                <span>{{ step.firstMemberCompanyName }}</span>
              </el-badge>
            </div>
            <div class="row layout justify-space-between black--text">
              <span
                class="audit-process-person"
              >{{ step.membersAcceptToAudit.length }}/{{ getNeedAudit(step.requireMembersAcceptCount) }}</span>
              <span class="audit-process-handleStamp">
                <el-tooltip v-if="step.timeStamp" effect="light">
                  <span slot="content">{{ step.timeStamp }}</span>
                  <span>{{ format(step.timeStamp) }}</span>
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
        <el-step v-for="(v,i) in detail.response" :key="i">
          <div slot="description">
            <div>时间 {{ format(v.handleStamp) }}</div>
            <div>状态 {{ v.status==0?'待接收':v.status===1?'待审核':v.status==4?'通过':'驳回' }}</div>
            <div>备注 {{ v.remark }}</div>
          </div>
          <div slot="title">{{ v.auditingUserRealName||'未知' }}</div>
        </el-step>
      </el-steps>
    </div>
    <div v-else-if="!detail.steps">加载中</div>
    <div v-else>加载失败</div>
  </el-card>
</template>

<script>
import { formatTime } from '@/utils'
import UserFormItem from '@/components/User/UserFormItem'
export default {
  name: 'AuditStatus',
  components: { UserFormItem },
  props: {
    data: {
      type: Object,
      default() {
        return null
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      nowActiveAudit: 0,
      detail: {},
    }
  },
  computed: {
    statusDic() {
      return this.$store.state.vacation.statusDic
    },
    status() {
      return this.statusDic[this.detail.status]
    },
  },
  watch: {
    data: {
      handler(val) {
        if (val && val.steps) {
          this.detail = val
          this.refresh()
        }
      },
      immediate: true,
    },
  },
  methods: {
    format(date) {
      return formatTime(date)
    },
    getStatus() {
      const res = this.detail.response
      if (!res || res.length === 0) return null
      const r = res.findIndex(
        (i) => i.status === 0 || i.status === 1 || i.status === 8
      )
      return r < 0 ? res.length : r
    },
    getNeedAudit(requireAuditMemberCount) {
      if (requireAuditMemberCount < 0) return '无需'
      if (requireAuditMemberCount === 0) return '所有人'
      return `${requireAuditMemberCount}人`
    },
    GetHandleTimeAgo(step) {
      const arr = this.detail.response.filter((r) => r.index === step.index)
      if (arr.length > 0) {
        const item = arr.reduce((prev, cur) =>
          prev.handleStamp > cur.handleStamp ? prev : cur
        )
        return item.handleStamp
      }
      return null
    },
    refresh() {
      if (!this.detail || !this.statusDic || this.statusDic.length === 0) return
      for (let i = 0; i < this.detail.steps.length; i++) {
        const step = this.detail.steps[i]
        step.timeStamp = this.GetHandleTimeAgo(step)
      }
      const s = this.status || {}
      const desc = s.desc
      if (desc === '已通过' && !this.detail.nowStep) {
        this.nowActiveAudit = this.detail.response.length
        return
      }
      for (let i = 0; i < this.detail.response.length; i++) {
        const item = this.detail.response[i]
        if (item.status === 4) {
          this.nowActiveAudit = i
          break
        }
      }
    },
  },
}
</script>

<style scoped>
.audit-process-card {
  margin: 10px;
  border-width: 1px;
  border-color: #3f3f3f;
  cursor: pointer;
}
</style>
