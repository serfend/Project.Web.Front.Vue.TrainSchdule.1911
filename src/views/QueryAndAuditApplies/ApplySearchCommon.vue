<template>
  <el-form
    ref="queryForm"
    :model="queryForm"
    label-width="90px"
    :inline="true"
    size="small"
    @submit.native.prevent
  >
    <el-switch v-model="innerfullui" active-text="高级查询" />
    <el-switch
      v-show="currentUserId"
      v-model="onlySeeSelfApplies"
      active-text="仅看我的"
      @change="searchData"
    />
    <el-form-item label="审核单位" prop="nowAuditByCompany">
      <cascader-selector
        :code.sync="queryForm.nowAuditByCompany"
        :placeholder="queryForm.nowAuditByCompanyName"
        :child-getter-method="companyChild"
        @select-change="hdlNowAuditCompanyChange"
      />
    </el-form-item>
    <el-form-item label="来自单位" prop="createCompany">
      <cascader-selector
        :code.sync="queryForm.createCompany"
        :placeholder="queryForm.createCompanyName"
        :child-getter-method="companyChild"
        @select-change="hdlCreateCompanyChange"
      />
    </el-form-item>
    <el-form-item label="审核状态" prop="status">
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
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-show="fullui" label="创建时间" prop="createTime">
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
    <el-form-item label="离队时间" label-width="120" prop="stampLeaveTime">
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
    </el-form-item>
    <el-form-item v-show="fullui" label="归队时间" label-width="120" prop="stampReturnTime">
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
    <el-form-item v-show="fullui" label="涉及单位" prop="auditByCompany">
      <cascader-selector
        :code.sync="queryForm.auditByCompany"
        :placeholder="queryForm.auditByCompanyName"
        :child-getter-method="companyChild"
        @select-change="hdlAuditByCompanyChange"
      />
    </el-form-item>
    <el-row>
      <el-col v-show="fullui" :lg="24">
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
</template>

<script>
import { companyChild } from '@/api/company'
import CascaderSelector from '@/components/CascaderSelector'
import { queryList } from '@/api/apply'
import { exportMultiApplies } from '@/api/static'
export default {
  Name: 'ApplySearchCommon',
  components: { CascaderSelector },
  props: {
    list: {
      type: Array,
      default() {
        return this.innerList
      }
    },
    pages: {
      type: Object,
      default() {
        return this.innerTableForm.pages
      }
    },
    fullui: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      onLoading: false,
      loadingDate: '',
      innerList: [],
      queryForm: {
        createTime: null,
        stampLeaveTime: null,
        stampReturnTime: null,
        status: [], // 状态
        nowAuditByCompany: '', // 当前审核的单位
        nowAuditByCompanyName: '',
        auditByCompany: '', // 可能需要审核的单位
        auditByCompanyName: '',
        createCompany: '', // 申请单位
        createCompanyName: ''
      },
      queryFormStartRecord: false,
      innerTableForm: {
        pages: {
          pageIndex: 0,
          pageSize: 20,
          totalCount: 0
        }
      },
      innerfullui: false,
      onlySeeSelfApplies: false // 仅查询当前用户的申请
    }
  },
  computed: {
    statusOptions() {
      return this.$store.state.vocation.statusDic
    },
    currentUserId() {
      return this.$store.state.user.userid
    }
  },
  watch: {
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
    innerList: {
      handler(val) {
        this.$emit('update:list', val)
      },
      deep: true,
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
        if (val.totalCount) {
          this.innerTableForm.pages = val
          this.searchData()
        } else this.$emit('update:pages', this.innerTableForm.pages)
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    var tmpItem = localStorage.getItem('applySearchCommon.lastQuery')
    var tmp = JSON.parse(tmpItem)
    if (tmp) this.queryForm = tmp
    this.queryFormStartRecord = true
  },
  methods: {
    companyChild,
    setFormRecord() {
      if (this.queryFormStartRecord) {
        localStorage.setItem(
          'applySearchCommon.lastQuery',
          JSON.stringify(this.queryForm)
        )
      }
    },
    hdlNowAuditCompanyChange(val) {
      this.queryForm.nowAuditByCompanyName = val
      this.setFormRecord()
    },
    hdlAuditByCompanyChange(val) {
      this.queryForm.auditByCompanyName = val
      this.setFormRecord()
    },
    hdlCreateCompanyChange(val) {
      this.queryForm.createCompanyName = val
      this.setFormRecord()
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
      this.$refs.innerTableForm.resetFields()
    },
    createQueryPost() {
      var f = this.innerTableForm
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
      if (this.queryForm.nowAuditByCompany) {
        f.nowAuditByCompany = { value: this.queryForm.nowAuditByCompany } // 审核单位
      } else {
        f.nowAuditByCompany = null
      }
      if (this.queryForm.auditByCompany) {
        f.auditByCompany = { value: this.queryForm.auditByCompany } // 审核单位
      } else {
        f.auditByCompany = null
      }
      if (this.queryForm.createCompany) {
        f.createCompany = { value: this.queryForm.createCompany } // 申请单位
      } else {
        f.createCompany = null
      }
      if (this.onlySeeSelfApplies) {
        f.createFor = { value: this.currentUserId }
      } else {
        f.createFor = null
      }
      return f
    },
    searchData() {
      var f = this.createQueryPost()
      this.onLoading = true
      var ld = new Date()
      this.loadingDate = ld
      queryList(f)
        .then(data => {
          if (this.loadingDate !== ld) return
          this.innerList = data.list || []
          f.pages.totalCount = data.totalCount
          this.$emit('update:pages', f.pages)
        })
        .finally(() => {
          const showText = [
            '默认将查询近一个星期的申请',
            '双击表格可查看休假详情',
            '点击操作栏下方的下载按钮可以直接下载休假单',
            '只有当休假还没有被任何人审批的时候才能撤回',
            '新申请的假默认是未保存状态，并且会在1天内被删除，注意及时保存'
          ]
          var rndIndex = Math.floor(Math.random() * showText.length)
          this.$notify.info(showText[rndIndex])
          this.onLoading = false
        })
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
