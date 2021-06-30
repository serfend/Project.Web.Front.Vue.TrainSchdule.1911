<template>
  <el-form
    v-if="queryForm"
    :class="classItem"
    :style="{right:panel_right}"
    @mouseenter.native="panelMouseEnter"
    @mouseleave.native="panelMouseLeave"
  >
    <Flip v-model="isFlip" width="100%" height="100%">
      <template #front>
        <div style="width:35rem">
          <el-button
            type="danger"
            :style="{transform: btnExitTransform}"
            @click="panel_out(false)"
          >关闭</el-button>
          <el-tabs v-model="active_pane" type="border-card">
            <el-tab-pane label="状态">
              <el-form-item label>
                <el-tooltip effect="light" content="仅单位的管理和数据分析人员需进行条件查询，其他人员默认将查询到本人可审批的申请">
                  <el-switch
                    v-model="adminQuery"
                    style="margin:0px 20px"
                    active-text="管理查询"
                    inactive-text="一般查询"
                    @change="requireSearchData"
                  />
                </el-tooltip>
              </el-form-item>
              <el-form-item v-show="!adminQuery" label="我的审核">
                <el-select
                  v-model="queryForm.actionStatus"
                  class="full-width"
                  placeholder="选择审核状态"
                  clearable
                >
                  <el-option
                    v-for="item in myAuditActionDic"
                    :key="item.code"
                    :label="item.desc"
                    :value="item.code"
                  >
                    <span :style="{'float': 'left','color':item.color}">{{ item.desc }}</span>
                    <span style="float: right; color: #e0e0e0; font-size: 10px">{{ item.code }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="onFilterAccept" label="落实状态">
                <el-select
                  v-if="executeStatus"
                  v-model="queryForm.executeStatus"
                  class="full-width"
                  placeholder="选择确认时间情况"
                  clearable
                >
                  <el-option
                    v-for="(item,i) in Object.keys(executeStatus).map(s=>executeStatus[s])"
                    :key="i"
                    :value="item.value"
                    :label="item.alias"
                  >
                    <div v-if="item">
                      <span :style="{'float': 'left','color':item.color}">{{ item.alias }}</span>
                      <span style="float: right; color: #e0e0e0; font-size: 10px">{{ item.value }}</span>
                    </div>
                    <div v-else>未知项{{ Object.keys(executeStatus)[i] }}</div>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="审核状态">
                <el-select
                  v-model="queryForm.status"
                  class="full-width"
                  placeholder="选择审核状态"
                  multiple
                  clearable
                >
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.code"
                    :label="item.desc"
                    :value="item.code"
                  >
                    <span :style="{'float': 'left','color':item.color}">{{ item.desc }}</span>
                    <span style="float: right; color: #f0f0f0; font-size: 10px">{{ item.code }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="hasRequestType" label="填报类型">
                <el-radio-group v-model="queryForm.mainStatus">
                  <el-radio :label="-1">不限</el-radio>
                  <el-radio :label="0">正式填报</el-radio>
                  <el-radio :label="2">填报计划休假</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane v-if="adminQuery" :disabled="!adminQuery" label="人员">
              <el-form-item label="审核人">
                <UserSelector
                  :code.sync="queryForm.auditBy"
                  default-info="搜索成员"
                  style="display:inline"
                />
              </el-form-item>
              <el-form-item label="当前审核人">
                <UserSelector
                  :code.sync="queryForm.nowAuditBy"
                  default-info="搜索成员"
                  style="display:inline"
                />
              </el-form-item>
              <el-form-item label="创建人">
                <UserSelector
                  :code.sync="queryForm.createFor"
                  default-info="搜索成员"
                  style="display:inline"
                />
              </el-form-item>
              <el-form-item label="已婚">
                <el-tooltip content="测试功能,暂不稳定">
                  <i class="el-icon-info blue--text" />
                </el-tooltip>
                <el-switch v-model="queryForm.isMarried" />
              </el-form-item>
              <el-form-item v-if="queryForm.isMarried" label="分居">
                <el-tooltip content="测试功能,暂不稳定">
                  <i class="el-icon-info blue--text" />
                </el-tooltip>
                <el-switch v-model="queryForm.isApart" />
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane v-if="adminQuery" :disabled="!adminQuery" label="单位">
              <el-form-item v-show="adminQuery" id="companiesSelector" label="来自单位">
                <CompaniesSelector ref="companiesSelector" v-model="queryForm.CreateCompanyItem" />
              </el-form-item>
              <el-form-item label="单位类别">
                <CompanyTagSelector v-model="queryForm.companyType" />
              </el-form-item>
              <el-form-item label="职务类别">
                <DutiesSelector :tag.sync="queryForm.dutiesType" :only-tag="true" />
              </el-form-item>
              <el-form-item label="偏远单位">
                <el-tooltip content="测试功能,暂不稳定">
                  <i class="el-icon-info blue--text" />
                </el-tooltip>
                <el-switch v-model="queryForm.isRemote" />
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane v-if="adminQuery" :disabled="!adminQuery" label="申请内容">
              <el-form-item v-show="adminQuery" label="创建时间">
                <el-date-picker
                  v-model="queryForm.createTime"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy年MM月dd日"
                  value-format="yyyy-MM-dd"
                  clearable
                />
              </el-form-item>
              <el-form-item v-show="adminQuery" label="离队时间" label-width="120">
                <el-tooltip effect="light" content="注意需要选中一个时间范围，例如5月2日到5月12日">
                  <el-date-picker
                    v-model="queryForm.stampLeaveTime"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy年MM月dd日"
                    value-format="yyyy-MM-dd"
                    clearable
                  />
                </el-tooltip>
              </el-form-item>
              <el-form-item v-show="adminQuery" label="归队时间" label-width="120">
                <el-date-picker
                  v-model="queryForm.stampReturnTime"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy年MM月dd日"
                  value-format="yyyy-MM-dd"
                  clearable
                />
              </el-form-item>
              <el-form-item v-show="adminQuery" label="去向">
                <CascaderSelector
                  v-model="queryForm.vacationAdminDivision"
                  :child-getter-method="locationChildren"
                  :value-name="'code'"
                  :label-name="'name'"
                  style="width:30rem"
                />
              </el-form-item>
              <el-form-item v-show="adminQuery" label="申请次数范围">
                <el-slider
                  v-model="queryForm.requestCounts"
                  range
                  show-stops
                  :max="nowCountsMax"
                  style="width:80%;float:right"
                />
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane v-if="adminQuery" :disabled="!adminQuery" label="授权码">
              <AuthCode v-show="adminQuery" :form.sync="queryForm.auth" select-name="申请搜索" />
            </el-tab-pane>
          </el-tabs>
          <el-row style="margin:0.5rem">
            <el-col v-show="adminQuery" :lg="24">
              <el-button-group style="width:100%">
                <el-button
                  type="info"
                  style="width:19%"
                  icon="el-icon-delete"
                  @click="clearForm"
                >清空查询</el-button>
                <el-button
                  type="success"
                  icon="el-icon-search"
                  style="width:40%"
                  :loading="onLoading"
                  autofocus
                  @click="requireSearchData"
                >筛选/刷新</el-button>
                <el-button
                  type="primary"
                  icon="el-icon-download"
                  style="width:40%"
                  :loading="onLoading"
                  @click="exportAppliesNowFilter"
                >导出当前查询</el-button>
              </el-button-group>
            </el-col>
            <el-col v-show="!adminQuery" :lg="24">
              <el-button type="info" icon="el-icon-delete" @click="clearForm">清空查询</el-button>
              <el-button
                type="success"
                :icon="onLoading?'el-icon-loading':'el-icon-refresh-right'"
                @click="requireSearchData"
              >刷新</el-button>
            </el-col>
          </el-row>
        </div>
      </template>
      <template #back>
        <el-card style="width:35rem">
          <div style="text-align:center;height:10rem">
            <span style="font-size:24px;font-weight:600;">切换到{{ adminQuery?'管理查询':'一般查询' }}</span>
            <el-divider />
            <el-button
              type="text"
              style="position: absolute;left: 0.5rem;top: 0;"
              @click="isFlip=false"
            >返回查询</el-button>
            <div v-if="adminQuery">
              <p>包含多个条件筛选的选项卡，您可以在其中设置不同的查询条件</p>
              <p>
                注意即使页面被关闭，搜索条件也将会被保存。如需重新选择筛选条件，可点击
                <el-button type="text" @click="clearForm">清空搜索</el-button>按钮
              </p>
            </div>
            <span v-else>
              <p>您可查询您本人相关的申请审批</p>
            </span>
          </div>
        </el-card>
      </template>
    </Flip>
  </el-form>
</template>

<script>
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import {
  queryList,
  queryListId,
  queryMyAudit,
  createQueryApplyModel
} from '@/api/apply/query'
import { locationChildren } from '@/api/common/static'
import { debounce } from '@/utils'
import { FormRecorder } from '@/utils/form'
export default {
  Name: 'ApplySearchCommon',
  components: {
    Flip: () => import('vue-flip'),
    CascaderSelector: () => import('@/components/CascaderSelector'),
    CompaniesSelector: () => import('@/components/Company/CompaniesSelector'),
    CompanyTagSelector: () => import('@/components/Company/CompanyTagSelector'),
    AuthCode: () => import('@/components/AuthCode'),
    UserSelector: () => import('@/components/User/UserSelector'),
    DutiesSelector: () => import('@/components/Duty/DutiesSelector')
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    pages: {
      type: Object,
      default() {
        return this.innerPages
      }
    },
    entityType: { type: String, default: 'vacation' }
  },
  data: () => ({
    myAuditActionDic: [
      { code: 'Received', desc: '等待我审核的' },
      { code: '', desc: '所有申请' },
      { code: 'UnReceive', desc: '未轮到我审核的' },
      { code: 'Accept', desc: '同意的' },
      { code: 'Deny', desc: '驳回的' }
    ],
    onLoading: false,
    onFormModifying: false,
    queryForm: null,
    queryFormRecord: false,
    innerPages: {
      pageIndex: 0,
      pageSize: 20
    },
    adminQuery: false, // 管理人员查询，默认将仅查询本人可审批的人
    isFlip: false,
    panel_right: '-30rem',
    panel_should_out: false,
    checker: null,
    active_pane: '0',
    driver: null,
    classItem: 'float-panel flashing',
    btnExitTransform: null
  }),
  computed: {
    nowCountsMax() {
      const v = (this.queryForm.requestCounts[1] * 1.2 + 1) / 5
      return Math.ceil(v) * 5
    },
    onFilterAccept() {
      return this.queryForm.status.indexOf(100) > -1
    },
    requireSearchData() {
      return debounce(() => {
        this.searchData()
      }, 200)
    },
    executeStatus() {
      return this.$store.state.vacation.executeStatus
    },
    statusOptions() {
      return this.$store.state.vacation.statusDic
    },
    currentUserId() {
      return this.$store.state.user.userid
    },
    currentUserCmp() {
      return this.$store.state.user.companyid
    },
    hasRequestType() {
      return this.entityType === 'vacation'
    }
  },
  watch: {
    adminQuery(val) {
      this.requireFlip()
      if (!val) {
        this.active_pane = '0'
      }
    },
    onLoading(val) {
      this.$emit('update:loading', val)
    },
    currentUserCmp(val) {
      const s = this.queryForm
      if (!s.CreateCompanyItem || s.CreateCompanyItem.length === 0) {
        s.CreateCompanyItem = [{ code: val }]
      }
    },
    queryForm: {
      handler(val) {
        this.innerPages.pageIndex = 0 // reset page if form modify
        const item = this.queryForm.CreateCompanyItem || []
        const codes = item.map(i => i.code)
        if (
          JSON.stringify(codes) !== JSON.stringify(this.queryForm.createCompany)
        ) {
          this.queryForm.createCompany = codes
        }
        this.queryFormRecord.setRecord(this.queryForm)
        this.requireSearchData()
      },
      deep: true
    },
    pages: {
      handler(val) {
        if (val) {
          this.innerPages = val
          this.requireSearchData()
        } else this.$emit('update:pages', this.innerPages)
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.queryFormRecord = new FormRecorder(
      'applySearchCommon.lastQuery',
      this.createQueryForm()
    )
    const tmp = this.queryFormRecord.getRecord()
    if (tmp) {
      tmp.actionStatus = 'Received' // 默认查询待我审核的
      this.queryForm = tmp
    }
    if (!this.queryForm) this.clearForm()
    this.queryFormStartRecord = true
    this.driver = new Driver({
      closeBtnText: '我知道了'
    })
  },
  methods: {
    locationChildren,
    checkPanelStatus() {
      if (this.panel_should_out) {
        this.panel_right = '0'
        this.btnExitTransform = ''
        return
      }
      this.panel_right = '-30rem'
      this.btnExitTransform = 'translateY(2rem) scale(0.5)'
    },
    panel_out(out, delay) {
      this.panel_should_out = !!out
      if (!delay) this.checkPanelStatus()
      if (this.checker) clearTimeout(this.checker)
      this.checker = setTimeout(() => {
        this.checkPanelStatus()
      }, delay)
    },
    requireFlip() {
      this.isFlip = true
      this.panel_out(true)
      this.panel_out(false, 10e3)
      setTimeout(() => {
        this.isFlip = false
      }, 5e3)
    },
    panelMouseLeave() {
      this.panel_out(false, 2e3)
    },
    panelMouseEnter() {
      this.panel_out(true)
      this.removeFlashing()
    },
    removeFlashing() {
      this.classItem = this.classItem.replace(' flashing', '')
    },
    exportAppliesNowFilter() {
      this.$emit('exportApplies')
    },
    clearForm() {
      this.queryForm = this.createQueryForm()
    },
    handleSearchedData(data) {
      const list = data.list || []
      this.$emit('update:list', list)
      // this.$emit('update:pages', f.pages)
      this.$emit('update:pagesTotalCount', data.totalCount)
    },
    createQueryForm() {
      return {
        _version: 5,
        createTime: null,
        stampLeaveTime: null,
        stampReturnTime: null,
        status: [], // 状态
        mainStatus: -1,
        actionStatus: 'Received', // 我的状态
        auditBy: null,
        nowAuditBy: null,
        createFor: null,
        CreateCompanyItem: null,
        createCompany: [], // 申请单位
        dutiesType: null,
        companyType: null,
        vacationAdminDivision: null,
        requestCounts: [0, 0], // 指定时间范围内次数
        requestCountsDate: null,
        auth: {
          authByUserId: '',
          code: ''
        }
      }
    },
    searchData(userAct, callback, pages, only_id) {
      // if (!userAct && this.onFormModifying) {
      //   this.$message.error('操作太快啦,歇歇吧~')
      //   return
      // }
      const data = this.queryForm
      if (!data.isMarried) data.isApart = false
      if (!this.onFilterAccept && data.executeStatus != null) {
        data.executeStatus = null
        return
      }
      callback = callback || this.handleSearchedData
      this.onFormModifying = true
      this.onLoading = true
      pages = pages || this.innerPages
      const entityType = this.entityType
      const f = createQueryApplyModel({
        data,
        entityType,
        pages,
        auth: data.auth
      })
      // 仅管理员进行自定义查询，其余时候仅加载当前用户可审批人
      const { status, actionStatus, executeStatus } = data
      let action
      if (this.adminQuery) {
        action = only_id ? queryListId(f) : queryList(f)
      } else {
        action = queryMyAudit({
          pages: f.pages,
          status,
          actionStatus,
          executeStatus,
          entityType: this.entityType
        })
      }
      action
        .then(data => {
          callback(data)
        })
        .catch(e => {
          if (e.status === 12100) {
            this.active_pane = '2'
            this.$refs.companiesSelector.$el.click()
            setTimeout(() => {
              const steps = [
                {
                  element: '#companiesSelector',
                  popover: {
                    title: '选取单位',
                    description:
                      '此处显示的单位仅为用户单位树可见项，不代表有权限项。如需访问请联系管理人员授权。'
                  }
                }
              ]
              this.driver.defineSteps(steps)
              this.driver.start()
            }, 500)
          }
        })
        .finally(() => {
          this.onLoading = false
          setTimeout(() => {
            this.onFormModifying = false
          }, 1000)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.float-panel {
  bottom: 30rem;
  float: right;
  position: fixed;
  z-index: 999;
  width: 35rem;
  box-shadow: 0 2px 4px 0 #0000008a, 0 0 6px 0 #0000003c;
  transition: all ease 0.5s;
  opacity: 0.3;
  &:hover {
    opacity: 1;
  }
}
@import '@/styles/animation';
</style>
