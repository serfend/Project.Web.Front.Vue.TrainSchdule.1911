<template>
  <el-form-item :label="label">
    <el-tooltip content="无此项（例如未婚、离婚、去世）时则将此项禁用">
      <el-switch
        v-model="innerForm.valid"
        active-text="启用"
        inactive-text="禁用"
        :disabled="disabled"
      />
    </el-tooltip>
    <el-row :gutter="8">
      <el-col :span="12">
        <el-input v-model="innerForm.addressDetail" :disabled="disabled" placeholder="无信息">
          <div slot="prepend">详细地址</div>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-tooltip content="生效时间，表示最后一次更换地点的时间">
          <el-date-picker
            v-model="innerForm.date"
            :disabled="disabled"
            placeholder="无信息"
            format="yyyy年MM月dd"
            value-format="yyyy-MM-dd"
          />
        </el-tooltip>
      </el-col>
      <el-col :span="6">
        <el-tooltip content="行政区划,填到区/县一级">
          <cascader-selector
            :placeholder="innerForm.address.name"
            :disabled="disabled"
            :code.sync="innerForm.address.code"
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
      default: false
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
        date: '2000-1-1',
        valid: true,
        address: {
          code: '0'
        },
        addressDetail: '0'
      }
    }
  },
  watch: {
    form: {
      handler(val) {
        if (this.innerForm === this.form) return
        this.innerForm = this.form
        if (!this.innerForm) this.innerForm = {}
        if (this.innerForm.id) delete this.innerForm.id
        if (this.form.address) {
          this.innerForm.address = {
            code: this.form.address.code + '',
            name: this.form.address.name
          }
        } else {
          this.innerForm.address = {
            code: '',
            name: '未选择'
          }
        }
      },
      deep: true
    },
    innerForm: {
      handler(val) {
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
