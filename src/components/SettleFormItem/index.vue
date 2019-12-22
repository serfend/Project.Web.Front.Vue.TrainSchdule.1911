<template>
  <el-form-item :label="label">
    <el-switch v-model="innerForm.valid" active-text="启用" inactive-text="禁用" />
    <el-row :gutter="8">
      <el-col :span="12">
        <el-input v-model="innerForm.addressDetail" :disabled="disabled" placeholder="无信息">
          <div slot="prepend">详细地址</div>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-tooltip content="生效时间，表示最后一次更换地点的时间">
          <el-date-picker v-model="innerForm.date" :disabled="disabled" placeholder="无信息" />
        </el-tooltip>
      </el-col>
      <el-col :span="6">
        <el-tooltip content="行政区划">
          <cascader-selector
            :code="innerForm.address.code"
            :child-getter-method="locationChildren"
          />
        </el-tooltip>
      </el-col>
    </el-row>
  </el-form-item>
</template>

<script>
import CascaderSelector from '@/components/CascaderSelector'
import { locationChildren } from '@/api/static'
export default {
  name: 'SettleFormItem',
  components: { CascaderSelector },
  props: {
    disabled: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      default: ''
    },
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
        date: '',
        valid: '',
        address: {
          code: ''
        },
        addressDetail: ''
      }
    }
  },
  watch: {
    innerForm: {
      handler(val, oldVal) {
        this.$emit('update:form', val)
      },
      deep: true
    }
  },
  methods: {
    locationChildren(id) {
      return locationChildren(id)
    }
  }
}
</script>

<style>
</style>
