<template>
  <div>
    <el-form-item prop="company" label="单位" style="width:400px">
      <CompanySelector
        v-model="innerForm.company"
        :placeholder="innerForm.company.name||'仅当前登录的用户的单位可见'"
      />
    </el-form-item>
    <el-form-item prop="duties" label="职务">
      <el-tooltip content="需选用下拉框中的建议" placement="right">
        <el-autocomplete
          v-model="innerForm.duties.name"
          class="inline-input"
          :fetch-suggestions="dutiesQuery"
          placeholder="请输入并选中职务名称"
          @select="handleDutiesSelect"
        />
      </el-tooltip>
    </el-form-item>
    <el-form-item prop="title" label="职务等级">
      <el-tooltip content="需选用下拉框中的建议" placement="right">
        <el-autocomplete
          v-model="innerForm.title.name"
          class="inline-input"
          :fetch-suggestions="companyTitleQuery"
          placeholder="请输入并选中职务等级"
          @select="handleDutiesSelect"
        />
      </el-tooltip>
    </el-form-item>
    <el-form-item prop="titleDate" label="职务等级时间">
      <el-date-picker
        v-model="innerForm.titleDate"
        placeholder="职务等级生效时间"
        format="yyyy年MM月dd日"
        value-format="yyyy-MM-dd"
      />
    </el-form-item>
  </div>
</template>

<script>
import CompanySelector from '@/components/Company/CompanySelector'
import { companyChild, dutiesQuery, companyTitleQuery } from '@/api/company'
export default {
  name: 'Company',
  components: {
    CompanySelector
  },
  props: {
    form: {
      type: Object,
      default() {
        return this.innerForm
      }
    }
  },
  data() {
    return {
      innerForm: {
        company: {
          code: 'root'
        },
        duties: {
          name: ''
        },
        title: {
          name: ''
        },
        titleDate: ''
      },
      invalid: {
        company: {
          status: false,
          des: ''
        },
        duties: {
          status: false,
          des: ''
        }
      }
    }
  },
  watch: {
    form: {
      handler(val) {
        if (!val.company) return
        this.innerForm = val
        if (this.innerForm.id) delete this.innerForm.id
      },
      deep: true,
      immediate: true
    },
    innerForm: {
      handler(val, oldVal) {
        this.$emit('update:form', val)
      },
      deep: true
    }
  },
  methods: {
    companyChild,
    async dutiesQuery(queryString, cb) {
      var data = await dutiesQuery(queryString)
      await this.queryItem(data, cb)
    },
    async companyTitleQuery(queryString, cb) {
      var data = await companyTitleQuery(queryString)
      await this.queryItem(data, cb)
    },
    async queryItem(data, cb) {
      var list = data.list
      var result = list.map(item => {
        return {
          value: item.name,
          code: item.code
        }
      })
      cb(result)
    },
    handleDutiesSelect(item) {
      console.log(item)
    }
  }
}
</script>

<style>
</style>
