<template>
  <el-container>
    <div style="margin:40px;width:100%">
      <el-row type="flex" justify="space-between">
        <div>
          <span style="color:#ffffff;font-size:2em">休假登记和审核系统</span>
          <span style="color:#aaaaaa;font-size:0.8em">v1.0.0</span>
        </div>
      </el-row>
      <el-divider />
      <el-row style="width:100%;" type="flex" justify="space-between">
        <el-col v-for="i in list" :key="i.id" :xs="12" :sm="8" :md="6" :lg="4">
          <AppIcon
            style="margin:50px 20px"
            :icon="i.icon"
            :svg="i.svg"
            :size="130"
            :label="i.label"
            :description="i.description"
            @click="lintTo(i.href)"
          />
        </el-col>
      </el-row>
      <el-row style="bottom:0px;position:fixed;" type="flex" justify="space-between">
        <div style="color:#3f3f3f;font-size:0.5em;">power by serfend@2020</div>
        <el-popover placement="top" trigger="hover" @show="loadContactMe">
          <el-row>
            <el-image :src="qrCodeUrl" />
          </el-row>
          <el-row style="font-size:10px">使用微信扫一扫联系我们吧~</el-row>
          <el-link slot="reference" style="margin:0 0 0 20px;font-size:0.5em">联系我们</el-link>
        </el-popover>
      </el-row>
    </div>
  </el-container>
</template>

<script>
import AppIcon from '@/components/AppIcon'
import { qrCodeEncode } from '@/api/qrCode'
export default {
  name: 'Welcome',
  components: { AppIcon },
  data() {
    return {
      list: [],
      qrCodeUrl: ''
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    loadContactMe() {
      qrCodeEncode('https://u.wechat.com/MPTgt41EIncEhLhBIGPovMo').then(
        data => {
          this.qrCodeUrl = 'data:image/jpg;base64,' + data.img
        }
      )
    },
    refresh() {
      this.list = [
        {
          id: '3',
          label: '注册账号',
          description: '注册和审批新账号窗口',
          svg: '注册',
          // icon: '/favicon.png',
          href: '/register/main'
        },
        {
          id: '1',
          label: '我要休假',
          description: '个人提交休假申请窗口',
          svg: '测试申请',
          href: '/application/newApply'
        },
        {
          id: '4',
          label: '我的假期',
          description: '个人休假情况概览窗口',
          // icon: '/favicon.png',
          svg: 'people_fill',
          href: '/application/myApply'
        },
        {
          id: '2',
          label: '休假审批',
          description: '查询批假情况和审批单位休假窗口',
          // icon: '/favicon.png',
          svg: '提案审批',
          href: '/login?redirect=/application/queryAndAuditApplies'
        }
      ]
    },
    lintTo(url) {
      this.$router.push(url)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  background-size: 100%;
  background-size: cover;
  background-attachment: fixed;
  background-color: #cccccc;

  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    to bottom,
    rgb(30, 30, 144),
    rgb(185, 157, 201),
    rgb(162, 104, 180)
  );
}
</style>
