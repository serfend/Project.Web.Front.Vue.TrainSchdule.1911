<template>
  <div v-if="form&&form.company">
    <el-form-item prop="company" label="单位" style="width:25.2rem">
      <CompanySelector v-model="form.company" :placeholder="form.company.name||'仅当前登录的用户的单位可见'" />
    </el-form-item>
    <el-form-item prop="duties" label="职务">
      <el-tooltip content="需选用下拉框中的建议" placement="right">
        <DutiesSelector v-model="form.duties" class="inline-input" placeholder="请输入并选中职务名称" />
      </el-tooltip>
    </el-form-item>
    <el-form-item prop="title" label="职务等级">
      <el-tooltip content="需选用下拉框中的建议" placement="right">
        <el-autocomplete
          v-model="form.title.name"
          class="inline-input"
          :fetch-suggestions="companyTitleQuery"
          style="width:14rem"
          placeholder="请输入并选中职务等级"
        />
      </el-tooltip>
    </el-form-item>
    <el-form-item prop="titleDate" label="等级时间">
      <el-date-picker
        v-model="form.titleDate"
        placeholder="职务等级生效时间"
        format="yyyy年MM月dd日"
        value-format="yyyy-MM-dd"
        style="width:14rem"
      />
    </el-form-item>
    <el-form-item prop="disableVacation" label="附加项">
      <el-radio-group v-model="disabledVacation" @change="selectDisabledVacation">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
      <i class="el-icon-info" style="color:#33c">{{ $t('register.company.disabledVacation') }}</i>
    </el-form-item>
  </div>
</template>

<script>
const createForm = () => ({
  company: {},
  duties: {},
  title: {},
})
const Const_DisabledVacation = 4
import CompanySelector from '@/components/Company/CompanySelector'
import DutiesSelector from '@/components/Duty/DutiesSelector'
import { companyChild, companyTitleQuery } from '@/api/company'
export default {
  name: 'Company',
  components: {
    CompanySelector,
    DutiesSelector,
  },
  props: {
    form: {
      type: Object,
      default: createForm(),
    },
  },
  data: () => ({
    disabledVacation: null,
  }),
  watch: {
    'form.company.accountStatus': {
      handler(val) {
        if (val === undefined) {
          this.disabledVacation = null
          return
        }
        this.disabledVacation = !!(val & Const_DisabledVacation)
      },
      immediate: true,
    },
  },
  methods: {
    companyChild,
    async companyTitleQuery(queryString, cb) {
      var data = await companyTitleQuery(queryString)
      await this.queryItem(data, cb)
    },
    async queryItem(data, cb) {
      var list = data.list
      var result = list.map((item) => {
        return {
          value: item.name,
          code: item.code,
        }
      })
      cb(result)
    },
    selectDisabledVacation(select) {
      const d = Object.assign({}, this.form)
      d.disabledVacation = select
      this.$emit('update:form', d)
    },
  },
}
</script>

<style>
</style>
