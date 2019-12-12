<template>
  <el-dialog
    :title="title"
    :visible.sync="showMain"
    class="register-container"
    @closed="returnToLogin"
  >
    <el-form
      ref="registerForm"
      :model="registerForm"
      auto-complete="on"
      class="register-form"
      label-position="left"
    >
      <lang-select class="set-language" />

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="registerForm.password"
          :placeholder="$t('login.password')"
          :type="passwordType"
          name="password"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item prop="confirm">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="confirmType"
          ref="confirm"
          v-model="registerForm.confirm"
          :placeholder="$t('register.confirmPassword')"
          :type="confirmType"
          name="confirm"
        />
        <span class="show-pwd" @click="showConfirmPwd">
          <svg-icon :icon-class="confirmType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
    </el-form>
    <transition name="el-zoom-in-center">
      <div v-show="!loading" class="transition-box">
        <el-button
          :loading="loading"
          style="width:100%"
          type="primary"
          @click.native.prevent="handleSubmit"
        >{{ $t('register.submit') }}</el-button>
      </div>
    </transition>
    <el-dialog :title="$t('register.checkemail')" :visible.sync="showDialog">
      {{ $t('register.emailstatus') }}
      <social-sign />
    </el-dialog>
  </el-dialog>
</template>

<script>
import LangSelect from '@/components/LangSelect'
import { setTimeout } from 'timers'
export default {
  name: 'Register',
  components: { LangSelect },
  data() {
    // const validatePassword = (rule, value, callback) => {
    //   if (value.length < 6) {
    //     callback(new Error(this.$t('login.validate.psw.len')))
    //   } else {
    //     callback()
    //   }
    // }
    // const validateConfirmPassword = (rule, value, callback) => {
    //   if (value.trim().length === 0) {
    //     callback(new Error(this.$t('register.validate.psw.confirmRequired')))
    //   } else if (value !== this.registerForm.password) {
    //     callback(new Error(this.$t('register.validate.psw.inconform')))
    //   } else {
    //     callback()
    //   }
    // }
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
      passwordType: 'password',
      confirmType: 'password',
      loading: true,
      showDialog: false,
      redirect: undefined,
      title: '',
      showMain: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    this.showMain = true
    this.loading = false
    this.title = this.$t('register.title')
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    setCompany(value) {
      this.registerForm.company = value
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
    showConfirmPwd() {
      if (this.confirmType === 'password') {
        this.confirmType = ''
      } else {
        this.confirmType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.confirm.focus()
      })
    },
    returnToLogin() {
      this.$router.push({ path: '/login' })
    },
    handleSubmit() {
      this.loading = true
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.$store
            .dispatch('user/register', this.registerForm)
            .then(res => {
              this.$message({
                message: this.$t('register.success'),
                type: 'success'
              })
              setTimeout(() => {
                this.returnToLogin()
                this.loading = false
              }, 500)
            })
            .catch(() => {
              setTimeout(() => {
                console.log('fail')
                this.loading = false
              }, 500)
            })
        } else {
          console.log('error submit!!')
          setTimeout(() => (this.loading = false), 500)
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/Serfend/vue-element-admin/pull/927 */

$bg: #333333;
$light_gray: #888;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .register-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.register-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      border-radius: 0px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
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
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.register-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .register-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    // padding: 160px 5px 160px;
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

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 10px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
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

  .thirdparty-button {
    float: right;
    right: 0;
    margin-left: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
