<template>
  <el-form>
    <el-form-item label="授权人">
      <el-input v-model="innerForm.authByUserId" placeholder="请输入授权人的id" />
    </el-form-item>
    <el-form-item label="安全码">
      <el-input v-model="innerForm.code" placeholder="请输入安全码" @change="checkCode">
        <template slot="suffix">
          <el-tooltip :content="invalid.code.des">
            <i v-if="invalid.code.status" class="el-icon-error" style="color:#F56C6C" />
            <i v-else class="el-icon-success" style="color:#67C23A" />
          </el-tooltip>
        </template>
      </el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import { checkAuthCode } from '@/api/account'
export default {
  name: 'AuthCode',
  props: {
    form: {
      type: Object,
      default() {
        return this.innerForm
      }
    },
    authCheckMethod: {
      type: Function,
      default() {
        return checkAuthCode
      }
    }
  },
  data() {
    return {
      innerForm: {
        authByUserId: null,
        code: null
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
        if (val.authByUserId === '') val.authByUserId = null
        if (val.code === '') val.code = null
        this.$emit('update:form', val)
      },
      deep: true
    }
  },
  mounted() {
    this.innerForm.authByUserId = this.$store.state.user.userid
  },
  methods: {
    checkCode() {
      var fn = this.authCheckMethod
      var p = fn(this.innerForm.authByUserId, this.innerForm.code, true)
      p(this.innerForm.authByUserId, this.innerForm.code, true)
        .then(() => {
          this.$emit('update:status', true)
          this.invalid.code.status = false
          this.invalid.code.des = '验证成功'
        })
        .catch(err => {
          this.$emit('update:status', false)
          this.invalid.code.status = true
          this.invalid.code.des = err.message
        })
    }
  }
}
</script>

<style>
</style>
