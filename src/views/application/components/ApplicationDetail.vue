<template>
  <el-card :body-style="{ padding: '0px' }" class="application-detail">
    <div class="applyinfo-card">
      <div class="applyinfo-no caption py-2">
        创建于.
        <span class="font-weight-thin">{{ basic.create }}</span>
      </div>
      <div class="row layout justify-start px-2">
        <div class="applyinfo-avatar">
          <i class="el-icon-user-solid" />
        </div>
        <div class="applyinfo-content">
          <div class="applyinfo-content-title">
            {{ basic.base.realName }}
            <el-tag class="ml-2" size="mini" type="info">{{ basic.base.dutiesName }}</el-tag>
          </div>
          <div
            :title="basic.base.companyName"
            class="applyinfo-content-subtitle text-truncate"
          >{{ basic.base.companyName }}</div>
        </div>
      </div>
      <div class="applyinfo-footer pa-2">
        <div class="layout row justify-space-between">
          <el-tag type="info">{{ basic.statusDesc }}</el-tag>
          <el-tooltip content="点击下载用户的休假情况登记卡" effect="dark" placement="top">
            <!-- content to trigger tooltip here -->
            <el-button
              icon="el-icon-download"
              size="mini"
              type="primary"
              @click="downloadUserApplies(basic.userBase.id)"
            >导出</el-button>
          </el-tooltip>
        </div>
      </div>
    </div>

    <div class="apply-detail-list">
      <div class="h-88 dark" />
      <div class="padding-top-80">
        <div v-if="requestInfo">
          <el-row class="py-2 px-3 white">
            <div class="applyinfo-list-title">休假类型</div>
            <div class="applyinfo-list-subtitle">{{ requestInfo.vocationType }}</div>
          </el-row>
          <div class="row layout justify-space-between applyinfo-duration">
            <span class>休假时长</span>
            <span class="caption">
              <!-- <span class="title">{{ requestInfo.onTripLength + requestInfo.vocationLength }}</span>
              天-->
              <el-dropdown>
                <span class="el-dropdown-link">
                  <span>{{ datedifference(requestInfo.stampLeave, requestInfo.stampReturn) + 1 }}天</span>
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>正休假时长{{ requestInfo.vocationLength }}天</el-dropdown-item>
                  <el-dropdown-item>路途时长{{ requestInfo.onTripLength }}天</el-dropdown-item>
                  <el-dropdown-item
                    v-for="additial in requestInfo.additialVocations"
                    v-show="requestInfo.additialVocations.length>0"
                    :key="additial.length"
                  >{{ additial.name }} {{ additial.length }}天</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </div>
          <el-row class="py-2 mx-2 mb-2 px-2 white el-row">
            <div class="applyinfo-list-title blue--text">
              <i class="subheading mr-1 el-icon-question" /> 理由
            </div>
            <div class="applyinfo-list-subtitle">{{ requestInfo.reason }}</div>
          </el-row>
          <el-row class="py-2 mx-2 mb-2 px-2 white el-row">
            <div class="applyinfo-list-title blue--text">
              <i class="subheading mr-1 el-icon-s-home" /> 休假目的地
            </div>
            <div class="applyinfo-list-subtitle">{{ requestInfo.vocationPlace.name }}</div>
          </el-row>
          <el-row class="py-2 mx-2 mb-2 px-2 white el-row">
            <div class="applyinfo-list-title blue--text">
              <i class="subheading mr-1 el-icon-timer blue--text" />
              申请离队时间
            </div>
            <div class="applyinfo-list-subtitle">{{ requestInfo.stampLeave|formatTime }}</div>
          </el-row>
          <el-row class="py-2 mx-2 mb-2 px-2 white el-row">
            <div class="applyinfo-list-title blue--text">
              <i class="subheading mr-1 el-icon-timer orange--text" />
              预计归队时间
            </div>
            <div class="applyinfo-list-subtitle">{{ requestInfo.stampReturn|formatTime }}</div>
          </el-row>
        </div>

        <el-row class="py-2 px-3 my-2">
          <div class="applyinfo-list-title">审核流程</div>
          <el-steps :active="activedProcess" class="pa-2" direction="vertical">
            <el-step v-for="(step) in response" :key="step.companyName" finish-status="success">
              <div slot="description" class="audit-process-card">
                <div class="audit-process-status">
                  <span v-if="step.status === 0">
                    <i class="el-icon-loading title grey-text" />
                    待完成的流程
                  </span>
                  <span v-if="step.status === 1">
                    <i class="el-icon-s-flag title red--text" />
                    当前流程
                  </span>
                  <span v-if="step.status === 2">审核状态3</span>
                  <span v-if="step.status === 3">审核状态3</span>
                  <span v-if="step.status === 4">
                    <i class="el-icon-success title green--text" />
                    通过审核
                  </span>
                </div>
                <div
                  class="audit-process-companyName grey--text row layout justify-start align-center"
                  title="审核单位"
                >
                  <i class="el-icon-office-building black--text title mr-1" />
                  <span>{{ step.companyName }}</span>
                </div>
                <div
                  v-if="step.auditingUserRealName"
                  class="row layout justify-space-between black--text"
                >
                  <span class="audit-process-person">{{ step.auditingUserRealName }}</span>
                  <span class="audit-process-handleStamp">{{ step.handleStamp|timeAgo }}</span>
                </div>
                <div v-if="step.remark" class="audit-process-remark">
                  <el-input v-model="step.remark" placeholder="审批备注" readonly type="textarea" />
                </div>
              </div>
            </el-step>
          </el-steps>
          <!-- <div class="applyinfo-list-subtitle">展开</div> -->
        </el-row>
      </div>
    </div>

    <div class="apply-detail-action">
      <div class="layout row justify-center">
        <slot :applyid="applyId" :row="basic" name="action" />
      </div>
    </div>
    <!-- card body -->
  </el-card>
