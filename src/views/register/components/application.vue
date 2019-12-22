<template>
  <div>
    <el-form-item prop="username" label="身份号">
      <el-input
        v-model="innerForm.username"
        :style="{ width: '200px' }"
        placeholder="身份号通常为7位或11位证件号码"
        auto-complete="on"
        type="text"
        @change="checkUsername"
      />
      <el-tooltip :content="invalid.username.des">
        <i v-if="invalid.username.status" class="el-icon-error" style="color:#F56C6C" />
        <i v-else class="el-icon-success" style="color:#67C23A" />
      </el-tooltip>
    </el-form-item>
    <el-tooltip v-model="capsTooltip" content="Caps lock is On" manual placement="right">
      <el-form-item prop="password" label="密码" :style="{ width: '400px' }">
        <el-input
          :key="passwordType"
          ref="password"
          v-model="innerForm.password"
          :placeholder="$t('login.password')"
          :type="passwordType"
          auto-complete="on"
          name="password"
          tabindex="2"
          @blur="capsTooltip = false"
          @keyup.native="checkCapslock"
        >
          <template slot="append">
            <span @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </template>
        </el-input>
      </el-form-item>
    </el-tooltip>
    <el-form-item prop="confirmPassword" label="确认密码" :style="{ width: '400px' }">
      <el-input
        :key="passwordType"
        ref="confirmPassword"
        v-model="innerForm.confirmPassword"
        placeholder="确认密码"
        :type="passwordType"
        auto-complete="on"
        name="password"
        tabindex="2"
        @blur="capsTooltip = false"
        @keyup.native="checkCapslock"
      >
        <template slot="append">
          <span @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="email" label="认证邮箱">
      <el-input
        v-model="innerForm.email"
        :style="{ width: '400px' }"
        :placeholder="$t('register.checkemail')"
        auto-complete="on"
        type="text"
      />
    </el-form-item>
  </div>
</template>

<script>
import { getUserSummary } from '@/api/userinfo'
export default {
  name: 'Application',
  data() {
    return {
      innerForm: {
        username: '',
        password: '',
        confirmPassword: '',
        about: '',
        email: ''
      },
      invalid: {
        username: {
          status: false,
          des: ''
        }
      },
      capsTooltip: false,
      passwordType: 'password'
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
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && (key >= 'a' && key <= 'z')) ||
          (!shiftKey && (key >= 'A' && key <= 'Z'))
        ) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    checkUsername() {
      const username = this.innerForm.username
      if (!username || username.length < 7) {
        this.invalid.username.status = true
        this.invalid.username.des = '账号长度过短'
        return
      }
      this.invalid.username.des = '验证成功'
      getUserSummary(username, true)
        .then(data => {
          this.invalid.username.status = true
          this.invalid.username.des =
            '此账号已被' + data.companyName + data.realName + '使用'
        })
        .catch(() => {
          this.invalid.username.status = false
        })
    }
  }
}
</script>
