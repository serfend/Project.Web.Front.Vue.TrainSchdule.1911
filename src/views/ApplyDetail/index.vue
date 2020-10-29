<template>
  <div style="padding: 10px">
    <el-card v-if="detail && detail.id">
      <el-dialog :visible.sync="show_share" title="分享休假申请详情" append-to-body>
        <DetailShare :id="detail.id" />
      </el-dialog>
      <el-button type="text" icon="el-icon-share" @click="show_share=true">分享此休假详情</el-button>
      <el-button icon="el-icon-download" type="text" @click="downloadUserApplies">导出休假登记卡</el-button>
      <action-examine :row="detail" style="display: inline" @updated="requestUpdate" />
      <action-user :row="detail" style="display: inline" @updated="requestUpdate" />
    </el-card>

    <div style="padding-top: 0.5rem">
      <el-form type="flex" label-width="8rem">
        <div class="content-card">
          <el-card
            v-if="detail && detail.id && detail.status !== 20"
            v-loading="loading"
            shadow="hover"
          >
            <h3 slot="header">本次休假</h3>
            <div v-if="detail.id">
              <el-form-item label="基本">
                <el-tag
                  v-if="detail.request.vacationType"
                  effect="dark"
                  :type="
                    detail.request.vacationType === '正休'
                      ? 'primary'
                      : 'danger'
                  "
                >{{ detail.request.vacationType }}</el-tag>
                <div v-if="staticData.vacationStart">
                  <el-tooltip effect="light">
                    <template slot="content">
                      <span>{{ staticData.vacationSpent }}/{{ staticData.vacationLength }}天</span>
                    </template>
                    <el-col v-if="staticData.vacationSpent >= 0" :lg="6" :md="12" :sm="24">
                      <el-progress :width="100" :percentage="staticData.vacationProgress" />
                    </el-col>

                    <span v-else>距离离队时间:{{ -staticData.vacationSpent }}天</span>
                  </el-tooltip>
                </div>
                <span v-else>
                  <el-tag
                    v-if="statusDic[detail.status]"
                    :color="statusDic[detail.status].color"
                    class="white--text"
                  >{{ statusDic[detail.status].desc }}</el-tag>
                </span>
              </el-form-item>
              <el-form-item label="原因">{{ detail.request.reason ? detail.request.reason : '未填写' }}</el-form-item>
              <el-form-item label="创建时间">{{ detail.create }}</el-form-item>
              <el-form-item label="假期天数">
                <span>{{ `净假期${detail.request.vacationLength}天 在途${detail.request.onTripLength}天` }}</span>
                <el-tooltip
                  v-for="a in detail.request.additialVacations"
                  :key="a.id"
                  :content="`开始于${parseTime(a.start)}的${a.length}天${
                    a.name
                  },${a.description}`"
                >
                  <el-tag style="margin-left: 10px">{{ `${a.length}天${a.name}` }}</el-tag>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="休假日期">
                <span>
                  {{ parseTime(detail.request.stampLeave) }} -
                  {{ parseTime(detail.request.stampReturn) }}
                </span>
              </el-form-item>
              <el-form-item label="休假地点">
                <span>{{ detail.request.vacationPlace && detail.request.vacationPlace.name }}</span>
                <span
                  v-if="detail.request.vacationPlaceName"
                >{{ `(${detail.request.vacationPlaceName})` }}</span>
              </el-form-item>
              <el-form-item label="交通工具">
                <span>{{ detail.request.byTransportation === 0 ? '火车' : detail.request.byTransportation === 1? '飞机': '其他' }}</span>
              </el-form-item>
            </div>
          </el-card>
        </div>
        <div class="content-card">
          <AuditStatus :loading="loading" :data="detail" />
        </div>
        <div class="content-card">
          <el-card v-if="detail && detail.id">
            <h3 slot="header">申请人信息</h3>
            <MyApply
              :id="detail.base.id"
              :list.sync="selfHistory"
              :start="null"
              :auto-expand="false"
            >
              <template slot="inner">
                <el-card>
                  <SettleFormItem :form.sync="settle.self" disabled label="本人所在地" />
                  <SettleFormItem :form.sync="settle.lover" disabled label="配偶所在地" />
                  <SettleFormItem :form.sync="settle.parent" disabled label="父母所在地" />
                  <SettleFormItem :form.sync="settle.loversParent" disabled label="配偶父母所在地" />
                </el-card>
              </template>
            </MyApply>
          </el-card>
        </div>
        <div class="content-card">
          <ApplyComments :id="detail.id" />
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { detail } from '@/api/apply/query'
import { exportUserApplies } from '@/api/common/static'
import { datedifference, parseTime } from '@/utils'
import ActionExamine from '../QueryAndAuditApplies/ActionExamine'
import ActionUser from '../QueryAndAuditApplies/ActionUser'
import SettleFormItem from '@/components/SettleFormItem'
import AuditStatus from './components/AuditStatus'
import MyApply from '@/views/MyApply'
import DetailShare from './components/DetailShare'
import { debounce } from '../../utils'
import ApplyComments from './components/ApplyComments'
export default {
  name: 'ApplyDetail',
  components: {
    SettleFormItem,
    ActionExamine,
    ActionUser,
    AuditStatus,
    MyApply,
    DetailShare,
    ApplyComments,
  },
  props: {
    focusId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      id: null,
      route_id: null,
      detail: {},
      show_share: false,
      loading: false,
      selfHistory: [],
      staticData: {
        vacationLength: 0,
        vacationSpent: 0,
        vacationProgress: 0,
        vacationStart: false,
      },
    }
  },
  computed: {
    requestUpdate() {
      return debounce(() => {
        this.updateDetail()
      }, 500)
    },
    statusDic() {
      return this.$store.state.vacation.statusDic
    },
    settle() {
      return this.detail.social.settle
    },
  },
  watch: {
    focusId: {
      handler(val) {
        console.log('modify focusId', val)
        this.id = val
      },
      immediate: true,
    },
    route_id(val) {
      if (this.focusId !== null) return
      console.log('modify routeId', val)
      this.id = val
    },
    id: {
      handler(val) {
        this.requestUpdate()
      },
      immediate: true,
    },
  },
  mounted() {
    if (!this.$route || !this.$route.query) return
    this.route_id = this.$route.query.id
  },
  methods: {
    parseTime(date) {
      return parseTime(new Date(date), '{y}年{m}月{d}日')
    },
    datedifference,
    updateDetail() {
      if (this.id) {
        this.loadDetail(this.id)
      }
    },
    initstaticDataData() {
      const now = new Date()
      const { request, status } = this.detail
      const start = request.stampLeave
      const end = request.stampReturn
      const vacationLength = datedifference(end, start) + 1
      const s = this.staticData
      s.vacationLength = vacationLength
      const vacationSpend = datedifference(now, start)
      s.vacationSpent =
        vacationSpend > vacationLength ? vacationLength : vacationSpend
      s.vacationStart = status === 100
      let progress = 0
      if (s.vacationSpent >= s.vacationLength) {
        progress = 100
      } else {
        progress = (s.vacationSpent / s.vacationLength) * 100
        if (progress < 0) progress = 0
        progress = Math.floor(progress)
      }
      s.vacationProgress = progress
    },
    downloadUserApplies() {
      const dutiesRawType = confirm('选择是否下载干部类型') ? 0 : 1 // TODO 后期需要修改此处以保证下载正确
      const his = this.selfHistory
      if (!his || his.length === 0) {
        return this.$message.warning('当前无申请可导出')
      }
      exportUserApplies(
        dutiesRawType,
        his.map((i) => i.id)
      )
    },
    loadDetail(id) {
      this.loading = true
      const loadDetail = detail(id).then((data) => {
        if (!data.requestInfo) data.requestInfo = {}
        this.detail = data
        const d = this.detail
        d.request = data.requestInfo
        if (d.request) {
          d.stampReturn = new Date(d.request.stampReturn)
          d.stampLeave = new Date(d.request.stampLeave)
        }
        this.initstaticDataData()
      })
      loadDetail.finally(() => {
        this.loading = false
      })
    },
  },
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
</style>
