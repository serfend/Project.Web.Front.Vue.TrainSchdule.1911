<template>
  <div>
    <SettleFormItem v-model="form.Settle.self" label="本人所在地" />
    <SettleFormItem v-model="form.Settle.lover" label="配偶所在地" />
    <SettleFormItem v-model="form.Settle.parent" label="父母所在地" />
    <SettleFormItem v-model="form.Settle.loversparent" label="配偶父母所在地" />
    <el-form-item label="初始全年天数">
      <el-input v-model="form.Settle.prevYearlyLength" disabled />
    </el-form-item>
    <el-form-item label="联系方式">
      <el-input v-model="form.Phone" />
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
      phone: '13627272634',
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
        prevYearlyLength: 30
      }
    }
  }
}
</script>

<style>
</style>

