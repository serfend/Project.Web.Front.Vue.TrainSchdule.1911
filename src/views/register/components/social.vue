<template>
  <div>
    <cascader-selector
      :code.sync="settle.self.address.code"
      :data-arr="dataArr"
      :data-options="dataOpts"
      :child-getter-method="locationChildren"
    />
    <!-- <SettleFormItem
      v-model="settle.self"
      :data-options="dataOpts"
      :child-getter="locationChildren"
      label="本人所在地"
      :disabled="false"
    />
    <SettleFormItem
      v-model="settle.lover"
      :data-options="dataOpts"
      :child-getter="locationChildren"
      label="配偶所在地"
      :disabled="false"
    />
    <SettleFormItem
      v-model="settle.parent"
      :data-options="dataOpts"
      :child-getter="locationChildren"
      label="父母所在地"
      :disabled="false"
    />
    <SettleFormItem
      v-model="settle.loversparent"
      :data-options="dataOpts"
      :child-getter="locationChildren"
      label="配偶父母所在地"
      :disabled="false"
    />-->
    <el-form-item label="初始全年休假天数">
      <el-input-number v-model="settle.prevYearlyLength" />
      <el-tooltip content="如果无特殊情况，此项可不填，系统将自动计算" effect="dark" placement="bottom">
        <i class="el-icon-question" />
      </el-tooltip>
    </el-form-item>
    <el-form-item label="联系方式">
      <el-input v-model="phone" />
    </el-form-item>
  </div>
</template>

<script>
import SettleFormItem from '@/components/SettleFormItem'
import CascaderSelector from '@/components/CascaderSelector'

import { locationChildren } from '@/api/static'
export default {
  name: 'Social',
  components: { SettleFormItem, CascaderSelector },
  data() {
    return {
      dataOpts: [
        {
          label: '选择地域',
          value: 0,
          children: []
        },
        {
          label: '不选择',
          value: -1
        }
      ],
      dataArr: [],
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
  methods: {
    locationChildren(code) {
      return locationChildren(code)
    }
  }
}
</script>

<style>
</style>

