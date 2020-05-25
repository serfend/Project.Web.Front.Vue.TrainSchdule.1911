<template>
  <el-footer height="2em" class="footer" :style="{opacity:show?1:0}">
    <el-popover placement="top" trigger="hover" @show="contactMeHasShow = true">
      <ContactMe v-if="contactMeHasShow" content="https://u.wechat.com/MKXY9nIvV-9oPgMNhB4cd58" />
      <el-link slot="reference" type="primary">联系我们</el-link>
    </el-popover>
    <el-popover placement="top" trigger="hover" @show="helpMeHasShow = true">
      <ContactMe
        v-if="helpMeHasShow"
        content="https://serfend.top/s/b4afa7"
        description="扫码反馈意见/问题"
      />
      <el-link slot="reference" type="primary" href="http://192.168.8.8/newbbs">用户反馈</el-link>
    </el-popover>
    <el-popover placement="top" trigger="hover" @show="policyHasShow = true">
      <ContactMe
        v-if="policyHasShow"
        content="https://serfend.top/s/policy_vacation.md"
        description="扫码查看相关政策"
      />
      <el-link slot="reference" type="primary" href="http://192.168.8.8/newbbs">相关政策</el-link>
    </el-popover>
  </el-footer>
</template>

<script>
import ContactMe from '@/components/ContactMe'

export default {
  name: 'Footer',
  components: { ContactMe },
  props: {
    show: { type: Boolean, default: true }
  },
  data: () => ({
    contactMeHasShow: false,
    helpMeHasShow: false,
    policyHasShow: false
  })
}
</script>
<style lang="scss" scoped>
.footer {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  transition: all 0.5s;
  background: #f5f6f53f;
  border-top: 1px solid #ebebeb9f;
  line-height: 1.5em;
  font-size: 1em;
  .el-link {
    font-size: 0.8em;
    margin-left: 1em;
  }
}
.footer:hover {
  background: #f5f6f5;
  border-top: 1px solid #ebebeb;
}
</style>
