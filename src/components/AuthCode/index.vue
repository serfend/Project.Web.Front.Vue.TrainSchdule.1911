<template>
  <div>
    <el-form-item label="审核人">
      <el-input
        v-model="innerForm.authByUserId"
        :style="{ width: '400px' }"
        placeholder="请输入审核人的id"
      />
    </el-form-item>
    <el-form-item label="安全码">
      <el-input
        v-model="innerForm.code"
        :style="{ width: '400px' }"
        placeholder="请输入安全码"
        @change="checkCode"
      />
      <el-tooltip :content="invalid.code.des">
        <i v-if="invalid.code.status" class="el-icon-error" style="color:#F56C6C" />
        <i v-else class="el-icon-success" style="color:#67C23A" />
      </el-tooltip>
    </el-form-item>
  </div>
</template>

<script>
import { checkAuthCode } from '@/api/account'
export default {
  name: 'AuthCode',
  props: {
    label: {
      type: String,
      default: ''
    },
    form: {
      type: Object,
      default() {
        return this.innerForm
      }
    },
    authCheckMethod: {
      type: Function,
      default() {
        return () => {}
      }
    }
  },
  data() {
    return {
      innerForm: {
        authByUserId: '',
        code: ''
      },
      invalid: {
        code: {
          status: false,
          des: ''
        }
      }
    }
  },
  watch: {
    innerForm: {
      handler(val, oldVal) {
        this.$emit('update:form', val)
      },
      deep: true
    }
  },
  methods: {
    checkCode() {
      checkAuthCode(this.innerForm.authByUserId, this.innerForm.code, true)
        .then(() => {
          this.invalid.code.status = false
        })
        .catch(err => {
          this.invalid.code.status = true
          this.invalid.code.des = err.message
        })
    }
  }
}
</script>

<style>
</style>
