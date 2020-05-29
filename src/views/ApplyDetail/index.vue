<template>
  <div style="padding:10px">
    <el-button icon="el-icon-back" @click="$router.back(-1)">返回</el-button>
    <el-button icon="el-icon-download" type="success" @click="downloadUserApplies">导出休假登记卡</el-button>
    <h2 style="padding-top:10px">
      {{ staticData.applyDetailName }}
      <el-tag
        v-if="statusDic[detail.status] && staticData.vacationStart"
        :color="statusDic[detail.status].color"
        class="white--text"
      >{{ statusDic[detail.status].desc }}</el-tag>
    </h2>
    <div v-if="detail&&detail.id">
      <action-examine style="float:right" :row="detail" @updated="requestUpdate" />
      <action-user style="float:right" :row="detail" @updated="requestUpdate" />
    </div>
    <div style="padding-top:20px">
      <el-form type="flex" label-width="120px">
        <div class="content-card">
          <el-card
            v-if="detail&&detail.id"
            v-loading="loading"
            :visible.sync="innerShow"
            :show-close="false"
            shadow="hover"
          >
            <h3 slot="header">
              本次休假
              <el-tooltip
                v-for="av in detail.request.additialvacations"
                :key="av.id"
                :content="`${av.description},开始于${av.start}`"
              >
                <el-tag type="success">{{ av.name }}{{ av.length }}天</el-tag>
              </el-tooltip>
            </h3>
            <div v-if="detail.id">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="原因">{{ detail.request.reason }}</el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="路途">{{ detail.request.onTripLength }}天</el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="创建时间">{{ detail.create }}</el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-form-item
                  label="休假日期"
                >{{ detail.request.stampLeave }} - {{ detail.request.stampReturn }}</el-form-item>
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
                  v-if="statusDic[detail.status]"
                  :color="statusDic[detail.status].color"
                  class="white--text"
                >{{ statusDic[detail.status].desc }}</el-tag>
              </el-form-item>
              <el-form-item label="休假地点">
                <el-col
                  :span="12"
                >{{ detail.request.vacationPlace.name }}{{ detail.request.vacationPlaceName?`(${detail.request.vacationPlaceName})`:'' }}</el-col>
              </el-form-item>
              <el-col :span="8">
                <el-form-item
                  label="交通工具"
                >{{ detail.request.byTransportation===0?'火车':detail.request.byTransportation===1?'飞机':'其他' }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系方式">{{ detail.social.phone }}</el-form-item>
              </el-col>
            </div>
          </el-card>
        </div>
        <div class="content-card">
          <AuditStatus :loading="loading" :data="detail" />
        </div>
        <div class="content-card">
          <el-card v-loading="loading" :visible.sync="innerShow" :show-close="false" shadow="hover">
            <h3 slot="header">历史休假情况(未开放)</h3>
          </el-card>
        </div>
        <div class="content-card">
          <el-card
            v-if="detail&&detail.id"
            v-loading="loading"
            label="家庭信息"
            :visible.sync="innerShow"
            :show-close="false"
            shadow="hover"
          >
            <h3 slot="header">申请人</h3>

            <el-container style="background:#fff">
              <el-aside width="padding:0;margin:0;background: rgb(255, 255, 255);width:350px">
                <User :data="detail.base" :can-load-avatar="true" />
              </el-aside>
              <el-main>
                <SettleFormItem :form.sync="detail.social.settle.self" disabled label="本人所在地" />
                <SettleFormItem :form.sync="detail.social.settle.lover" disabled label="配偶所在地" />
                <SettleFormItem :form.sync="detail.social.settle.parent" disabled label="父母所在地" />
                <SettleFormItem
                  :form.sync="detail.social.settle.loversParent"
                  disabled
                  label="配偶父母所在地"
                />
              </el-main>
            </el-container>
          </el-card>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { detail, querySelf } from '@/api/apply'
import { exportUserApplies } from '@/api/common/static'
import { datedifference } from '@/utils'
import { getUserAvatar } from '@/api/user/userinfo'
import ActionExamine from '../QueryAndAuditApplies/ActionExamine'
import ActionUser from '../QueryAndAuditApplies/ActionUser'
import SettleFormItem from '@/components/SettleFormItem'
import AuditStatus from './components/AuditStatus'
import User from '@/components/User'
export default {
  name: 'ApplyDetail',
  components: {
    SettleFormItem,
    ActionExamine,
    ActionUser,
    AuditStatus,
    User
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      id: null,
      avatar: null,
      detail: {},
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
    statusDic() {
      return this.$store.state.vacation.statusDic
    }
  },
  mounted() {
    if (!this.$route || !this.$route.query) return
    this.id = this.$route.query.id
    this.requestUpdate()
  },
  methods: {
    datedifference,
    requestUpdate() {
      if (!this.id) {
        this.$message.error('未选择休假申请')
        return this.$router.push('/application/queryAndAuditApplies')
      }
      this.loadDetail(this.id)
    },
    initstaticDataData() {
      var now = new Date()
      var start = this.detail.request.stampLeave
      var end = this.detail.request.stampReturn
      this.staticData.vacationLength = datedifference(end, start) + 1
      this.staticData.vacationSpent = datedifference(now, start)
      this.staticData.applyDetailName = `${this.detail.base.dutiesName}${
        this.detail.base.realName
      }的${datedifference(
        this.detail.request.stampReturn,
        this.detail.request.stampLeave
      ) + 1}天${this.detail.request.vacationType}休假`
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
    downloadUserApplies() {
      var dutiesRawType = confirm('选择是否下载干部类型') ? 0 : 1 // TODO 后期需要修改此处以保证下载正确
      querySelf(null, this.detail.base.id).then(data => {
        if (data.list.length === 0) {
          return this.$message.error('当前用户无申请可导出')
        }
        exportUserApplies(
          dutiesRawType,
          data.list.map(i => i.id)
        )
      })
    },
    loadDetail(id) {
      this.loading = true
      detail(id).then(data => {
        this.detail = data
        this.detail.request = data.requestInfo
        this.loading = false
        this.getUserAvatar(data.base.id)
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