</template>

<script>
import moment from 'moment'
import { exportUserApplies } from '../../../api/static'
import { parseTime, datedifference } from '../../../utils'
moment.locales('zh_CN')
export default {
  name: 'ApplicationDetail',
  filters: {
    timeAgo(val) {
      return moment(val).fromNow()
    },
    formatTime(val) {
      return moment(val).format('LLL')
    }
  },
  props: {
    basic: {
      type: Object,
      default() {
        return {}
      }
    },
    applyId: {
      type: String,
      default: null
    },
    detail: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    response() {
      return this.detail.response
    },
    requestInfo() {
      return this.detail.requestInfo
    },
    activedProcess() {
      const { nowAuditCompany } = this.basic
      const { response } = this
      const index = response.findIndex(
        val => val.companyName === nowAuditCompany
      )
      return index + 1 < 1 ? -1 : index
    }
  },
  methods: {
    datedifference(date1, date2) {
      return datedifference(date1, date2)
    },
    parseTime(rawtime, format) {
      return parseTime(rawtime, format)
    },
    downloadUserApplies(id) {
      exportUserApplies({
        user: id
      })
    }
  }
}
</script>

<style lang="scss">
.application-detail {
  position: relative;
  padding: 0;
  background: whitesmoke;
  border: none;
  height: calc(100vh - 48px);
  border-radius: 0;
  .h-88 {
    height: 88px;
  }

  .dark {
    background: #304156;
  }

  .padding-top-80 {
    padding-top: 80px;
  }

  .applyinfo-card {
    position: absolute;
    border: 1px solid #e0e0e0;
    left: 0;
    right: 0;
    top: 0;
    margin: 12px;
    border-radius: 6px;
    box-shadow: 0 2px 6px -2px #2e3f53;
    padding: 0 8px;
    background: white;
    z-index: 36;
    opacity: 0.95;
    &:hover {
      box-shadow: 0 1px 6px -4px;
    }
  }

  .applyinfo-avatar {
    width: 48px;
    height: 48px;
    text-align: center;
    line-height: 48px;
    font-size: 32px;
    margin-top: 10px;
    border-radius: 50%;
    background: #3949ab;
    color: white;
  }

  .applyinfo-avatar image {
    border-radius: 100%;
    height: 48px;
    width: 48px;
  }

  .applyinfo-footer {
    border-top: 1px solid #eeeeee;
  }

  .applyinfo-content-title {
    font-size: 15px;
    padding: 8px;
    font-weight: bold;
  }

  .applyinfo-content-subtitle {
    font-size: 12px;
    padding: 8px;
    max-width: 280px;
  }

  &.el-card .el-card__body {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  .apply-detail-list {
    z-index: 1;
    position: absolute;
    width: 100%;
    height: calc(100vh - 54px);
    background: #f5f5f5;
    overflow-y: auto;
    padding-bottom: 56px;

    .applyinfo-duration {
      height: 60px;
      line-height: 60px;
      padding: 12px 24px;
      box-sizing: content-box;
      background: #f5f5f5;
    }

    .applyinfo-list-title {
      color: #616161;
      padding: 8px;
      font-size: 13px;
    }

    .applyinfo-list-subtitle {
      font-size: 16px;
      font-weight: 500;
      color: black;
      padding: 8px;
      padding-left: 32px;
    }
  }

  .apply-detail-action {
    position: absolute;
    bottom: 0;
    width: 100%;
    background: white;
    height: 64px;
    box-shadow: 1px 0 8px -5px black;
    z-index: 1;
    padding: 12px;
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
}
</style>
