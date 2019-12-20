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
    <el-form>
      <el-collapse v-model="nowStep" accordion>
        <el-collapse-item v-for="opt in stepOptions" :key="opt.index" :name="opt.index">
          <template slot="title">
            {{ opt.name }}
            <i :class="opt.icon" />
          </template>
          <el-card :key="opt.index" shadow="hover">
            <component :is="opt.component" />
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <el-button @click="nowStep-=1">上一步</el-button>
    <el-button @click="nowStep+=1">下一步</el-button>
  </div>
</template>

<script>
import LangSelect from '@/components/LangSelect'
import Base from './components/Base'
import Application from './components/Application'
import Company from './components/Company'
import Diy from './components/Diy'
import Social from './components/Social'
export default {
  name: 'Register',
  components: { LangSelect, Base, Application, Social, Company, Diy },
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
        }
      ]
    }
  },
  mounted() {},
  methods: {
    returnToLogin() {
      this.$router.push({ path: '/login' })
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
