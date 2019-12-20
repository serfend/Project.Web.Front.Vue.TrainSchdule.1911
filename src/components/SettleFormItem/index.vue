<template>
  <el-form-item :label="label">
    <el-row :gutter="8">
      <el-col :lg="8">
        <el-input v-model="form.addressDetail" :disabled="disabled" placeholder="无信息">
          <div slot="prepend">{{ form.address.name }}</div>
        </el-input>
      </el-col>
      <el-col :lg="8">
        <el-input v-model="form.date" :disabled="disabled" placeholder="无信息">
          <div slot="prepend">开始时间</div>
        </el-input>
      </el-col>
      <el-col :lg="6">
        <cascader-selector
          :value="form.address.code"
          label="行政区划编号"
          :data-arr="dataArr"
          :data-options="dataOptions"
          :child-getter-method="childGetterMethod"
        />
      </el-col>
    </el-row>
  </el-form-item>
</template>

<script>
import CascaderSelector from '@/components/CascaderSelector'
const VALUE_CONSTRUCT = {
  date: '',
  valid: '',
  address: {
    code: '',
    dataArr: [],
    dataOptions: [],
    childGetter: () => {
      return []
    }
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
    },
    dataArr: {
      type: Array,
      default() {
        return []
      }
    },
    dataOptions: {
      type: Array,
      default() {
        return []
      }
    },
    childGetter: {
      type: Function,
      default() {
        return () => {}
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
  }
}
</script>

<style>
</style>
