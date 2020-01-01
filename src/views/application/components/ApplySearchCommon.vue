<template>
  <el-form
    ref="innerTableForm"
    :model="innerTableForm"
    label-width="90px"
    :inline="true"
    size="small"
    @submit.native.prevent
  >
    <el-form-item label="申请人" prop="createFor.value">
      <el-input
        v-model="innerTableForm.createFor.value"
        placeholder
        class="mr10"
        maxlength="40"
        clearable
      />
    </el-form-item>
    <el-form-item label="创建人" prop="createBy.value">
      <el-input
        v-model="innerTableForm.createBy.value"
        placeholder
        class="mr10"
        maxlength="40"
        clearable
      />
    </el-form-item>
    <el-form-item label="审核人" prop="auditBy.value">
      <el-input
        v-model="innerTableForm.auditBy.value"
        placeholder
        class="mr10"
        maxlength="40"
        clearable
      />
    </el-form-item>
    <el-form-item label="审核单位" prop="auditByCompany.value">
      <cascader-selector
        :code.sync="innerTableForm.auditByCompany.value"
        :child-getter-method="companyChild"
      />
    </el-form-item>
    <el-form-item label="来自单位" prop="createCompany.value">
      <cascader-selector
        :code.sync="innerTableForm.createCompany.value"
        :child-getter-method="companyChild"
      />
    </el-form-item>
    <el-form-item label="审核状态" prop="status.arrays">
      <el-select
        v-model="innerTableForm.status.arrays"
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
        />
      </el-select>
    </el-form-item>
    <el-form-item label="创建时间" prop="addTime">
      <el-date-picker
        v-model="innerTableForm.addTime"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        clearable
      />
    </el-form-item>
    <el-form-item label="休假开始时间" label-width="120" prop="stampLeaveTime">
      <el-date-picker
        v-model="innerTableForm.stampLeaveTime"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        clearable
      />
    </el-form-item>

    <el-form-item label="休假结束时间" label-width="120" prop="stampReturnTime">
      <el-date-picker
        v-model="innerTableForm.stampReturnTime"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        clearable
      />
    </el-form-item>
    <el-row />
    <slot name="ExtendForm" />
    <el-col :lg="24">
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
export default {
  components: { CascaderSelector },
  props: {
    onLoading: {
      type: Boolean,
      default: false
    },
    tableForm: {
      type: Object,
      default() {
        return this.innerTableForm
      }
    }
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      innerTableForm: {
        pages: {
          pageIndex: 0,
          pageSize: 20
        },
        code: '',
        addTime: '',
        stampLeaveTime: '',
        stampReturnTime: '',
        status: { status: '', end: '', arrays: [] },
        create: { start: '', end: '' },
        createFor: { value: '' },
        createBy: { value: '' },
        auditBy: { value: '' },
        auditByCompany: { value: '' },
        createCompany: { value: '' }
      }
    }
  },
  computed: {
    statusOptions() {
      return this.$store.state.vocation.statusDic
    }
  },
  watch: {
    innerTableForm: {
      handler(val, oldVal) {
        this.$emit('update:tableForm', val)
      },
      deep: true
    }
  },
  methods: {
    companyChild(id) {
      return companyChild(id)
    },
    clearForm() {
      this.$refs.innerTableForm.resetFields()
    },
    searchData() {
      this.$emit('searchData', this.tableForm)
    }
  }
}
</script>
