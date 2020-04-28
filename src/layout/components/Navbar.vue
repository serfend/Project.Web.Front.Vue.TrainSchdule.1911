<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <search id="header-search" class="right-menu-item" />

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />
      </template>

      <el-tooltip v-if="!hasLogin" content="未登录状态，点击登录可获取更多权限" effect="dark" placement="left">
        <div class="orange right-menu-item hover-effect" @click="login">
          <i class="el-icon-user" />未登录
        </div>
        <!-- content to trigger tooltip here -->
      </el-tooltip>
      <el-dropdown v-else class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <el-tag>{{ companyName }}</el-tag>
          <span class="caption">{{ realName }}</span>
          <el-image class="user-avatar" :src="avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/profile/index">
            <el-dropdown-item>{{ $t("navbar.profile") }}</el-dropdown-item>
          </router-link>
          <router-link to="dashboard">
            <el-dropdown-item>{{ $t("navbar.dashboard") }}</el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>{{ $t("navbar.welcome") }}</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="isToShowPasswordModefier = true">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span style="display:block;" @click="authRegisterUser(true)">{{ $t("register.title") }}</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span style="display:block;" @click="authRegisterUser(false)">授权注册</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{ $t("navbar.logOut") }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
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
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    Search,
    ResetPassword
  },
  data() {
    return {
      isToShowPasswordModefier: false
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device']),
    hasLogin() {
      return this.$store.state.user.userid
    },
    companyName() {
      return this.$store.state.user.data.companyName
    },
    realName() {
      return (
        this.$store.state.user.data.dutiesName +
        this.$store.state.user.data.realName
      )
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    login() {
      return this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    authRegisterUser(isToRegister) {
      this.$store.state.user.isToRegister = isToRegister
      return this.$router.push(`/register`)
    }
  }
}
</script>

<style lang="scss" scoped>
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
    transition: background 0.3s;
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
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 12px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        /* .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        } */
      }
    }
  }
}
</style>
