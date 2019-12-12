<template>
  <div>
    <el-form-item prop="username">
      <span class="svg-container">
        <svg-icon icon-class="user" />
      </span>
      <el-input
        ref="username"
        v-model="registerForm.application.username"
        :placeholder="$t('login.username')"
        auto-complete="on"
        name="username"
        type="text"
      />
    </el-form-item>
    <el-form-item prop="email">
      <span class="svg-container">
        <svg-icon icon-class="email" />
      </span>
      <el-input
        ref="email"
        v-model="registerForm.email"
        :placeholder="$t('register.checkemail')"
        auto-complete="on"
        name="email"
        type="text"
      />
    </el-form-item>
  </div>
</template>

<script>
var emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
import { validUsername } from '@/utils/validate'
export default {
  name: 'Application',
  data() {
    var validateUsername = (rule, value, callback) => {
      if (value.trim().length === 0 || !validUsername(value)) {
        callback(new Error(this.$t('login.validate.username.invalid')))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (emailRE.test(value)) {
        callback()
      } else {
        callback(new Error(this.$t('register.validate.email.notmatch')))
      }
    }
    return {
      username: '11111111',
      about: 'user about',
      email: 'useremail@txt.mtl'
    }
  }
}
</script>

<style>
</style>