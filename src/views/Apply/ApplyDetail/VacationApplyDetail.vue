<template>
  <div style="padding: 10px">
    <div v-if="detail && detail.id">
      <el-dialog
        :visible.sync="show_share"
        title="分享休假申请详情"
        append-to-body
      >
        <ClipboardShare
          default-content="我把我的休假申请发给你啦~复制本段${key}打开系统查看。或点击链接${url} 到浏览器。"
        />
      </el-dialog>
      <el-button
        v-if="route_id"
        type="text"
        icon="el-icon-share"
        @click="show_share = true"
      >分享此休假详情</el-button>
      <el-button
        icon="el-icon-date"
        type="text"
        @click="showMyApplies = true"
      >查看历史记录</el-button>
      <ActionExamine
        :entity-type="entityType"
        :row="detail"
        style="display: inline"
        @updated="updateDetail"
      />
      <ActionUser
        :entity-type="entityType"
        :row="detail"
        style="display: inline"
        @updated="updateDetail"
      />
    </div>
    <el-drawer
      :visible.sync="showMyApplies"
      append-to-body
      size="80rem"
      direction="rtl"
    >
      <MyApply
        v-if="showMyApplies"
        :id="detail.base.id"
        :entity-type="entityType"
        :start="null"
        :auto-expand="false"
      />
    </el-drawer>
    <div style="padding-top: 0.5rem">
      <el-card v-loading="loading" shadow="hover" class="content-card-first">
        <h3 v-if="detail && detail.baseInfo" slot="header" style="display:flex">
          <span style="margin-right:1rem">本次休假</span>
          <span
            v-if="detail.baseInfo.createBy !== detail.baseInfo.userId"
            style="display:flex"
          >
            <span>（代创建）代理人：</span>
            <UserFormItem
              :userid="detail.baseInfo.createBy"
              :direct-show-card="false"
              :can-load-avatar="false"
              type="warning"
            />
          </span>
        </h3>
        <el-row v-if="detail && detail.id && detail.status !== 20" :gutter="20">
          <el-col :xl="8" :lg="10" :md="12" :sm="12" :xs="24">
            <el-form v-if="detail.id" label-width="8rem">
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
                <el-tag
                  v-if="detail.type.isPlan"
                  color="#cccccc"
                  class="white--text"
                >计划</el-tag>
                <div v-if="staticData.vacationStart">
                  <el-tooltip effect="light">
                    <template slot="content">
                      <span>{{ staticData.vacationSpent }}/{{
                        staticData.vacationLength
                      }}天</span>
                    </template>
                    <el-col
                      v-if="staticData.vacationSpent >= 0"
                      style="width:80%"
                    >
                      <el-progress :percentage="percent" />
                    </el-col>

                    <span
                      v-else
                    >距离离队时间:{{ -staticData.vacationSpent }}天</span>
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
              <el-form-item label="原因">{{
                detail.request.reason ? detail.request.reason : "未填写"
              }}</el-form-item>
              <el-form-item label="创建时间">{{ detail.create }}</el-form-item>
              <el-form-item label="假期天数">
                <span>共{{ total }}天 | </span>
                <span>{{
                  `净假期${detail.request.vacationLength}天 在途${
                    detail.request.onTripLength
                  }天`
                }}</span>
                <VacAdditionalTags v-model="detail.request.additialVacations" />
              </el-form-item>
              <el-form-item label="休假日期">
                <span>
                  {{ parseTime(detail.request.stampLeave) }} -
                  {{ parseTime(detail.request.stampReturn) }}
                </span>
              </el-form-item>
              <el-form-item label="休假地点">
                <span>{{
                  detail.request.vacationPlace &&
                    detail.request.vacationPlace.name
                }}</span>
                <span v-if="detail.request.vacationPlaceName">{{
                  `(${detail.request.vacationPlaceName})`
                }}</span>
              </el-form-item>
              <el-form-item label="出行方式">
                <TransportationType
                  v-model="detail.request.byTransportation"
                  show-text
                />
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :xl="8" :lg="8" hidden-md-only hidden-sm-only :xs="24">
            <el-form label-width="8rem">
              <SettleFormItem
                :form.sync="settle.self"
                disabled
                label="本人所在地"
              />
              <SettleFormItem
                :form.sync="settle.lover"
                disabled
                label="配偶所在地"
              />
              <SettleFormItem
                :form.sync="settle.parent"
                disabled
                label="父母所在地"
              />
              <SettleFormItem
                :form.sync="settle.loversParent"
                disabled
                label="配偶父母所在地"
              />
            </el-form>
          </el-col>
          <el-col :xl="8" :lg="6" :md="4" :sm="12" :xs="24">
            <UserFormItem
              :userid="detail.base.id"
              :direct-show-card="true"
              :can-load-avatar="true"
              @expandChange="onFormExpand"
            />
            <el-collapse-transition>
              <el-card
                v-if="detail && show_previous"
                shadow="never"
                class="ribbon-container description-layout"
              >
                <div class="ribbon-entity">
                  <span>历史休假状态</span>
                </div>
                <VacationDescriptionContent
                  :users-vacation="detail.userVacationDescription"
                />
              </el-card>
            </el-collapse-transition>
          </el-col>
        </el-row>
      </el-card>
      <div class="content-card">
        <AuditStatus :loading="loading" :data="detail" />
      </div>
      <div v-if="detail && detail.id" class="content-card">
        <ApplyExecuteRecords :id="detail.id" />
      </div>
      <div v-if="showComment && detail && detail.id" class="content-card">
        <ApplyComments :id="detail.id" />
      </div>
    </div>
  </div>
