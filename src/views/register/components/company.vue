<template>
  <div>
    <el-form-item prop="company" label="单位">
      <cascader-selector
        :code.sync="innerForm.company.code"
        :child-getter-method="companyChild"
        :placeholder="innerForm.company.name"
      />
    </el-form-item>
    <el-form-item prop="duties" label="职务">
      <el-autocomplete
        v-model="innerForm.duties.name"
        class="inline-input"
        :fetch-suggestions="dutiesQuery"
        placeholder="请输入职务名称"
        :trigger-on-focus="false"
        @select="handleDutiesSelect"
      />
    </el-form-item>
  </div>
</template>

<script>
import CascaderSelector from '@/components/CascaderSelector'
import { companyChild, dutiesQuery, dutiesDetail } from '@/api/company'
export default {
  name: 'Company',
  components: {
    CascaderSelector
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
        }
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
    companyChild(id) {
      return companyChild(id)
    },
    async dutiesQuery(queryString, cb) {
      var data = await dutiesQuery(queryString)
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
      dutiesDetail(item.value).then(data => {
        console.log(data)
      })
    }
  }
}
</script>

<style>
</style>
