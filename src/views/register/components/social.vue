<template>
  <div>
    <SettleFormItem v-model="settle.self" label="本人居住地" :disabled="false" />
    <SettleFormItem v-model="settle.lover" label="配偶居住地" :disabled="false" />
    <SettleFormItem v-model="settle.parent" label="本人父母居住地" :disabled="false" />
    <SettleFormItem v-model="settle.loversparent" label="配偶父母居住地" :disabled="false" />
    <el-form-item label="初始休假天数">
      <el-col :lg="8">
        <el-input-number v-model="settle.prevYearlyLength" />
        <el-tooltip content="如果无特殊情况，此项可不填，系统将自动计算" effect="dark" placement="bottom">
          <i class="el-icon-question" />
        </el-tooltip>
      </el-col>
    </el-form-item>
    <el-form-item label="联系方式">
      <el-col :lg="8">
        <el-input v-model="phone" />
      </el-col>
    </el-form-item>
  </div>
</template>

<script>
import SettleFormItem from '@/components/SettleFormItem'
export default {
  name: 'Social',
  components: { SettleFormItem },
  data() {
    return {
      phone: '',
      settle: {
        self: {
          date: '2018-5-10',
          valid: true,
          address: {
            code: '420104'
          },
          addressDetail: 'details'
        },
        lover: {
          date: '2014-6-10',
          valid: true,
          address: {
            code: '110102'
          },
          addressDetail: 'details'
        },
        parent: {
          date: '2012-8-10',
          valid: true,
          address: {
            code: '110102'
          },
          addressDetail: 'details'
        },
        loversParent: {
          date: '2019-1-10',
          valid: true,
          address: {
            code: '430101'
          },
          addressDetail: 'details'
        },
        prevYearlyLength: 0
      }
    }
  },
  methods: {}
}
</script>

<style>
</style>

