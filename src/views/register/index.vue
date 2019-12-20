<template>
  <div>
    <el-steps :active="nowStep" simple>
      <el-step :status="nowStep>1?'success':''" title="基本信息" icon="el-icon-s-custom" />
      <el-step :status="nowStep>2?'success':''" title="家庭信息" icon="el-icon-s-home" />
      <el-step :status="nowStep>3?'success':''" title="其他信息" icon="el-icon-bank-card" />
    </el-steps>
    <transition duration="1000" mode="in-out" appear>
      <el-card :show="showcard" @click="showcard=false">123</el-card>
    </transition>
  </div>
</template>

<script>
import LangSelect from '@/components/LangSelect'
import { setTimeout } from 'timers'
export default {
  name: 'Register',
  components: { LangSelect },
  data() {
    return {
      registerForm: {
        base: {},
        social: {},
        company: {},
        application: {},
        diy: {},
        password: '',
        confirmPassword: ''
      },
      nowStep: 1,
      dialogMainShow: true,
      showcard: true
    }
  },
  methods: {
    returnToLogin() {
      this.$router.push({ path: '/login' })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
