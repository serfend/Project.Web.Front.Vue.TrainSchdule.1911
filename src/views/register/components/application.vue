<template>
  <div>
    <el-form-item prop="username">
      <span class="svg-container">
        <svg-icon icon-class="user" />
      </span>
      <el-input
        ref="username"
        v-model="username"
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
        v-model="email"
        :placeholder="$t('register.checkemail')"
        auto-complete="on"
        name="email"
        type="text"
      />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'Application',
  data() {
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
