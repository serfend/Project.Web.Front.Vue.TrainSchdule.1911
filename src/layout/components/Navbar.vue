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
          <span class="caption">{{ name }}</span>
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
            <span style="display:block;" @click="logout">{{ $t("navbar.logOut") }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="第一次登录，请修改密码"
      :modal="false"
      :visible.sync="dialogUpdatePwdVisible"
      width="500px"
    >
      <el-form ref="editPwd" :model="editPwd" :rules="rulePwd" label-width="100px">
        <div>
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
          <el-form-item label="安全码" prop="Auth">
            <el-input v-model="editPwd.Auth" placeholder="请输入安全码" style="width:215px" />
          </el-form-item>
        </div>
        <el-image :src="authKeyUrl" />
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
import { getUserSummary, accountPassword } from '../../api/userinfo'
import { getAuthKey } from '../../api/account'

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
      var reg = /[a-zA-Z]/
      var reg1 = /[0-9]/
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (value === this.editPwd.oldPassword) {
        callback(new Error('新密码不能和旧密码相同'))
      } else if (value.length > 16 || value.length < 8) {
        callback(new Error('新密码必须8-16位数字与字母的组合'))
      } else if (!(reg.test(value) && reg1.test(value))) {
        callback(new Error('新密码必须数字与字母的组合'))
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
    var checkAuth = (rule, value, callback) => {
      if (value) {
        if (!/^[0-9]{6}$/.test(value.toString())) {
          return callback('请输入六位数字')
        }
      } else {
        return callback('请输入六位数字')
      }
      callback()
    }
    return {
      dialogUpdatePwdVisible: false, // 修改密码弹窗
      editPwd: {
        username: this.$store.state.user.userid,
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
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
        ],
        Auth: [
          {
            required: true,
            validator: checkAuth,
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
    name() {
      var tmpName =
        this.$store.state.user.data.companyName +
        this.$store.state.user.data.dutiesName +
        this.$store.state.user.data.realName
      return tmpName
    }
  },
  created() {
    this.getAuthKeyImg()
    getUserSummary()
      .then(data => {
        if (!data.isInitPassword) {
          this.dialogUpdatePwdVisible = true
        }
      })
      .catch(() => {})
  },
  methods: {
    getAuthKeyImg() {
      getAuthKey().then(r => {
        this.authKeyUrl = r
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
    savePwd() {
      this.$refs['editPwd'].validate(valid => {
        if (valid) {
          this.editPwd['id'] =
            this.editPwd.username | this.$store.state.user.userid
          accountPassword(this.editPwd).then(res => {
            if (res.return_code === '0') {
              this.$showMsg({
                type: 'success',
                message: '修改成功'
              })
              this.dialogUpdatePwdVisible = false
            } else this.$showMsg({ type: 'error', message: res.message })
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
