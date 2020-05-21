<template>
  <el-card v-if="detail" v-loading="loading" shadow="hover">
    <h3 slot="header">当前审批</h3>
    <el-steps v-if="detail.steps" :space="200" :active="nowActiveAudit" finish-status="success">
      <el-step v-for="step in detail.steps" :key="step.id">
        <div slot="description" class="audit-process-card">
          <el-tooltip effect="light">
            <div slot="content">
              <el-collapse v-model="step.activeName" accordion>
                <el-collapse-item
                  v-for="rec in detail.response.filter(i=>i.index===step.index)"
                  :key="rec.auditingUserId?rec.auditingUserId:rec.auditingUserRealName"
                  :name="rec.auditingUserId?rec.auditingUserId:rec.auditingUserRealName"
                >
                  <div slot="title">
                    <UserFormItem v-if="rec.auditingUserId" :userid="rec.auditingUserId" />
                    <span v-else>{{ rec.auditingUserRealName }}</span>
                    <el-tag
                      :type="rec.status===4?'success':rec.status===8?'danger':'info'"
                    >{{ rec.status===4?'通过':rec.status===8?'驳回':'未处理' }}</el-tag>
                  </div>
                  <div v-if="rec.remark" class="audit-process-remark">
                    <el-input v-model="rec.remark" placeholder="审批备注" readonly type="textarea" />
                  </div>
                  <div v-else>无留言信息</div>
                </el-collapse-item>
              </el-collapse>
            </div>
            <div v-if="detail.nowStep" class="audit-process-status">
              <span v-if="step.index > detail.nowStep.index">
                <i class="el-icon-more-outline title grey-text" />
                未收到审批
              </span>
              <span
                v-if="step.index === detail.nowStep.index&&statusDic[detail.status].desc!=='已驳回'"
              >
                <i class="el-icon-loading title red--text" />
                审批中
              </span>
              <span v-if="step.index < detail.nowStep.index">
                <i class="el-icon-success title green--text" />
                通过审核
              </span>
              <span
                v-if="step.index === detail.nowStep.index&&statusDic[detail.status].desc==='已驳回'"
              >
                <i class="el-icon-circle-close title red--text" />
                驳回
              </span>
            </div>
            <div v-else>审批已结束</div>
          </el-tooltip>
          <div
            class="audit-process-companyName grey--text row layout justify-start align-center"
            title="审核单位"
          >
            <i class="el-icon-office-building black--text title mr-1" />
            <span>{{ step.firstMemberCompanyName }}</span>
          </div>
          <div class="row layout justify-space-between black--text">
            <span
              class="audit-process-person"
            >{{ step.membersAcceptToAudit.length }}/{{ step.requireMembersAcceptCount }}</span>
            <span class="audit-process-handleStamp">{{ step.timeStamp }}</span>
          </div>
        </div>
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
    GetHandleTimeAgo(step) {
      var arr = this.detail.response.filter(r => r.index === step.index)
      if (arr.length > 0) {
        var item = arr.reduce((prev, cur) => {
          return prev.handleStamp > cur.handleStamp ? prev : cur
        })
        return format(item.handleStamp, 'zh_CN')
      }
      return '无'
    },
    refresh() {
      if (!this.detail || !this.statusDic || this.statusDic.length === 0) return
      var i = 0
      for (i = 0; i < this.detail.steps.length; i++) {
        this.detail.steps[i].timeStamp = this.GetHandleTimeAgo(
          this.detail.steps[i]
        )
      }
      if (
        this.statusDic[this.detail.status].desc === '已通过' &&
        !this.detail.nowStep
      ) {
        this.nowActiveAudit = this.detail.response.length
        return
      }
      for (i = 0; i < this.detail.response.length; i++) {
        var item = this.detail.response[i]
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
