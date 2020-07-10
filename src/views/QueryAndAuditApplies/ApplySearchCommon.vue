<template>
  <div>
    <el-card style="margin:0 0 2rem 0">
      <el-tooltip effect="light" content="仅单位的管理和数据分析人员需进行条件查询，其他人员默认将查询到本人可审批的申请">
        <el-switch
          v-model="adminQuery"
          style="margin:0px 20px"
          active-text="管理查询"
          inactive-text="一般查询"
          @change="requireSearchData"
        />
      </el-tooltip>
      <el-tooltip effect="light" content="使用更多的查询条件进行查询">
        <el-switch
          v-show="adminQuery"
          v-model="innerfullui"
          style="margin:0px 20px"
          active-text="高级查询"
          inactive-text="简要查询"
        />
      </el-tooltip>
      <el-button
        type="success"
        :icon="onLoading?'el-icon-loading':'el-icon-refresh-right'"
        circle
        style="float:right"
        @click="requireSearchData"
      />
    </el-card>
    <el-form
      ref="queryForm"
      :model="queryForm"
      label-width="90px"
      inline
      size="small"
      @submit.native.prevent
    >
      <AuthCode v-show="adminQuery" :form.sync="queryForm.auth" />
      <el-form-item v-show="fullui&&adminQuery" label="审核人">
        <UserSelector :code.sync="queryForm.auditBy" default-info="搜索成员" style="display:inline" />
      </el-form-item>
      <el-form-item v-show="fullui&&adminQuery" label="当前审核人">
        <UserSelector :code.sync="queryForm.nowAuditBy" default-info="搜索成员" style="display:inline" />
      </el-form-item>
      <el-form-item v-show="fullui&&adminQuery" label="创建人">
        <UserSelector :code.sync="queryForm.createFor" default-info="搜索成员" style="display:inline" />
      </el-form-item>
      <el-form-item v-show="adminQuery" label="来自单位">
        <CompaniesSelector v-model="queryForm.CreateCompanyItem" />
      </el-form-item>
      <el-form-item v-show="adminQuery" label="单位类别">
        <el-input v-model="queryForm.companyType" />
      </el-form-item>
      <el-form-item v-show="adminQuery" label="职务类别">
        <el-input v-model="queryForm.dutiesType" />
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
      <el-form-item v-show="fullui&&adminQuery" label="创建时间">
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
      <el-form-item v-show="fullui&&adminQuery" label="归队时间" label-width="120">
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
      <el-row>
        <el-col v-show="fullui&&adminQuery" :lg="24">
          <el-button-group style="width:100%">
            <el-button type="info" style="width:19%" icon="el-icon-delete" @click="clearForm">清空查询</el-button>
            <el-button
              type="primary"
              icon="el-icon-search"
              style="width:40%"
              :loading="onLoading"
              autofocus
              @click="requireSearchData"
            >筛选</el-button>
            <el-button
              type="primary"
              icon="el-icon-download"
              style="width:40%"
              :loading="onLoading"
              @click="exportAppliesNowFilter"
            >导出当前查询</el-button>
          </el-button-group>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import AuthCode from '@/components/AuthCode'
import CompaniesSelector from '@/components/Company/CompaniesSelector'
import UserSelector from '@/components/User/UserSelector'

import {
  queryList,
  queryMyAudit,
  createQueryApplyModel
} from '@/api/apply/query'
import { debounce } from '@/utils'
export default {
  Name: 'ApplySearchCommon',
  components: { CompaniesSelector, AuthCode, UserSelector },
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
    fullui: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      myAuditActionDic: [
        {
          code: 'Received',
          desc: '等待我审核的'
        },
        {
          code: 'UnReceive',
          desc: '未轮到我审核的'
        },
        {
          code: 'Accept',
          desc: '同意的'
        },
        {
          code: 'Deny',
          desc: '驳回的'
        }
      ],
      onLoading: false,
      onFormModifying: false,
      queryForm: {
        createTime: null,
        stampLeaveTime: null,
        stampReturnTime: null,
        status: [], // 状态
        actionStatus: 'Received', // 我的状态
        auditBy: null,
        nowAuditBy: null,
        createFor: null,
        CreateCompanyItem: null,
        createCompany: [], // 申请单位
        dutiesType: null,
        companyType: null,
        auth: {
          authByUserId: '',
          code: ''
        }
      },
      queryFormStartRecord: false,
      innerPages: {
        pageIndex: 0,
        pageSize: 20
      },
      adminQuery: false, // 管理人员查询，默认将仅查询本人可审批的人
      innerfullui: false
    }
  },
  computed: {
    onFilterAccept() {
      return this.queryForm.status.indexOf(100) > -1
    },
    requireSearchData() {
      return debounce(() => {
        this.searchData()
      }, 500)
    },
    executeStatus() {
      return this.$store.state.vacation.executeStatus
    },
    statusOptions() {
      return this.$store.state.vacation.statusDic
    },
    currentUserId() {
      return this.$store.state.user.userid
    }
  },
  watch: {
    adminQuery(val) {
      if (!val) this.innerfullui = false
    },
    fullui(val) {
      this.innerfullui = val
    },
    innerfullui(val) {
      this.$emit('update:fullui', val)
    },
    onLoading(val) {
      this.$emit('update:loading', val)
    },
    queryForm: {
      handler(val) {
        const item = this.queryForm.CreateCompanyItem || []
        const codes = item.map(i => i.code)
        if (codes.length !== this.queryForm.createCompany.length) {
          this.queryForm.createCompany = codes
        }
        this.setFormRecord()
        this.requireSearchData()
      },
      immediate: true,
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
    const tmpItem = localStorage.getItem('applySearchCommon.lastQuery')
    var tmp = JSON.parse(tmpItem)
    if (tmp) {
      this.queryForm = tmp
    }
    this.queryFormStartRecord = true
  },
  methods: {
    setFormRecord() {
      if (this.queryFormStartRecord) {
        localStorage.setItem(
          'applySearchCommon.lastQuery',
          JSON.stringify(this.queryForm)
        )
      }
    },
    exportAppliesNowFilter() {
      this.$emit('exportApplies')
    },
    clearForm() {
      this.$refs.queryForm.resetFields()
    },
    handleSearchedData(data) {
      const list = data.list || []
      this.$emit('update:list', list)
      // this.$emit('update:pages', f.pages)
      this.$emit('update:pagesTotalCount', data.totalCount)
    },
    searchData(userAct, callback, pages) {
      if (!userAct && this.onFormModifying) {
        this.$message.error('操作太快啦,歇歇吧~')
        return
      }
      const form = this.queryForm
      if (!this.onFilterAccept && form.executeStatus != null) {
        form.executeStatus = null
        return
      }
      callback = callback || this.handleSearchedData
      this.onFormModifying = true
      this.onLoading = true
      pages = pages || this.innerPages
      const f = createQueryApplyModel(form, pages, form.auth)
      // 仅管理员进行自定义查询，其余时候仅加载当前用户可审批人
      const status = form.status
      const actionStatus = form.actionStatus
      const execStatus = form.executeStatus
      const action = this.adminQuery
        ? queryList(f)
        : queryMyAudit(f.pages, status, actionStatus, execStatus)
      action
        .then(data => {
          callback(data)
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
