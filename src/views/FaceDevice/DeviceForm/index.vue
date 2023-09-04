<template>
  <el-card>
    <el-form label-width="5rem">
      <el-form-item label="配置选项">
        <FaceDeviceOptionSelector v-model="inner_data.options_vals" :multi="true" @change="onOptionsChange" />
        <el-tooltip placement="right">
          <i class="el-icon-info blue--text" />
          <template #content>入口：门禁是否用于进入院子/室内。</template>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="设备名称">
        <el-input v-model="inner_data.name" />
      </el-form-item>
      <el-form-item label="ip">
        <el-input v-model="inner_data.ip" />
      </el-form-item>
      <el-form-item label="归属单位">
        <CompanySelector v-model="inner_data.company_obj" />
      </el-form-item>
      <el-form-item label="区域">
        <CascaderSelector
          v-model="inner_data.district_obj"
          :child-getter-method="locationChildren"
          :value-name="'code'"
          :label-name="'name'"
          width="20rem"
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="inner_data.type" />
      </el-form-item>
      <el-form-item label="账号">
        <el-input v-model="inner_data.userName" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="inner_data.password" show-password />
      </el-form-item>
    </el-form>
    <el-button type="success" @click="confirm_and_exit">确定</el-button>
    <el-button v-show="!isAdd" type="success" @click="confirm">保存</el-button>
    <el-button type="info" @click="exit">取消</el-button>
  </el-card>
</template>
<script>
export function extract_options (val) {
  let i = 1
  const result = []
  while (val > 0) {
    if (val & i) {
      result.push(i)
      val -= i
    }
    i = i << 1
  }
  return result
}
import { locationChildren } from '@/api/common/static'
import { parseTime, formatTime } from '@/utils'
export default {
  name: 'FaceDevice',
  components: {
    CompanySelector: () => import('@/components/Company/CompanySelector'),
    CascaderSelector: () => import('@/components/CascaderSelector'),
    FaceDeviceOptionSelector: () => import('@/components/Security/FaceDeviceOption/FaceDeviceOptionSelector')
  },
  model: {
    event: 'change',
    prop: 'data'
  },
  props: {
    data: { type: Object, default: () => ({}) },
    isShow: { type: Boolean, default: false },
    isAdd: { type: Boolean, default: false },
  },
  data: () => ({
    inner_data: {}
  }),
  computed: {
    dict () {
      return this.$store.state.sec.faceDeviceOptionsDict
    }
  },
  watch: {
    data: {
      handler (v) {
        const item = Object.assign({}, v)
        item.district_obj = { code: v.district, name: v.districtName }
        item.company_obj = { code: v.company, name: '123' }
        item.options_vals = extract_options(item.options)
        this.inner_data = item
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    locationChildren,
    parseTime,
    formatTime,
    confirm_and_exit () {
      this.confirm()
      this.exit()
    },
    confirm () {
      const data = Object.assign({}, this.inner_data)
      data.company = data.company_obj.code
      delete data.company_obj

      data.district = data.district_obj.code
      delete data.district_obj
      data.options = data.options_vals.reduce((prev, cur) => prev + cur, 0)
      delete data.options_vals
      this.$emit('requireUpdate', data)
    },
    exit () {
      this.$emit('update:isShow', false)
    },
    onOptionsChange (x) {
      this.inner_data.options_vals = x
    }
  }
}
</script>
