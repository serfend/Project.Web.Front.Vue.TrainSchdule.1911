<template>
  <el-form
    ref="loginForm"
    v-loading="loading"
    :model="loginForm"
    :rules="loginRules"
    auto-complete="on"
    class="login-form"
    label-position="left"
  >
    <div class="title-container">
      <h3 class="title">{{ $t('login.defaultTitle') }}</h3>
      <lang-select class="set-language" />
    </div>

    <el-form-item prop="username">
      <el-input
        ref="username"
        v-model="loginForm.username"
        placeholder="用户名或身份证号"
        auto-complete="on"
        name="username"
        tabindex="1"
        type="text"
      >
        <template slot="prepend">
          <svg-icon icon-class="user" />
        </template>
      </el-input>
    </el-form-item>
    <el-tooltip v-model="capsTooltip" content="大写已开启" manual placement="right">
      <el-form-item prop="password">
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          placeholder="密码"
          :type="passwordType"
          auto-complete="on"
          name="password"
          tabindex="2"
          @blur="capsTooltip = false"
          @keyup.enter.native="handleLogin"
          @keyup.native="checkCapslock"
        >
          <template slot="prepend">
            <svg-icon icon-class="password" />
          </template>
          <template slot="append">
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </template>
        </el-input>
      </el-form-item>
    </el-tooltip>
    <el-form-item style="text-align:center" inline-message>
      <el-checkbox v-model="loginForm.RememberUserPassword" label="记住密码" />
      <el-tooltip content="将无需输入账号和密码">
        <el-checkbox v-model="loginForm.RememberMe" label="自动登录" />
      </el-tooltip>
      <el-link href="/#/forget">忘记账号/密码</el-link>
    </el-form-item>
    <el-row />
    <el-button style="width:40%;" plain @click.native.prevent="handleReg">{{ $t('register.title') }}</el-button>
    <el-button
      type="primary"
      style="width:40%;float:right"
      @click.native.prevent="handleLogin"
    >{{ $t('login.title') }}</el-button>
  </el-form>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { passwordCache, setLoginSetting, getLoginSetting } from '@/api/account'
import LangSelect from '@/components/LangSelect'
import { Message } from 'element-ui'
import { getUserBase } from '@/api/userinfo'
export default {
  name: 'Login',
  components: { LangSelect },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value && value.length < 8) {
        callback(new Error('密码不少于8位'))
      } else {
        callback()
      }
    }
    return {
      wrongTime: 0,
      loginForm: {
        username: '',
        password: '',
        RememberUserPassword: false,
        RememberMe: false,
        verify: 201700816
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.user.realName
    },
    hasLogin() {
      return this.$store.state.user.userid
    }
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
    this.loadLoginSetting()
    getUserBase('', true).then(data => {
      if (data) {
        Message({
          message: '欢迎您,' + data.base.realName,
          type: 'success',
          duration: 5000
        })
      }
    })
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && key >= 'a' && key <= 'z') ||
          (!shiftKey && key >= 'A' && key <= 'Z')
        ) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleReg() {
      this.$store.state.user.isToRegister = true
      this.$router.push({ path: '/register' })
    },
    loadLoginSetting() {
      var loginSetting = getLoginSetting()
      this.loginForm.RememberUserPassword = loginSetting.RememberUserPassword
      this.loginForm.RememberMe = loginSetting.RememberMe

      this.loginForm.username = loginSetting.username
      if (this.loginForm.RememberUserPassword) {
        this.loginForm.password = passwordCache(loginSetting.username)
      }
      if (this.loginForm.RememberMe && !this.$store.state.user.isUserLogout) {
        this.loading = true
        setTimeout(() => {
          if (!this.loginForm.RememberMe) {
            this.loading = false
            return this.$message.warning('自动登录被终止')
          } else if (this.$store.state.user.isUserLogout || this.hasLogin) {
            this.$emit('login', true)
            this.loading = false
            return
          }
          this.handleLogin()
        }, 2000)
      }
    },
    saveLoginSetting() {
      var setting = Object.assign({}, this.loginForm)
      setLoginSetting(setting)
    },
    handleLogin() {
      this.loading = true
      this.$store
        .dispatch('user/login', this.loginForm)
        .then(data => {
          Message({
            message: '登录成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.$emit('login', true)
          this.$store.dispatch('app/reload', { complete: false })
        })
        .catch(e => {
          this.showLoginFailTip(e)
          this.$emit('login', false)
        })
        .finally(() => {
          this.saveLoginSetting()
          this.loading = false
        })
    },
    showLoginFailTip(e) {
      var msg = ''
      var title = ''
      switch (e.status) {
        case 12440: {
          title = '账号审批未通过且有紧急情况需报假?'
          msg = '可联系本级领导或管理员完成账号的审批'
          break
        }
        case 12450: {
          title = '账号审批被退回?'
          msg =
            '进入注册页面 选中【切换到审批模式】、搜索本人姓名找到本人账号、修改正确信息并重新提交'
          break
        }
        case 11500: {
          this.wrongTime++
          if (this.wrongTime % 3 === 0 || this.wrongTime > 10) {
            title = '不记得密码了?'
            msg = '尝试<a href="/#/forget">点击此处</a>找回密码'
          }
        }
      }
      var opt = {
        title: title,
        message: msg,
        dangerouslyUseHTMLString: true,
        type: 'info',
        duration: 10000
      }
      if (msg) {
        this.$message(opt)
      }
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/serfend/vue-element-admin/pull/927 */

$bg: #ccc;
$light_gray: #222;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #aaa;
$dark_gray: #889aa4;
$light_gray: #222;

.login-form {
  position: relative;
  max-width: 500px;
  min-width: 300px;
  margin: 0 auto;
  overflow: hidden;
}

.tips {
  font-size: 14px;
  color: #fff;
  margin-bottom: 10px;

  span {
    &:first-of-type {
      margin-right: 16px;
    }
  }
}

.title-container {
  position: relative;

  .title {
    font-size: 26px;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }

  .set-language {
    color: #333;
    position: absolute;
    top: 3px;
    font-size: 18px;
    right: 0px;
    cursor: pointer;
  }
}

.show-pwd {
  position: absolute;
  right: 10px;
  top: 7px;
  font-size: 16px;
  color: $dark_gray;
  cursor: pointer;
  user-select: none;
}
</style>
