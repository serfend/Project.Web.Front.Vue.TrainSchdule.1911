<template>
  <div>
    <el-card style="margin:0 0 2rem 0">
      <el-tooltip effect="light" content="仅单位的管理和数据分析人员需进行条件查询，其他人员默认将查询到本人可审批的申请">
        <el-switch
          v-model="adminQuery"
          style="margin:0px 20px"
          active-text="管理查询"
          inactive-text="一般查询"
          @change="searchData"
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
        @click="searchDataDirect(true)"
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
        <CompaniesSelector v-model="queryFormCreateCompany" />
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
            <span style="float: right; color: #f0f0f0; font-size: 10px">{{ item.code }}</span>
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
          align="right"
          unlink-panels
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          clearable
        />
      </el-form-item>
      <el-form-item v-show="adminQuery" label="离队时间" label-width="120">
        <el-tooltip effect="light" content="注意需要选中一个时间范围，例如5月2日到5月12日">
          <el-date-picker
            v-model="queryForm.stampLeaveTime"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            clearable
          />
        </el-tooltip>
      </el-form-item>
      <el-form-item v-show="fullui&&adminQuery" label="归队时间" label-width="120">
        <el-date-picker
          v-model="queryForm.stampReturnTime"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
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
              @click="searchData"
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
      lastUpdate: new Date(),
      queryFormCreateCompany: null,
      queryForm: {
        createTime: null,
        stampLeaveTime: null,
        stampReturnTime: null,
        status: [], // 状态
        actionStatus: 'Received', // 我的状态
        auditBy: null,
        nowAuditBy: null,
        createFor: null,
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
      lastQueryString: '',
      adminQuery: false, // 管理人员查询，默认将仅查询本人可审批的人
      innerfullui: false
    }
  },
  computed: {
    statusOptions() {
      return this.$store.state.vacation.statusDic
    },
    currentUserId() {
      return this.$store.state.user.userid
    }
  },
  watch: {
    adminQuery: {
      handler(val) {
        if (!val) this.innerfullui = false
      },
      immediate: true
    },
    fullui: {
      handler(val) {
        this.innerfullui = val
      }
    },
    innerfullui: {
      handler(val) {
        this.$emit('update:fullui', val)
      }
    },
    onLoading: {
      handler(val) {
        this.$emit('update:loading', val)
      },
      immediate: true
    },
    queryForm: {
      handler(val) {
        this.setFormRecord()
        this.searchData()
      },
      immediate: true,
      deep: true
    },
    queryFormCreateCompany: {
      handler(val) {
        this.queryForm.createCompany = val.map(i => i.code)
      }
    },
    pages: {
      handler(val) {
        if (val) {
          this.innerPages = val
          this.searchData()
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
      this.onLoading = true
      this.$emit('exportApplies')
      setTimeout(() => {
        this.onLoading = false
      }, 5000)
    },
    clearForm() {
      this.$refs.queryForm.resetFields()
    },
    searchData(isUserAction) {
      const lastUpdate = new Date()
      this.lastUpdate = lastUpdate
      setTimeout(() => {
        if (this.lastUpdate !== lastUpdate) return
        this.searchDataDirect(isUserAction)
      }, 500)
    },
    searchDataDirect(isUserAction) {
      const f = createQueryApplyModel(
        this.queryForm,
        this.innerPages,
        this.queryForm.auth
      )
      // 仅管理员进行自定义查询，其余时候仅加载当前用户可审批人
      const status = this.queryForm.status
      const actionStatus = this.queryForm.actionStatus
      const queryString = `${JSON.stringify(f)}${status}${actionStatus}`
      if (queryString === this.lastQueryString && !isUserAction) return
      this.lastQueryString = queryString
      const action = this.adminQuery
        ? queryList(f)
        : queryMyAudit(f.pages, status, actionStatus)
      this.onLoading = true
      action
        .then(data => {
          this.$emit('update:list', data.list || [])
          this.$emit('update:pages', f.pages)
          this.$emit('update:pagesTotalCount', data.totalCount)
        })
        .finally(() => {
          this.onLoading = false
        })
    }
  }
}
</script>
