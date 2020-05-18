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
        trigger="hover"
        @show="userCardShowing(true)"
        @hide="userCardShowing(false)"
      >
        <Login v-if="!hasLogin&&loginFormHasShow" @login="hdlLogin" />
        <div v-else style="width:250px">
          <UserSummary :showout="userCardIsShowing" :data="currentUser" />
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
              <el-menu-item index="2" @click="handleReg(true)">
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
        <el-link>登录</el-link>
        <el-link @click="handleReg">注册</el-link>
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
      return this.currentUser ? this.currentUser.companyName : null
    },
    realName() {
      return this.currentUser
        ? `${this.currentUser.dutiesName}${this.currentUser.realName}`
        : null
    },
    currentUser() {
      var val = this.$store.state.user
      var userWithAvatar = Object.assign(val.data, {
        avatar: val.avatar
      })
      var userWithVacation = Object.assign(userWithAvatar, {
        vacation: val.vacation
      })
      console.log('caculate current user')
      console.log(userWithVacation)
      return userWithVacation
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
      this.userCardIsShowing = show
      this.loginFormHasShow = true
    },
    hdlLogin(success) {
      if (success) {
        this.userCardShow = false
      }
    },
    handleReg(isToAuthRegister) {
      this.$store.state.user.isToRegister = !isToAuthRegister
      this.$router.push({ path: '/register' })
    },
    async logout() {
      this.loading = true
      await this.$store.dispatch('user/logout')
      this.loading = false
      this.$nextTick(() => {
        this.userCardShow = false
      })
    },
    authRegisterUser(isToRegister) {
      this.$store.state.user.isToRegister = isToRegister
      return this.$router.push(`/register`)
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-divider {
  width: 100%;
  height: 1px;
  background-color: #ccc8;
  margin-top: 2px;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: all 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    margin-right: 20px;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      .user-avatar {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 10px;
        transition: all 0.3s ease;
      }
    }
  }
}
</style>
