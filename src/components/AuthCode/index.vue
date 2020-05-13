<template>
  <el-collapse>
    <el-collapse-item title="授权人">
      <template slot="title">
        <div v-if="$store.state.user.name">
          <el-tooltip>
            <template slot="content">默认为当前登录</template>
            <el-tag type="success">{{ $store.state.user.name }}</el-tag>
          </el-tooltip>
        </div>
        <span v-else style="color:#ff8f8f">未登录,请使用授权码</span>

        <el-tooltip placement="top" effect="light">
          <div slot="content">
            <div>授权码是用于敏感操作认证的密钥</div>
            <div>
              <el-popover placement="top" trigger="hover" @show="downloadAutherHasShow = true">
                <ContactMe
                  v-if="downloadAutherHasShow"
                  content="双重验证码"
                  description="搜索微信小程序【双重验证码】"
                />
                <el-link slot="reference" type="primary">获取身份验证器</el-link>
              </el-popover>
            </div>
            <div>
              <el-popover placement="top" trigger="hover" @show="authKeyUrlHasShow = true">
                <ContactMe
                  v-if="authKeyUrlHasShow"
                  :content="authKeyUrl"
                  description="请使用身份验证器扫描此码（仅首次需要）"
                />
                <el-link slot="reference" type="primary">获取当前账号授权码</el-link>
              </el-popover>
            </div>
            <div v-if="$store.state.user.name">
              <el-tag type="success">已登录无需使用授权码哦~</el-tag>
            </div>
            <div v-else>
              <el-alert title="当前未登录,登录后显示授权码" type="error" center />
            </div>
          </div>
          <el-tag type="info" style="margin:0 0 0 20px">
            <span>什么是授权码</span>
            <i class="el-icon-info blue--text" />
          </el-tag>
        </el-tooltip>
      </template>
      <el-form>
        <el-form-item label="授权人">
          <el-popover @show="forgetHasShow=true">
            <FindUserByRealName v-if="forgetHasShow" />
            <el-input
              slot="reference"
              v-model="innerForm.authByUserId"
              placeholder="请输入授权人的账户（不是姓名）"
            />
          </el-popover>
        </el-form-item>
        <el-form-item label="授权码">
          <el-input v-model="innerForm.code" placeholder="请输入授权码" @change="checkCode">
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
import FindUserByRealName from '@/views/ForgetPassword/FindUserByRealName'
import ContactMe from '@/components/ContactMe'
import { getAuthKey, checkAuthCode } from '@/api/account'
import { getUserIdByCid } from '@/api/userinfo'
export default {
  name: 'AuthCode',
  components: { ContactMe, FindUserByRealName },
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
      forgetHasShow: false,
      downloadAutherHasShow: false,
      authKeyUrlHasShow: false,
      authKeyUrl: null,
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
        if (val.code === '') val.code = null
        if (!val.authByUserId) {
          val.authByUserId = null
        } else if (val.authByUserId.length === 18) {
          getUserIdByCid(val.authByUserId, true)
            .then(data => {
              val.authByUserId = data.id
              this.$message.success(`成功转换身份证号为id`)
            })
            .finally(() => {
              this.$emit('update:form', val)
            })
        } else {
          this.$emit('update:form', val)
        }
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
        if (r.url) this.authKeyUrl = r.url
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
      fn(this.innerForm.authByUserId, this.innerForm.code, true)
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
