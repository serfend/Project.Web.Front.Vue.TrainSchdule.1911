<template>
  <div style="padding:10px">
    <el-link icon="el-icon-download" type="success" @click="downloadUserApplies">导出休假登记卡</el-link>
    <span v-if="detail&&detail.id">
      <action-examine :row="detail" style="display:inline" @updated="requestUpdate" />
      <action-user :row="detail" style="display:inline" @updated="requestUpdate" />
    </span>
    <div style="padding-top:0.5rem">
      <el-form type="flex" label-width="8rem">
        <div class="content-card">
          <el-card v-if="detail&&detail.id" v-loading="loading" shadow="hover">
            <h3 slot="header">本次休假</h3>
            <div v-if="detail.id">
              <el-form-item label="基本">
                <el-tag
                  v-if="detail.request.vacationType"
                  effect="dark"
                  :type="detail.request.vacationType==='正休'?'primary':'danger'"
                >{{ detail.request.vacationType }}</el-tag>

                <el-col v-if="staticData.vacationStart" :lg="6" :md="12" :sm="24">
                  <el-tooltip effect="light">
                    <template slot="content">
                      <span>{{ staticData.vacationSpent }}/{{ staticData.vacationLength }}天</span>
                    </template>
                    <el-progress :width="100" :percentage="staticData.vacationProgress" />
                  </el-tooltip>
                </el-col>
                <span v-else>
                  <el-tag
                    v-if="statusDic[detail.status]"
                    :color="statusDic[detail.status].color"
                    class="white--text"
                  >{{ statusDic[detail.status].desc }}</el-tag>
                </span>
              </el-form-item>
              <el-form-item label="原因">{{ detail.request.reason?detail.request.reason:'未填写' }}</el-form-item>
              <el-form-item label="创建时间">{{ detail.create }}</el-form-item>
              <el-form-item label="假期天数">
                <span>{{ `净假期${detail.request.vacationLength}天 在途${detail.request.onTripLength}天` }}</span>
                <el-tooltip
                  v-for="a in detail.request.additialVacations"
                  :key="a.id"
                  :content="`开始于${parseTime(a.start)}的${a.length}天${a.name},${a.description}`"
                >
                  <el-tag style="margin-left:10px">{{ `${a.length}天${a.name}` }}</el-tag>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="休假日期">
                <span>{{ parseTime(detail.request.stampLeave) }} - {{ parseTime(detail.request.stampReturn) }}</span>
              </el-form-item>
              <el-form-item label="休假地点">
                <span>{{ detail.request.vacationPlace.name }}</span>
                <span
                  v-if="detail.request.vacationPlaceName"
                >{{ `(${detail.request.vacationPlaceName})` }}</span>
              </el-form-item>
              <el-form-item label="交通工具">
                <span>{{ detail.request.byTransportation===0?'火车':detail.request.byTransportation===1?'飞机':'其他' }}</span>
              </el-form-item>
            </div>
          </el-card>
        </div>
        <div class="content-card">
          <AuditStatus :loading="loading" :data="detail" />
        </div>
        <div class="content-card">
          <el-card v-if="detail&&detail.id">
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
import { debounce } from '../../utils'
export default {
  name: 'ApplyDetail',
  components: {
    SettleFormItem,
    ActionExamine,
    ActionUser,
    AuditStatus,
    MyApply
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
      detail: {},
      loading: false,
      selfHistory: [],
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
    }
  },
  mounted() {
    if (!this.$route || !this.$route.query) return
    this.id = this.$route.query.id
    this.requestUpdate()
  },
  methods: {
    parseTime(date) {
      return parseTime(new Date(date), '{y}年{m}月{d}日')
    },
    datedifference,
    updateDetail() {
      if (!this.id) {
        this.$message.error('未选择休假申请')
        return this.$router.push('/application/queryAndAuditApplies')
      }
      this.loadDetail(this.id)
    },
    initstaticDataData() {
      const now = new Date()
      const start = this.detail.request.stampLeave
      const end = this.detail.request.stampReturn
      const vacationLength = datedifference(end, start) + 1
      this.staticData.vacationLength = vacationLength
      const vacationSpend = datedifference(now, start)
      this.staticData.vacationSpent =
        vacationSpend > vacationLength ? vacationLength : vacationSpend
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
    downloadUserApplies() {
      const dutiesRawType = confirm('选择是否下载干部类型') ? 0 : 1 // TODO 后期需要修改此处以保证下载正确
      const his = this.selfHistory
      if (!his || his.length === 0) {
        return this.$message.warning('当前无申请可导出')
      }
      exportUserApplies(
        dutiesRawType,
        his.map(i => i.id)
      )
    },
    loadDetail(id) {
      this.loading = true
      const loadDetail = detail(id).then(data => {
        this.detail = data
        this.detail.request = data.requestInfo
        this.initstaticDataData()
      })
      loadDetail.finally(() => {
        this.loading = false
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
</style>
