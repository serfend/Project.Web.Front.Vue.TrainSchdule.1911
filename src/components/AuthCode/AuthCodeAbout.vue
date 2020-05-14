<template>
  <el-tooltip placement="top" effect="light">
    <div slot="content">
      <div>授权码是用于敏感操作认证的密钥</div>
      <div>
        <el-popover placement="top" trigger="hover" @show="downloadAutherHasShow = true">
          <ContactMe v-if="downloadAutherHasShow" content="双重验证码" description="搜索微信小程序【双重验证码】" />
          <el-link slot="reference" type="primary">获取身份验证器</el-link>
        </el-popover>
      </div>
      <div v-if="authKeyUrl">
        <el-popover placement="top" trigger="hover" @show="authKeyUrlHasShow = true">
          <ContactMe
            v-if="authKeyUrlHasShow"
            :content="authKeyUrl"
            description="请使用身份验证器扫描此码（仅首次需要）"
          />
          <el-link slot="reference" type="primary">获取当前账号授权码</el-link>
        </el-popover>
      </div>
      <div v-if="$store.state.user.name&&authKeyUrl">
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

<script>
import { getAuthKey } from '@/api/account'
import ContactMe from '@/components/ContactMe'

export default {
  name: 'AuthCodeAbout',
  components: { ContactMe },
  data: () => ({
    downloadAutherHasShow: false,
    authKeyUrlHasShow: false,
    authKeyUrl: null
  }),
  mounted() {
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
    }
  }
}
</script>

<style>
</style>
