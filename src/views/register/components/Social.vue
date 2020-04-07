<template>
  <div>
    <SettleFormItem :form.sync="innerForm.settle.self" label="本人居住地" :disabled="false" />
    <SettleFormItem :form.sync="innerForm.settle.lover" label="配偶居住地" :disabled="false" />
    <SettleFormItem :form.sync="innerForm.settle.parent" label="本人父母居住地" :disabled="false" />
    <SettleFormItem :form.sync="innerForm.settle.loversParent" label="配偶父母居住地" :disabled="false" />
    <el-form-item label="初始休假天数">
      <el-col :lg="8">
        <el-input-number v-model="innerForm.settle.prevYearlyLength" />
        <el-tooltip content="填写今年1月1日时应休正休假天数，详细政策同《人力知会手册》" effect="dark" placement="bottom">
          <i class="el-icon-question" />
        </el-tooltip>
      </el-col>
    </el-form-item>
    <el-form-item label="联系方式">
      <el-col :lg="8">
        <el-input v-model="innerForm.phone" />
      </el-col>
    </el-form-item>
  </div>
</template>

<script>
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
          loversParent: {},
          prevYearlyLength: 0
        }
      }
    }
  },
  watch: {
    form: {
      handler(val) {
        if (!val.settle) return
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
  }
}
</script>

<style>
</style>

