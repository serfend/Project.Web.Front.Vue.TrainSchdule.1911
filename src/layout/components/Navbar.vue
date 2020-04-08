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
          <img class="user-avatar" :src="avatar">
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
    <el-dialog
      title="修改密码"
      :modal="false"
      :visible.sync="isToShowPasswordModefier"
      width="500px"
      @keyup.enter="savePwd()"
    >
      <el-form ref="editPwd" :model="editPwd" :rules="rulePwd" label-width="100px">
        <el-form-item label="修改账号" prop="username">
          <el-input v-model="editPwd.username" type="input" style="width:215px" />
        </el-form-item>
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="editPwd.oldPassword" type="password" style="width:215px" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="editPwd.newPassword" type="password" style="width:215px" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmNewPassword">
          <el-input v-model="editPwd.confirmNewPassword" type="password" style="width:215px" />
        </el-form-item>
        <el-divider>
          <i class="el-icon-key" />
        </el-divider>
        <el-form-item label="授权码">
          <el-input v-model="editPwd.authbyuserid" placeholder="授权人" style="width:215px" />
          <el-input v-model="editPwd.code" placeholder="授权码" style="width:215px" />
          <el-tooltip placement="top" effect="light">
            <div slot="content">
              授权码是用于敏感操作认证的密钥
              <el-row />请手机下载身份验证器
              <el-tooltip effect="light">
                <div slot="content">
                  身份验证器下载:
                  <el-row />
                  <el-image :src="apkImage" style="width:200px" />
                </div>
                <i class="el-icon-info blue--text" />
              </el-tooltip>
              <el-row />后扫描此码以获取密钥
              <el-row />
              <el-image :src="authKeyUrl" style="width:200px" />
            </div>
            <i class="el-icon-info blue--text" />
          </el-tooltip>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="savePwd()">确认修改</el-button>
      </div>
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
import { getAuthKey, accountPassword } from '@/api/account'
import apkImage from '@/assets/jpg/apk.jpg'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    Search
  },
  data() {
    var validatenewPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (value === this.editPwd.oldPassword) {
        callback(new Error('新密码不能和旧密码相同'))
      } else if (value.length > 16 || value.length < 8) {
        callback(new Error('新密码必须8-16位数字与字母的组合'))
      } else {
        if (this.editPwd.validatenewPassword !== '') {
          this.$refs.editPwd.validateField('validatenewPassword')
        }
        callback()
      }
    }
    var validateconfirmNewPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.editPwd.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      isToShowPasswordModefier: false, // 是否显示修改密码
      apkImage: apkImage,
      editPwd: {
        username: this.$store.state.user.userid,
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        authbyuserid: '',
        code: ''
      },
      authKeyUrl: '',
      rulePwd: {
        username: [{ required: true, message: '请输入账号' }],
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, validator: validatenewPassword, trigger: 'blur' }
        ],
        confirmNewPassword: [
          {
            required: true,
            validator: validateconfirmNewPassword,
            trigger: 'blur'
          }
        ]
      }
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
  created() {
    this.getAuthKeyImg()
  },
  methods: {
    getAuthKeyImg() {
      getAuthKey(false).then(r => {
        this.authKeyUrl = 'data:image/png;base64,' + r.url
        if (
          !this.$store.state.user.data.isInitPassword &&
          this.$store.state.user.userid !== ''
        ) {
          this.isToShowPasswordModefier = true
        }
      })
    },
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
      return this.$router.push(`/register/main`)
    },
    savePwd() {
      this.$refs['editPwd'].validate(valid => {
        if (valid) {
          const submitId = (this.editPwd.username === ''
            ? this.$store.state.user.userid
            : this.editPwd.username
          ).toString()
          const submitPwd = {
            id: submitId,
            auth: {
              AuthByUserID:
                this.editPwd.authbyuserid === ''
                  ? '0'
                  : this.editPwd.authbyuserid,
              code: this.editPwd.code === '' ? '0' : this.editPwd.code
            },
            oldPassword: this.editPwd.oldPassword,
            newPassword: this.editPwd.newPassword,
            confirmNewPassword: this.editPwd.confirmNewPassword
          }
          accountPassword(submitPwd).then(() => {
            this.$message.success('修改密码成功')
            this.isToShowPasswordModefier = true
          })
        }
      })
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
