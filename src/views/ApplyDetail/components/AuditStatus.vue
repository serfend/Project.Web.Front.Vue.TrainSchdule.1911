<template>
  <el-card v-if="detail" v-loading="loading" shadow="hover">
    <h3 slot="header">{{ `审批进度(${detail.auditSolution})` }}</h3>
    <el-steps v-if="detail.steps" :space="200" :active="nowActiveAudit" finish-status="success">
      <el-step v-for="step in detail.steps" :key="step.id">
        <el-tooltip slot="description" effect="light">
          <template slot="content">
            <div
              v-for="(rec,index) in detail.response.filter(i=>i.index===step.index)"
              :key="index"
              style="margin-top:0.5rem"
            >
              <UserFormItem v-if="rec.auditingUserId" :userid="rec.auditingUserId" />
              <span v-else>{{ rec.auditingUserRealName }}</span>
              <el-tag
                :type="rec.status===4?'success':rec.status===8?'danger':'info'"
                style="float:right"
              >{{ rec.status===4?'通过':rec.status===8?'驳回':'未处理' }}</el-tag>
              <el-tooltip v-if="rec.remark" effect="light" style="margin-left:0.5rem">
                <div slot="content" class="audit-process-remark">
                  <el-input v-model="rec.remark" placeholder="审批备注" readonly type="textarea" />
                </div>
                <el-link type="success">留言</el-link>
              </el-tooltip>
            </div>
          </template>
          <div class="audit-process-card">
            <div v-if="detail.nowStep" class="audit-process-status">
              <span v-if="step.index > detail.nowStep.index">
                <i class="el-icon-more-outline title grey-text" />
                <span>未收到审批</span>
              </span>
              <span
                v-if="step.index === detail.nowStep.index&&statusDic[detail.status].desc!=='已驳回'"
              >
                <i class="el-icon-loading title red--text" />
                <span>审批中</span>
              </span>
              <span v-if="step.index < detail.nowStep.index">
                <i class="el-icon-success title green--text" />
                <span>通过审核</span>
              </span>
              <span
                v-if="step.index === detail.nowStep.index&&statusDic[detail.status].desc==='已驳回'"
              >
                <i class="el-icon-circle-close title red--text" />
                <span>驳回</span>
              </span>
            </div>
            <div v-else-if="detail.status<30">未收到审批</div>
            <div v-else>审批已结束</div>
            <div class="audit-process-companyName grey--text row layout justify-start align-center">
              <i class="el-icon-office-building black--text title mr-1" />
              <span>{{ step.firstMemberCompanyName }}</span>
              <el-link
                v-if="detail.response.filter(i=>i.index===step.index && i.remark).length>0"
                type="success"
              >有留言</el-link>
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
        </el-tooltip>
      </el-step>
    </el-steps>
    <div v-else>加载中</div>
  </el-card>
</template>

<script>
import { format } from 'timeago.js'
import UserFormItem from '@/components/User/UserFormItem'
export default {
  name: 'AuditStatus',
  components: { UserFormItem },
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
  data() {
    return {
      nowActiveAudit: 0,
      detail: {}
    }
  },
  computed: {
    statusDic() {
      return this.$store.state.vacation.statusDic
    },
    status() {
      return this.statusDic[this.detail.status]
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
    format(date) {
      return format(date, 'zh_CN')
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
      if (!this.detail || !this.statusDic || this.statusDic.length === 0) return
      for (let i = 0; i < this.detail.steps.length; i++) {
        const step = this.detail.steps[i]
        step.timeStamp = this.GetHandleTimeAgo(step)
      }
      const desc = this.status.desc
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
    }
  }
}
</script>

<style scoped>
.audit-process-card {
  margin: 10px;
  border-width: 1px;
  border-color: #3f3f3f;
}
</style>
