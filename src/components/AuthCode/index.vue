<template>
  <el-collapse>
    <el-collapse-item title="授权人">
      <template slot="title">
        <div v-if="$store.state.user.name">
          <el-tooltip>
            <template slot="content">默认为当前登录</template>
            <el-tag>{{ $store.state.user.name }}</el-tag>
          </el-tooltip>
        </div>
        <span v-else style="color:#ff8f8f">未登录,请使用授权码</span>

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
            <div v-if="authKeyUrl">
              <el-row />后扫描此码以获取密钥
              <el-row />
              <el-image :src="authKeyUrl" style="width:200px" />
            </div>
            <div v-else>
              <el-alert title="当前未登录,登录后显示授权码" type="error" center />
            </div>
          </div>
          <el-tag type="info" style="margin:0 0 0 20px">
            什么是授权码
            <i class="el-icon-info blue--text" />
          </el-tag>
        </el-tooltip>
      </template>
      <el-form>
        <el-form-item label="授权人">
          <el-input v-model="innerForm.authByUserId" placeholder="请输入授权人的账户" />
        </el-form-item>
        <el-form-item label="安全码">
          <el-input v-model="innerForm.code" placeholder="请输入安全码" @change="checkCode">
            <template slot="suffix">
              <el-tooltip :content="invalid.code.des">
                <i v-if="invalid.code.status" class="el-icon-error" style="color:#F56C6C" />
                <i v-else class="el-icon-success" style="color:#67C23A" />
              </el-tooltip>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import apkImage from '@/assets/jpg/apk.jpg'

import { getAuthKey, checkAuthCode } from '@/api/account'
export default {
  name: 'AuthCode',
  props: {
    form: {
      type: Object,
      default() {
        return this.innerForm
      }
    },
    authCheckMethod: {
      type: Function,
      default() {
        return checkAuthCode
      }
    }
  },
  data() {
    return {
      authKeyUrl: null,
      apkImage: apkImage,
      innerForm: {
        authByUserId: null,
        code: null
      },
      invalid: {
        code: {
          status: false,
          des: ''
        }
      }
    }
  },
  watch: {
    innerForm: {
      handler(val, oldVal) {
        if (val.authByUserId === '') val.authByUserId = null
        if (val.code === '') val.code = null
        this.$emit('update:form', val)
      },
      deep: true
    }
  },
  mounted() {
    this.innerForm.authByUserId = this.$store.state.user.userid
    this.getAuthKeyImg()
  },
  methods: {
    getAuthKeyImg() {
      getAuthKey(true).then(r => {
        if (r.url) this.authKeyUrl = 'data:image/png;base64,' + r.url
        if (
          !this.$store.state.user.data.isInitPassword &&
          this.$store.state.user.userid !== ''
        ) {
          this.$message.error('注册以来密码从未被修改')
          setTimeout(() => {
            this.$message.error('为了您账号安全，建议尽快更换')
          }, 1000)
        }
      })
    },
    checkCode() {
      var fn = this.authCheckMethod
      var p = fn(this.innerForm.authByUserId, this.innerForm.code, true)
      p(this.innerForm.authByUserId, this.innerForm.code, true)
        .then(() => {
          this.$emit('update:status', true)
          this.invalid.code.status = false
          this.invalid.code.des = '验证成功'
        })
        .catch(err => {
          this.$emit('update:status', false)
          this.invalid.code.status = true
          this.invalid.code.des = err.message
        })
    }
  }
}
</script>

<style>
</style>