</template>

<script>
import { detail } from '@/api/apply/query'
import { datedifference, parseTime } from '@/utils'
import { get_item_type } from '@/utils/vacation'
export default {
  name: 'ApplyDetail',
  components: {
    SettleFormItem: () => import('@/components/SettleFormItem'),
    ActionExamine: () => import('../QueryAndAuditApplies/ActionExamine'),
    ActionUser: () => import('../QueryAndAuditApplies/ActionUser'),
    AuditStatus: () => import('./components/AuditStatus'),
    MyApply: () => import('@/views/Apply/MyApply'),
    ClipboardShare: () =>
      import('@/views/common/ClipboardMonitor/ClipboardShare'),
    ApplyComments: () => import('@/components/BiliComment'),
    UserFormItem: () => import('@/components/User/UserFormItem'),
    TransportationType: () =>
      import('@/components/Vacation/TransportationType'),
    ApplyExecuteRecords: () => import('../ApplyExecuteRecords'),
    VacationDescriptionContent: () =>
      import('@/components/Vacation/VacationDescriptionContent'),
    VacAdditionalTags: () => import('@/components/Vacation/VacAdditionalTags')
  },
  props: {
    showUser: { type: Boolean, default: true },
    showComment: { type: Boolean, default: true },
    canShow: { type: Boolean, default: true },
    focusId: { type: String, default: null }
  },
  data: () => ({
    id: null,
    entityType: 'vacation',
    route_id: null,
    detail: {},
    show_share: false,
    loading: false,
    showMyApplies: false,
    show_previous: true,
    staticData: {
      vacationLength: 0,
      vacationSpent: 0,
      vacationProgress: 0,
      vacationStart: false
    }
  }),
  computed: {
    statusDic() {
      return this.$store.state.vacation.statusDic
    },
    settle() {
      return this.detail.social.settle
    },

    percent() {
      const total = this.total
      const spent = this.spent
      if (total === 0) return 10
      if (spent < 0) return 0
      if (spent > total) return 100
      return Math.floor((spent / total) * 1e4) / 1e2
    },
    total() {
      const request = this.detail.request
      if (!request) return 1
      return 1 + datedifference(request.stampReturn, request.stampLeave)
    },
    spent() {
      const request = this.detail.request
      if (!request) return 0
      return 1 + datedifference(new Date(), request.stampLeave)
    }
  },
  watch: {
    focusId: {
      handler(val) {
        console.log('modify focusId', val)
        this.id = val
      },
      immediate: true
    },
    route_id(val) {
      if (this.focusId !== null) return
      console.log('modify routeId', val)
      this.id = val
    },
    id: {
      handler(val) {
        this.updateDetail()
      },
      immediate: true
    },
    canShow: {
      handler(val) {
        this.updateDetail()
      }
    }
  },
  mounted() {
    if (!this.$route || !this.$route.query) return
    this.route_id = this.$route.query.id
  },
  methods: {
    onFormExpand(v) {
      this.show_previous = !v
    },
    parseTime(date) {
      return parseTime(new Date(date), '{y}年{m}月{d}日')
    },
    datedifference,
    updateDetail() {
      if (this.id && this.canShow) {
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
    loadDetail(id) {
      this.loading = true
      this.detail = null
      const entityType = this.entityType
      const loadDetail = detail({ id, entityType }).then(data => {
        data.request = data.requestInfo
        if (data.request) {
          data.stampReturn = new Date(data.request.stampReturn)
          data.stampLeave = new Date(data.request.stampLeave)
        }
        data.type = get_item_type(data)
        this.detail = data
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
.description-layout {
  width: 350px;
  margin-top: 0.5rem;
  margin-left: 3rem;
}
@mixin content-card-base() {
}
.content-card-first {
  @include content-card-base;
}

.content-card {
  margin-top: 20px;
  @include content-card-base;
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
<style scoped lang="scss">
.ribbon-container {
  overflow: hidden;
  position: relative;
}

.ribbon-entity {
  right: -3rem;
  top: 2rem;
  background-color: #5bb1f9;
  overflow: hidden;
  white-space: nowrap;
  box-shadow: 0 0 10px #999999;
  position: absolute;
  transform: rotate(45deg);
}

.ribbon-entity span {
  border: 1px solid #5ea3f7;
  text-align: center;
  color: #fff;
  display: block;
  text-shadow: 0 0 5px #555555;
  margin: 1px 0;
  padding: 5px 50px;
}
</style>
