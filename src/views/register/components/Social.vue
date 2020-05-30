<template>
  <div>
    <SettleFormItem :form.sync="innerForm.settle.self" label="本人居住地" :disabled="false" />
    <SettleFormItem :form.sync="innerForm.settle.lover" label="配偶居住地" :disabled="false" />
    <SettleFormItem :form.sync="innerForm.settle.parent" label="本人父母居住地" :disabled="false" />
    <SettleFormItem :form.sync="innerForm.settle.loversParent" label="配偶父母居住地" :disabled="false" />
    <el-col :span="8">
      <el-form-item
        label="联系方式"
        prop="phone"
        inline-message
        :rules="[{ validator: phoneRoleCheck, trigger: 'blur' }]"
      >
        <el-input v-model="innerForm.phone" placeholder="请输入常用的手机号" />
      </el-form-item>
    </el-col>
  </div>
</template>

<script>
import { validPhone } from '@/utils/validate'
import SettleFormItem from '@/components/SettleFormItem'
export default {
  name: 'Social',
  components: { SettleFormItem },
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
        phone: '',
        settle: {
          self: {},
          lover: {},
          parent: {},
          loversParent: {}
        }
      }
    }
  },
  watch: {
    form: {
      handler(val) {
        if (!val || !val.settle) return
        this.innerForm = val
        var settle = this.innerForm.settle
        if (settle.id) delete settle.id
      },
      deep: true,
      immediate: true
    },
    innerForm: {
      handler(val, oldVal) {
        this.$emit('update:form', this.innerForm)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    phoneRoleCheck(filed, invalidVal, cb) {
      var val = this.innerForm[filed.field]
      var result = validPhone(val)
      if (result) cb(new Error(result))
      cb()
    }
  }
}
</script>

<style>
</style>

