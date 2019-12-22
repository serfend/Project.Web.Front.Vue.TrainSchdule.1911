<template>
  <div>
    <el-steps :active="nowStep" simple>
      <el-step
        v-for="opt in stepOptions"
        :key="opt.index"
        :status="nowStep==opt.index?'success':''"
        :title="opt.name"
        :icon="opt.icon"
      />
    </el-steps>
    <el-form label-position="right" label-width="120px">
      <el-collapse v-model="nowStep" accordion>
        <el-collapse-item v-for="opt in stepOptions" :key="opt.index" :name="opt.index">
          <template slot="title">
            {{ opt.name }}
            <i :class="opt.icon" />
          </template>
          <el-card :key="opt.index" shadow="hover">
            <component :is="opt.component" :form.sync="registerForm[opt.component]" />
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <el-button
      type="success"
      :loading="submitLoading"
      :style="{ width: '100%' }"
      @click="submitRegister"
    >提交注册</el-button>
  </div>
</template>

<script>
import LangSelect from '@/components/LangSelect'
import Base from './components/Base'
import Application from './components/Application'
import Company from './components/Company'
import Diy from './components/Diy'
import Social from './components/Social'
import Auth from '@/components/AuthCode'
import { regnew } from '@/api/account'
export default {
  name: 'Register',
  components: { LangSelect, Base, Application, Social, Company, Diy, Auth },
  data() {
    return {
      submitLoading: false,
      registerForm: this.createForm(),
      nowStep: 1,
      stepOptions: [
        {
          name: '基本信息',
          index: 1,
          icon: 'el-icon-s-custom',
          component: 'Base'
        },
        {
          name: '系统信息',
          index: 2,
          icon: 'el-icon-document-copy',
          component: 'Application'
        },
        {
          name: '单位信息',
          index: 3,
          icon: 'el-icon-office-building',
          component: 'Company'
        },
        {
          name: '家庭信息',
          index: 4,
          icon: 'el-icon-s-home',
          component: 'Social'
        },
        {
          name: '其他信息',
          index: 5,
          icon: 'el-icon-s-grid',
          component: 'Diy'
        },
        {
          name: '注册授权',
          index: 6,
          icon: 'el-icon-s-check',
          component: 'Auth'
        }
      ]
    }
  },
  methods: {
    createForm() {
      return {
        Base: {},
        Social: {},
        Company: {},
        Application: {},
        Diy: {},
        Auth: {},
        password: '',
        confirmPassword: ''
      }
    },
    returnToLogin() {
      this.$router.push({ path: '/login' })
    },
    submitRegister() {
      this.submitLoading = true
      this.registerForm.password = this.registerForm.Application.password
      this.registerForm.confirmPassword = this.registerForm.Application.confirmPassword
      var submitForm = {
        Data: this.registerForm,
        verify: {
          code: '201700816'
        },
        Auth: this.registerForm.Auth
      }
      regnew(submitForm)
        .then(data => {})
        .finally(() => {
          this.submitLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.top-enter,
.top-leave-to {
  transform: translate3d(0, -100%, 0);
}
.top-leave,
.top-enter-to {
  transform: translate3d(0, 0, 0);
}
.top-enter-active,
.top-leave-active {
  transition: all 0.2s;
}
</style>
