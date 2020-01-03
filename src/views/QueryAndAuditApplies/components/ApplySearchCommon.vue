<template>
  <el-form
    ref="innerTableForm"
    :model="innerTableForm"
    label-width="90px"
    :inline="true"
    size="small"
    @submit.native.prevent
  >
    <el-form-item label="审核单位" prop="auditByCompany">
      <cascader-selector :code.sync="queryForm.auditByCompany" :child-getter-method="companyChild" />
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
    <el-form-item label="休假开始时间" label-width="120" prop="stampLeaveTime">
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

    <el-form-item v-show="fullui" label="休假结束时间" label-width="120" prop="stampReturnTime">
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
    <el-row />
    <el-col v-show="fullui" :lg="24">
      <el-button-group style="width:100%">
        <el-button type="info" style="width:19%" icon="el-icon-delete" @click="clearForm">清空查询</el-button>
        <el-button
          type="primary"
          icon="el-icon-search"
          style="width:80%"
          :loading="onLoading"
          autofocus
          @click="searchData"
        >执行查询</el-button>
      </el-button-group>
    </el-col>
  </el-form>
</template>

<script>
import { companyChild } from '@/api/company'
import CascaderSelector from '@/components/CascaderSelector'
import { queryList } from '@/api/apply'

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
        auditByCompany: '', // 审核单位
        createCompany: '' // 申请单位
      },
      innerTableForm: {
        pages: {
          pageIndex: 0,
          pageSize: 20,
          totalCount: 0
        }
      }
    }
  },
  computed: {
    statusOptions() {
      return this.$store.state.vocation.statusDic
    }
  },
  watch: {
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
    clearForm() {
      this.$refs.innerTableForm.resetFields()
    },
    searchData() {
      var f = this.innerTableForm
      f.create = this.formatData_DateTime(this.queryForm.createTime)
      f.stampLeave = this.formatData_DateTime(this.queryForm.stampLeaveTime)
      f.stampReturn = this.formatData_DateTime(this.queryForm.stampReturnTime)
      f.status = {
        arrays:
          this.queryForm.status && this.queryForm.status.length > 0
            ? this.queryForm.status
            : null
      }
      f.auditByCompany = { value: this.auditByCompany } // 审核单位
      f.createCompany = { value: this.createCompany } // 申请单位
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
