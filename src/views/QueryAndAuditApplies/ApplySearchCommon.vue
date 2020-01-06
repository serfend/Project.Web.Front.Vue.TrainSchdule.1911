<template>
  <el-form
    ref="queryForm"
    :model="queryForm"
    label-width="90px"
    :inline="true"
    size="small"
    @submit.native.prevent
  >
    <el-switch v-model="innerfullui" />
    <el-form-item label="审核单位" prop="nowAuditByCompany">
      <cascader-selector
        :code.sync="queryForm.nowAuditByCompany"
        :child-getter-method="companyChild"
      />
    </el-form-item>
    <el-form-item label="来自单位" prop="createCompany">
      <cascader-selector :code.sync="queryForm.createCompany" :child-getter-method="companyChild" />
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
      <cascader-selector :code.sync="queryForm.auditByCompany" :child-getter-method="companyChild" />
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
      innerList: [],
      queryForm: {
        createTime: null,
        stampLeaveTime: null,
        stampReturnTime: null,
        status: [], // 状态
        nowAuditByCompany: '', // 当前审核的单位
        auditByCompany: '', // 可能需要审核的单位
        createCompany: '' // 申请单位
      },
      innerTableForm: {
        pages: {
          pageIndex: 0,
          pageSize: 20,
          totalCount: 0
        }
      },
      innerfullui: false
    }
  },
  computed: {
    statusOptions() {
      return this.$store.state.vocation.statusDic
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
  methods: {
    companyChild,
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
      return f
    },
    searchData() {
      var f = this.createQueryPost()
      this.onLoading = true
      queryList(f)
        .then(data => {
          this.innerList = data.list || []
          f.pages.totalCount = data.totalCount
          this.$emit('update:pages', f.pages)
        })
        .finally(() => {
          return (this.onLoading = false)
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
