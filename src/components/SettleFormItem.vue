<template>
  <el-form-item :label="label">
    <el-row :gutter="8">
      <el-col :lg="8">
        <el-input
          v-model="form.address.name"
          :disabled="disabled"
          placeholder="详细地址"
        >
          <div slot="prepend">
            详细地址
          </div>
        </el-input>
      </el-col>
      <el-col :lg="8">
        <el-input
          v-model="form.date"
          :disabled="disabled"
          placeholder="居住开始时间"
        >
          <div slot="prepend">
            居住开始时间
          </div>
        </el-input>
      </el-col>
      <!-- <el-col :lg="6">
        <el-input
          v-model="form.HomeDetailAddress"
          placeholder="是否有效"
        />
      </el-col>
      <el-col :lg="6">
        <el-input
          v-model="form.HomeDetailAddress"
          placeholder="行政区划编号"
        />
      </el-col> -->
    </el-row>
  </el-form-item>
</template>

<script>
const VALUE_CONSTRUCT = {
  date: '',
  valid: '',
  address: {
    parentId: '',
    rank: '',
    name: '',
    shortname: ''
  },
  addressDetail: ''
}

export default {
  name: 'SettleFormItem',
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
  }
}
</script>

<style>
</style>
