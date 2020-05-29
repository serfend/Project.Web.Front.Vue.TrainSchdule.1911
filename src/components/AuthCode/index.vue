<template>
  <el-collapse
    style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
    @change="collaspseOpen"
  >
    <el-collapse-item title="授权人">
      <template slot="title">
        <AuthCodeAbout />
        <div v-if="$store.state.user.name">
          <el-tooltip>
            <template slot="content">默认为当前登录</template>
            <el-tag type="success">{{ $store.state.user.name }}</el-tag>
          </el-tooltip>
        </div>
        <span v-else style="color:#ff8f8f">未登录,请使用授权码</span>
      </template>
      <el-form>
        <el-form-item label="授权人">
          <UserSelector :code.sync="innerForm.authByUserId" :default-info="defaultUser" />
        </el-form-item>
        <el-form-item label="授权码">
          <CodeInput
            :listen-user-input.sync="collaspseIsOpen"
            :check-code-method="checkCode"
            :code.sync="innerForm.code"
          />
        </el-form-item>
      </el-form>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import AuthCodeAbout from './AuthCodeAbout'
import CodeInput from './CodeInput'
import UserSelector from '@/components/User/UserSelector'
import { checkAuthCode } from '@/api/account'
import { getUserIdByCid } from '@/api/user/userinfo'
export default {
  name: 'AuthCode',
  components: {
    CodeInput,
    AuthCodeAbout,
    UserSelector
  },
  props: {
    authCheckMethod: {
      type: Function,
      default: checkAuthCode
    }
  },
  data() {
    return {
      collaspseIsOpen: false,
      innerForm: {
        authByUserId: null,
        code: null
      },
      defaultUser: null
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
    setTimeout(() => {
      this.innerForm.authByUserId = this.$store.state.user.userid
      var id = this.$store.state.user.userid
      this.defaultUser = `${this.$store.state.user.name}(${id})`
    }, 1000)
  },
  methods: {
    collaspseOpen(e) {
      this.collaspseIsOpen = e.length > 0
    },
    checkCode() {
      return new Promise((res, rej) => {
        if (!this.innerForm.authByUserId) {
          this.$message.error('请输入id')
          return rej('id未输入')
        }
        const fn = this.authCheckMethod
        fn(this.innerForm.authByUserId, this.innerForm.code)
          .then(() => {
            this.$emit('update:status', true)
            res()
          })
          .catch(err => {
            this.$emit('update:status', false)
            rej(err)
          })
      })
    }
  }
}
</script>
