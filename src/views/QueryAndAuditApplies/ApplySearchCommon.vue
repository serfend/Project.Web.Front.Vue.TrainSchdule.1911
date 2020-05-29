<template>
  <div>
    <el-card style="margin:0 0 20px 0">
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
      <el-switch
        v-show="currentUserId&&adminQuery"
        v-model="onlySeeSelfApplies"
        style="margin:0px 20px"
        active-text="仅自己"
        inactive-text="查看全部"
        @change="seeSelfChange"
      />
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
      <el-form-item v-show="fullui&&adminQuery" label="审核人">
        <el-autocomplete
          v-model="queryForm.auditBy"
          :fetch-suggestions="queryMember"
          style="width:100%"
          placeholder="搜索成员"
        />
      </el-form-item>
      <el-form-item v-show="fullui&&adminQuery" label="当前审核人">
        <el-autocomplete
          v-model="queryForm.nowAuditBy"
          :fetch-suggestions="queryMember"
          style="width:100%"
          placeholder="搜索成员"
        />
      </el-form-item>
      <el-form-item v-show="fullui&&adminQuery" label="创建人">
        <el-autocomplete
          v-model="queryForm.createFor"
          :fetch-suggestions="queryMember"
          style="width:100%"
          placeholder="搜索成员"
        />
      </el-form-item>
      <el-form-item v-show="adminQuery" label="来自单位">
        <cascader-selector
          :code.sync="queryForm.createCompany"
          :placeholder="queryForm.createCompanyName"
          :child-getter-method="companyChild"
        />
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
            >筛选并导出</el-button>
          </el-button-group>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getUserIdByRealName } from '@/api/user/userinfo'
import { companyChild } from '@/api/company'
import CascaderSelector from '@/components/CascaderSelector'
import { queryList, queryMyAudit } from '@/api/apply'
import { exportMultiApplies } from '@/api/common/static'
export default {
  Name: 'ApplySearchCommon',
  components: { CascaderSelector },
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
          code: 'Accept',
          desc: '同意的'
        },
        {
          code: 'Deny',
          desc: '驳回的'
        },
        {
          code: 'UnReceive',
          desc: '未轮到我审核的'
        },
        {
          code: 'Received',
          desc: '等待我审核的'
        }
      ],
      onLoading: false,
      lastUpdate: '',
      queryForm: {
        createTime: null,
        stampLeaveTime: null,
        stampReturnTime: null,
        status: [], // 状态
        actionStatus: 'Received', // 我的状态
        auditBy: '',
        nowAuditBy: '',
        createFor: '',
        createCompany: '', // 申请单位
        createCompanyName: ''
      },
      queryFormStartRecord: false,
      innerPages: {
        pageIndex: 0,
        pageSize: 20
      },
      lastQueryString: '',
      adminQuery: false, // 管理人员查询，默认将仅查询本人可审批的人
      innerfullui: false,
      onlySeeSelfApplies: false // 仅查询当前用户的申请
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
    var tmpItem = localStorage.getItem('applySearchCommon.lastQuery')
    var tmp = JSON.parse(tmpItem)
    if (tmp) {
      this.queryForm = tmp
    }
    this.queryFormStartRecord = true
  },
  methods: {
    companyChild,
    queryMember(realName, cb) {
      if (!realName) return cb([{}])
      getUserIdByRealName(realName).then(data => {
        cb(
          data.list.map(li => {
            return {
              value: li.companyName + li.dutiesName + li.realName,
              id: li.id
            }
          })
        )
      })
    },
    setFormRecord() {
      if (this.queryFormStartRecord) {
        localStorage.setItem(
          'applySearchCommon.lastQuery',
          JSON.stringify(this.queryForm)
        )
      }
    },
    exportAppliesNowFilter() {
      var f = this.createQueryPost()
      f.pages = {
        pageIndex: 0,
        pageSize: 999
      }
      exportMultiApplies('休假人员统计表.xlsx', f)
    },
    clearForm() {
      this.$refs.queryForm.resetFields()
    },

    seeSelfChange() {
      if (this.onlySeeSelfApplies) {
        this.queryForm.auditBy = ''
      }
      this.searchData()
    },
    searchData(isUserAction) {
      var lastUpdate = new Date()
      this.lastUpdate = lastUpdate
      setTimeout(() => {
        if (this.lastUpdate !== lastUpdate) return
        this.searchDataDirect(isUserAction)
      }, 500)
    },
    searchDataDirect(isUserAction) {
      var f = this.createQueryPost()
      // 仅管理员进行自定义查询，其余时候仅加载当前用户可审批人
      var status = this.queryForm.status
      var actionStatus = this.queryForm.actionStatus
      var queryString = `${JSON.stringify(f)}${status}${actionStatus}`
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
    },
    createQueryPost() {
      var f = {
        pages: Object.assign({}, this.innerPages)
      }
      f.create = this.formatData_DateTime(this.queryForm.createTime)
      f.stampLeave = this.formatData_DateTime(this.queryForm.stampLeaveTime)
      f.stampReturn = this.formatData_DateTime(this.queryForm.stampReturnTime)
      if (this.queryForm.status && this.queryForm.status.length > 0) {
        f.status = {
          arrays: this.queryForm.status
        }
      } else {
        f.status = null
      }
      if (this.queryForm.auditBy) {
        f.auditBy = { value: this.queryForm.auditBy } // 审核人
      } else {
        f.auditBy = null
      }

      if (this.queryForm.nowAuditBy) {
        f.nowAuditBy = { value: this.queryForm.nowAuditBy } // 审核人
      } else {
        f.nowAuditBy = null
      }

      if (this.queryForm.createCompany) {
        f.createCompany = { value: this.queryForm.createCompany } // 申请单位
      } else {
        f.createCompany = null
      }
      if (this.onlySeeSelfApplies) {
        f.createFor = { value: this.currentUserId }
      } else if (this.queryForm.createFor) {
        f.createFor = { value: this.queryForm.createFor }
      } else {
        f.createFor = null
      }
      return f
    },
    formatData_DateTime(datetime) {
      if (datetime && datetime[0]) {
        return {
          start: datetime[0],
          end: datetime[1]
        }
      } else {
        return null
      }
    }
  }
}
</script>
