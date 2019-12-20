<template>
  <el-form-item :label="label">
    <el-row :gutter="8">
      <el-col :lg="6">
        <el-input v-model="form.addressDetail" :disabled="disabled" placeholder="无信息">
          <div slot="prepend">详细地址</div>
        </el-input>
      </el-col>
      <el-col :lg="4">
        <el-tooltip content="生效时间，表示最后一次更换地点的时间">
          <el-date-picker v-model="form.date" :disabled="disabled" placeholder="无信息" />
        </el-tooltip>
      </el-col>
      <el-col :lg="4">
        <el-tooltip content="行政区划">
          <cascader-selector :code="form.address.code" :child-getter-method="locationChildren" />
        </el-tooltip>
      </el-col>
    </el-row>
  </el-form-item>
</template>

<script>
import CascaderSelector from '@/components/CascaderSelector'
import { locationChildren } from '@/api/static'
const VALUE_CONSTRUCT = {
  date: '',
  valid: '',
  address: {
    code: ''
  },
  addressDetail: ''
}

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
    value: {
      type: Object,
      default() {
        return VALUE_CONSTRUCT
      }
    }
  },
  computed: {
    form: {
      set(val) {
        const clonedValue = Object.assign(
          { ...VALUE_CONSTRUCT },
          this.value,
          val
        )
        this.$emit('input', clonedValue)
      },
      get() {
        return this.value
      }
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
