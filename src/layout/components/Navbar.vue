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
        :show.sync="userCardShow"
        placement="bottom-end"
        trigger="click"
        @show="userCardShowing(true)"
        @hide="userCardShowing(false)"
      >
        <div v-if="!hasLogin && loginFormHasShow">
          <el-dialog :visible.sync="userCardShow" width="80%" append-to-body>
            <Login @login="hdlLogin" />
          </el-dialog>
        </div>
        <div v-else style="width: 250px">
          <UserSummary
            :showout="userCardIsShowing"
            :data="$store.state.user.data"
            :avatar="$store.state.user.avatar"
            :vacation="$store.state.user.vacation"
          />
          <div class="menu-divider" />
          <el-menu style="border-right: none">
            <el-submenu index="1">
              <template slot="title">
                <SvgIcon icon-class="principal" />
                <span>账号</span>
              </template>
              <el-menu-item index="1" @click="$router.push(`/user/profile`)">
                <SvgIcon icon-class="namecard" />
                <span>个人信息</span>
              </el-menu-item>
              <el-menu-item index="2" @click="isToShowPasswordModefier = true">
                <SvgIcon icon-class="scan_namecard" />
                <span>修改密码</span>
              </el-menu-item>
              <el-menu-item index="3" @click="handleReg(false)">
                <SvgIcon icon-class="newapplication_" />
                <span>授权注册</span>
              </el-menu-item>
              <el-menu-item index="4" @click="handleReg(true)">
                <SvgIcon icon-class="newapplication_" />
                <span>注册新账号</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item @click="logout">
              <SvgIcon icon-class="dengchu" />
              <span>退出</span>
            </el-menu-item>
          </el-menu>
        </div>
        <div
          slot="reference"
          class="avatar-container right-menu-item"
          @click="userCardShow = !userCardShow"
        >
          <el-image
            class="user-avatar"
            :style="{ transform: userCardIsShowing ? 'scale(0)' : ''}"
            :src="avatar"
          />
          <div class="right-menu-item" />
        </div>
      </el-popover>
      <div v-if="$store.state.user.data" class="right-menu-2-item" style="color:#000">
        <div>{{ $store.state.user.name }}</div>
        <div>{{ $store.state.user.data.dutiesName }}</div>
      </div>
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
      <div v-if="device !== 'mobile'&&currentTime" class="right-menu-2-item">
        <div>{{ currentTime.split('\n')[0] }}</div>
        <div>{{ currentTime.split('\n')[1] }}</div>
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
import { datedifference, parseTime } from '@/utils'
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
    Login,
  },
  data() {
    return {
      checker: null,
      lastUpdateShow: new Date(),
      userCardShow: false,
      userCardIsShowing: false,
      loginFormHasShow: false,
      isToShowPasswordModefier: false,
      loading: false,
      check: {
        check_sync_time: 0,
        check_user_login: 0,
      },
      currentTime: null,
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device']),
    hasLogin() {
      return this.$store.state.user.userid
    },
  },
  watch: {
    // hasLogin: {
    //   handler(val) {
    //     // fix bug for card directly show out in abnormal appearance
    //     if (val) {
    //       this.userCardShow = false
    //       setTimeout(() => {
    //         this.userCardShow = true
    //       }, 500)
    //     }
    //   },
    // },
  },
  mounted() {
    setTimeout(() => {
      if (!this.hasLogin && !this.$store.state.user.isUserLogout) {
        this.userCardShow = true
      }
    }, 500)
    this.checker = setInterval(() => {
      this.check_sync_time()
      this.check_user_login()
      const s = this.$store.state.settings.currentTime_left_status
      if (s) {
        this.currentTime = `时间同步\n${s}`
      } else {
        const d = new Date(
          new Date() - 0 + this.$store.state.settings.currentTimeDelta_left
        )
        this.currentTime = parseTime(d, '{y}年{m}月{d}日\n{h}时{i}分{s}秒')
      }
    }, 1000)
    this.check_sync_time(true)
  },
  destroyed() {
    if (this.checker) clearInterval(this.checker)
  },
  methods: {
    check_sync_time(direct_load = false) {
      const d = datedifference(new Date(), this.check.check_sync_time, 'minute')
      if (d < 30 && !direct_load) return // 30分钟同步一次
      // console.log('check sync time after ' + d + ' minute(s)')
      this.check.check_sync_time = new Date()
      this.$store.dispatch('settings/sync_time')
    },
    check_user_login() {
      const d = datedifference(new Date(), this.check.check_user_login, 'minute')
      if (d < 10) return
      // console.log('check login status')
      this.check.check_user_login = new Date()
      this.$store.dispatch('user/check_login')
    },
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
      this.$router.push({
        path: `/register/${isToRegister ? 'user' : 'approve'}`,
      })
    },
    async logout() {
      this.loading = true
      await this.$store.dispatch('user/logout')
      this.loading = false
      this.$nextTick(() => {
        this.userCardShow = false
        this.userCardShowing(false)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import './menu-divider.scss';
@import './nav-bar.scss';
</style>
