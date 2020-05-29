<template>
  <el-form-item :label="label">
    <div v-if="!disabled">
      <el-tooltip content="无此项（例如未婚、离婚、去世）时则将此项禁用">
        <el-switch v-model="innerForm.valid" active-text="启用" inactive-text="禁用" />
      </el-tooltip>
      <el-row type="flex" justify="start" :gutter="8">
        <el-col :lg="6" :md="8" :sm="12" :xs="24">
          <el-tooltip content="生效时间，表示最后一次更换地点的时间">
            <el-date-picker
              v-model="innerForm.date"
              placeholder="未填写日期"
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd"
            />
          </el-tooltip>
        </el-col>
        <el-col :lg="8" :md="16" :sm="12" :xs="24">
          <el-tooltip content="行政区划,填到区/县一级">
            <cascader-selector
              :placeholder="innerForm.address.name"
              :code.sync="innerForm.address.code"
              :child-getter-method="locationChildren"
            />
          </el-tooltip>
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="12" :md="24">
          <el-input v-model="innerForm.addressDetail" placeholder="未填写详细地址">
            <div slot="prepend">详细地址</div>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <div v-if="!innerForm.valid">无</div>
      <div v-else>
        <el-tag>{{ parseTime(new Date(innerForm.date),'{yyyy}年{mm}月{dd}日') }}</el-tag>
        <span style="font-size:1.1em">{{ innerForm.address.name }}</span>
        <span style="color:#aaaaaa;font-size:1em">{{ innerForm.addressDetail }}</span>
      </div>
    </div>
  </el-form-item>
</template>

<script>
import { parseTime } from '@/utils'
import CascaderSelector from '@/components/CascaderSelector'
import { locationChildren } from '@/api/common/static'
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
        return this.createInnerForm()
      }
    }
  },
  data() {
    return {
      innerForm: this.createInnerForm()
    }
  },
  watch: {
    form: {
      handler(val) {
        if (this.innerForm === val) return
        this.innerForm = this.form
        if (!this.innerForm) this.innerForm = {}
        if (this.innerForm.id) delete this.innerForm.id
        if (this.form.address) {
          this.innerForm.address = {
            code: this.form.address.code + '',
            name: this.form.address.name
          }
          // fix bug empty address
          if (this.innerForm.address.code === '') {
            this.innerForm.address.code = '0'
          }
        } else {
          this.innerForm.address = {
            code: '0',
            name: '未选择'
          }
        }
      },
      deep: true,
      immediate: true
    },
    innerForm: {
      handler(val) {
        this.$emit('update:form', val)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    parseTime,
    locationChildren,
    createInnerForm() {
      return {
        date: '2000-1-1',
        valid: true,
        address: {
          code: '0'
        },
        addressDetail: '0'
      }
    }
  }
}
</script>

<style></style>
