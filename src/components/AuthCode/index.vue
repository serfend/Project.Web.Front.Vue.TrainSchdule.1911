<template>
  <div>
    <el-row>
      <el-col :lg="12" :sm="24">
        <el-form-item label="审核人">
          <el-input
            v-model="innerForm.authByUserId"
            :style="{ width: '400px' }"
            placeholder="请输入审核人的id"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :lg="8" :sm="24">
        <el-form-item label="安全码">
          <el-input
            v-model="innerForm.code"
            :style="{ width: '400px' }"
            placeholder="请输入安全码"
            @change="checkCode"
          >
            <template slot="suffix">
              <el-tooltip :content="invalid.code.des">
                <i v-if="invalid.code.status" class="el-icon-error" style="color:#F56C6C" />
                <i v-else class="el-icon-success" style="color:#67C23A" />
              </el-tooltip>
            </template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
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
  mounted() {
    this.innerForm.authByUserId = this.$store.state.user.userid
  },
  methods: {
    checkCode() {
      checkAuthCode(this.innerForm.authByUserId, this.innerForm.code, true)
        .then(() => {
          this.invalid.code.status = false
          this.invalid.code.des = '验证成功'
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
