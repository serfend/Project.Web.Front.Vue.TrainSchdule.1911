<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div v-loading="loading" class="right-menu">
      <template v-if="device !== 'mobile'">
        <search id="header-search" class="right-menu-item" />
        <error-log class="errLog-container right-menu-item hover-effect" />
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
      </template>
      <el-popover
        v-model="userCardShow"
        placement="bottom-end"
        trigger="click"
        @show="userCardShowing(true)"
        @hide="userCardShowing(false)"
      >
        <Login v-if="!hasLogin&&loginFormHasShow" @login="hdlLogin" />
        <div v-else style="width:250px">
          <UserSummary :showout="userCardIsShowing" :data="null" />
          <div class="menu-divider" />
          <el-menu style="border-right:none">
            <el-submenu index="1">
              <template slot="title">
                <SvgIcon icon-class="principal" />
                <span>账号</span>
              </template>
              <el-menu-item index="1" @click="isToShowPasswordModefier=true">
                <SvgIcon icon-class="scan_namecard" />
                <span>修改密码</span>
              </el-menu-item>
              <el-menu-item index="2" @click="handleReg(false)">
                <SvgIcon icon-class="newapplication_" />
                <span>授权注册</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item @click="logout">
              <SvgIcon icon-class="dengchu" />
              <span>退出</span>
            </el-menu-item>
          </el-menu>
        </div>
        <div slot="reference" class="avatar-container right-menu-item">
          <el-image
            class="user-avatar"
            :style="{transform:userCardIsShowing?'scale(0)':''}"
            :src="avatar"
          />
          <div class="right-menu-item" />
        </div>
      </el-popover>
      <div v-if="!hasLogin" class="right-menu-item">
        <el-link @click="userCardShowing(true)">登录</el-link>
        <el-link @click="handleReg(true)">注册</el-link>
      </div>
      <div v-else class="right-menu-item">
        <el-popover trigger="hover">
          <span>建设中</span>
          <el-link slot="reference">消息</el-link>
        </el-popover>
        <el-popover trigger="hover">
          <span>建设中</span>
          <el-link slot="reference">收藏</el-link>
        </el-popover>
      </div>
    </div>
    <el-dialog title="修改密码" :modal="false" :visible.sync="isToShowPasswordModefier" width="500px">
      <ResetPassword ref="resetPassword" />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import Search from '@/components/HeaderSearch'
import ResetPassword from '@/components/ResetPassword'
import Login from '@/views/login'
import SvgIcon from '@/components/SvgIcon'
import UserSummary from '@/layout/components/UserSummary/index'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    Search,
    SvgIcon,
    ResetPassword,
    UserSummary,
    Login
  },
  data() {
    return {
      lastUpdateShow: new Date(),
      userCardShow: false,
      userCardIsShowing: false,
      loginFormHasShow: false,
      isToShowPasswordModefier: false,
      loading: false
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device']),
    hasLogin() {
      return this.$store.state.user.userid
    },
    companyName() {
      return this.$store.state.user.companyName
    },
    realName() {
      return `${this.$store.state.user.dutiesName}${this.$store.state.user.realName}`
    }
  },
  mounted() {
    if (!this.hasLogin && !this.$store.state.user.isUserLogout) {
      this.userCardShow = true
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    userCardShowing(show) {
      var lastUpdateShow = new Date()
      this.lastUpdateShow = lastUpdateShow
      setTimeout(() => {
        if (lastUpdateShow !== this.lastUpdateShow) return
        if (show) {
          this.userCardShow = true
        }
        this.userCardIsShowing = show
        this.loginFormHasShow = true
      }, 100)
    },
    hdlLogin(success) {
      if (success) {
        this.userCardShow = false
      }
    },
    handleReg(isToRegister) {
      this.$router.push({ path: `/register?isRegister=${isToRegister}` })
    },
    async logout() {
      this.loading = true
      await this.$store.dispatch('user/logout')
      this.loading = false
      this.$nextTick(() => {
        this.userCardShow = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './menu-divider.scss';
@import './nav-bar.scss';
</style>
