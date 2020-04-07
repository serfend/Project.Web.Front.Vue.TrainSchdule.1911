<template>
  <div style="padding:10px">
    <el-button icon="el-icon-back" @click="$router.push('/application/queryAndAuditApplies')">返回</el-button>
    <el-button icon="el-icon-download" type="success" @click="downloadUserApplies">导出休假登记卡</el-button>
    <h2 style="padding-top:10px">
      {{ staticData.applyDetailName }}
      <el-tag
        v-if="statusDic[row.status] && staticData.vacationStart"
        :color="statusDic[row.status].color"
        class="white--text"
      >{{ statusDic[row.status].desc }}</el-tag>
    </h2>
    <action-examine style="float:right" :row="row" @updated="requestUpdate" />
    <action-user style="float:right" :row="row" @updated="requestUpdate" />
    <div style="padding-top:20px">
      <el-form type="flex" label-width="120px">
        <div class="content-card">
          <el-card
            v-if="detail.status"
            v-loading="loading"
            :visible.sync="innerShow"
            :show-close="false"
            shadow="hover"
          >
            <h3 slot="header">
              本次休假
              <el-tooltip
                v-for="av in detail.requestInfo.additialVocations"
                :key="av.id"
                :content="`${av.description},开始于${av.start}`"
              >
                <el-tag type="success">{{ av.name }}{{ av.length }}天</el-tag>
              </el-tooltip>
            </h3>
            <div v-if="detail.status">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="原因">{{ detail.requestInfo.reason }}</el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="路途">{{ detail.requestInfo.onTripLength }}天</el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="创建时间">{{ detail.create }}</el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-form-item
                  label="休假日期"
                >{{ detail.requestInfo.stampLeave }} - {{ detail.requestInfo.stampReturn }}</el-form-item>
              </el-row>
              <el-form-item v-if="staticData.vacationStart" label="休假情况">
                <el-col :lg="2" :md="3" :sm="4">
                  <el-tag>{{ staticData.vacationSpent }}/{{ staticData.vacationLength }}天</el-tag>
                </el-col>
                <el-row>
                  <el-col :span="6">
                    <el-progress :width="100" :percentage="staticData.vacationProgress" />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item v-else label="状态">
                <el-tag
                  v-if="statusDic[row.status]"
                  :color="statusDic[row.status].color"
                  class="white--text"
                >{{ statusDic[row.status].desc }}</el-tag>
              </el-form-item>
              <el-form-item label="休假地点">
                <el-col
                  :span="12"
                >{{ detail.requestInfo.vocationPlace.name }}{{ detail.requestInfo.vocationPlaceName?`(${detail.requestInfo.vocationPlaceName})`:'' }}</el-col>
              </el-form-item>
              <el-col :span="8">
                <el-form-item
                  label="交通工具"
                >{{ detail.requestInfo.byTransportation===0?'火车':detail.requestInfo.byTransportation===1?'飞机':'其他' }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系方式">{{ detail.social.phone }}</el-form-item>
              </el-col>
            </div>
          </el-card>
        </div>
        <div class="content-card">
          <el-card v-loading="loading" :visible.sync="innerShow" :show-close="false" shadow="hover">
            <h3 slot="header">当前审批</h3>
            <el-steps
              v-if="detail.steps"
              :space="200"
              :active="nowActiveAudit"
              finish-status="success"
            >
              <el-step v-for="step in detail.steps" :key="step.id">
                <div slot="description" class="audit-process-card">
                  <el-tooltip effect="light">
                    <div slot="content">
                      <el-collapse v-model="step.activeName" accordion>
                        <el-collapse-item
                          v-for="rec in detail.response.filter(i=>i.index===step.index)"
                          :key="rec.auditingUserRealName"
                          :name="rec.auditingUserRealName"
                        >
                          <div slot="title">
                            {{ rec.auditingUserRealName }}
                            <el-tag
                              :type="rec.status===4?'success':rec.status===8?'danger':'info'"
                            >{{ rec.status===4?'通过':rec.status===8?'驳回':'未处理' }}</el-tag>
                          </div>
                          <div v-if="rec.remark" class="audit-process-remark">
                            <el-input
                              v-model="rec.remark"
                              placeholder="审批备注"
                              readonly
                              type="textarea"
                            />
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
        </div>
        <div class="content-card">
          <el-card v-loading="loading" :visible.sync="innerShow" :show-close="false" shadow="hover">
            <h3 slot="header">历史休假情况(未开放)</h3>
          </el-card>
        </div>
        <div class="content-card">
          <el-card
            v-if="detail.status"
            v-loading="loading"
            label="家庭信息"
            :visible.sync="innerShow"
            :show-close="false"
            shadow="hover"
          >
            <h3 slot="header">
              申请人
              <div class="pull-left">
                <img v-if="avatar" class="avatar-32" :src="avatar" alt @click="handleClickAvatar" />
              </div>
            </h3>

            <el-form-item label="单位">{{ detail.base.companyName }}</el-form-item>
            <el-form-item label="职务">{{ detail.base.dutiesName }}</el-form-item>
            <el-form-item>
              <SettleFormItem :form.sync="detail.social.settle.self" disabled label="本人所在地" />
              <SettleFormItem :form.sync="detail.social.settle.lover" disabled label="配偶所在地" />
              <SettleFormItem :form.sync="detail.social.settle.parent" disabled label="父母所在地" />
              <SettleFormItem
                :form.sync="detail.social.settle.loversParent"
                disabled
                label="配偶父母所在地"
              />
            </el-form-item>
          </el-card>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { detail } from '@/api/apply'
import { exportUserApplies } from '@/api/static'
import { parseTime, datedifference } from '@/utils'
import { getUserAvatar } from '@/api/userinfo'
import ActionExamine from '../QueryAndAuditApplies/ActionExamine'
import ActionUser from '../QueryAndAuditApplies/ActionUser'
import SettleFormItem from '@/components/SettleFormItem'

moment.locales('zh_CN')
export default {
  name: 'ApplyDetail',
  components: {
    SettleFormItem,
    ActionExamine,
    ActionUser
  },
  filters: {
    timeAgo(val) {
      return moment(val).fromNow()
    },
    formatTime(val) {
      return moment(val).format('LLL')
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      avatar: null,
      detail: {},
      nowActiveAudit: 0,
      innerShow: false,
      loading: false,
      staticData: {
        vacationLength: 0,
        vacationSpent: 0,
        vacationProgress: 0,
        vacationStart: false,
        applyDetailName: '加载中...'
      }
    }
  },
  computed: {
    row() {
      return this.$store.state.vocation.vacationDetail
    },
    statusDic() {
      return this.$store.state.vocation.statusDic
    }
  },
  watch: {
    row: {
      handler(val) {
        if (!val || !val.base) {
          this.$message.error('未选择休假申请')
          return this.$router.push('/application/queryAndAuditApplies')
        }
        this.loadDetail(val.id)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    datedifference,
    GetHandleTimeAgo(step) {
      var arr = this.detail.response.filter(r => r.index === step.index)
      if (arr.length > 0) {
        var item = arr.reduce((prev, cur) => {
          return prev.handleStamp > cur.handleStamp ? prev : cur
        })
        return moment(item.handleStamp).fromNow()
      }
      return '无'
    },
    requestUpdate() {
      this.loadDetail(this.row.id)
    },
    initstaticDataData() {
      var now = new Date()
      var start = this.detail.requestInfo.stampLeave
      var end = this.detail.requestInfo.stampReturn
      this.staticData.vacationLength = datedifference(end, start)
      this.staticData.vacationSpent = datedifference(now, start)
      this.staticData.applyDetailName = `${this.row.base.dutiesName}${
        this.row.base.realName
      }的${datedifference(
        this.row.request.stampReturn,
        this.row.request.stampLeave
      )}天${this.row.request.vocationType}休假`
      this.staticData.vacationStart =
        this.detail.status &&
        this.statusDic[this.detail.status].desc === '已通过'
      if (this.staticData.vacationSpent >= this.staticData.vacationLength) {
        this.staticData.vacationProgress = 100
      } else {
        this.staticData.vacationProgress =
          (this.staticData.vacationSpent / this.staticData.vacationLength) * 100
        this.staticData.vacationProgress = Math.floor(
          this.staticData.vacationProgress
        )
      }
    },
    getUserAvatar(id) {
      getUserAvatar(id).then(data => {
        this.avatar = data.url
      })
    },
    handleClickAvatar() {
      this.$store.push('/profile/index?id=' + this.detail.base.id)
    },
    parseTime(rawtime, format) {
      return parseTime(rawtime, format)
    },
    downloadUserApplies() {
      var dutiesRawType = confirm('选择是否下载干部类型') ? 0 : 1 // TODO 后期需要修改此处以保证下载正确
      var userid = this.detail.base.id
      exportUserApplies(dutiesRawType, userid)
    },
    loadDetail(id) {
      this.loading = true
      detail(id).then(data => {
        this.detail = data
        this.loading = false
        this.getUserAvatar(data.base.id)
        var i = 0
        for (i = 0; i < this.detail.steps.length; i++) {
          this.detail.steps[i].timeStamp = this.GetHandleTimeAgo(
            this.detail.steps[i]
          )
        }
        for (i = 0; i < this.detail.response.length; i++) {
          var item = this.detail.response[i]
          if (item.status === 4) {
            this.nowActiveAudit = i
            break
          }
        }
        this.initstaticDataData()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content-card {
  padding-top: 20px;
}

.audit-process- {
  &card {
    background: white;
    margin-bottom: 12px;
    padding: 12px;
    border-radius: 4px;
    box-shadow: 0px 0px 2px 0px;
  }
  &status {
    font-size: 13px;
    padding: 4px 0;
  }
  &companyName {
    padding: 4px 0 4px;
  }
}
.pull-left {
  float: left !important;
}
.pull-right {
  float: right !important;
}
.avatar-32 {
  width: 32px;
  height: 32px;
  border-radius: 10%;
}
</style>
