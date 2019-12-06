<template>
  <el-form
    ref="tableForm"
    :model="tableForm"
    label-width="90px"
    :inline="true"
    size="small"
    @submit.native.prevent
  >
    <el-form-item label="申请人" prop="createFor.value">
      <el-input
        v-model="tableForm.createFor.value"
        placeholder
        class="mr10"
        maxlength="40"
        clearable
      />
    </el-form-item>
    <el-form-item label="创建人" prop="createBy.value">
      <el-input
        v-model="tableForm.createBy.value"
        placeholder
        class="mr10"
        maxlength="40"
        clearable
      />
    </el-form-item>
    <el-form-item label="审核人" prop="auditBy.value">
      <el-input v-model="tableForm.auditBy.value" placeholder class="mr10" maxlength="40" clearable />
    </el-form-item>
    <el-form-item label="审核单位" prop="auditByCompany.value">
      <el-input
        v-model="tableForm.auditByCompany.value"
        placeholder
        class="mr10"
        maxlength="40"
        clearable
      />
    </el-form-item>
    <el-form-item label="审核状态" prop="status.arrays">
      <el-select
        v-model="tableForm.status.arrays"
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
        v-model="tableForm.addTime"
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
        v-model="tableForm.stampLeaveTime"
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
        v-model="tableForm.stampReturnTime"
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
    <el-form-item>
      <el-button type="primary" @click="clearForm">清空</el-button>
      <el-button type="primary" @click="searchData">查询</el-button>
    </el-form-item>
    <slot name="ExtendForm" />
  </el-form>
</template>

<script>
import { getAllStatus } from '../../../api/apply'
export default {
  props: {
    tableForm: {
      type: Object,
      default() {
        return {
          pages: {
            pageIndex: 0,
            pageSize: 20
          },
          code: '',
          addTime: '',
          stampLeaveTime: '',
          stampReturnTime: '',
          status: {
            status: '',
            end: '',
            arrays: []
          },
          create: {
            start: '',
            end: ''
          },
          createFor: {
            value: ''
          },
          createBy: {
            value: ''
          },
          auditBy: {
            value: ''
          },
          auditByCompany: {
            value: ''
          },
          stampLeave: {
            start: '',
            end: ''
          },
          stampReturn: {
            start: '',
            end: ''
          }
        }
      }
    }
  },
  data() {
    return {
      statusOptions: [],
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
      }
    }
  },
  created() {
    getAllStatus().then(status => {
      console.log(status)
      if (status.list) {
        this.statusOptions = status.list
      }
    })
  },
  methods: {
    clearForm() {
      this.$refs.tableForm.resetFields()
    },
    searchData() {
      this.$emit('searchData', this.tableForm)
    }
  }
}
</script>
