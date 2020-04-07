<template>
  <el-container>
    <div style="margin:40px;width:100%">
      <el-row style="width:100%">
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
    </div>
  </el-container>
</template>

<script>
import AppIcon from '@/components/AppIcon'
export default {
  name: 'Welcome',
  components: { AppIcon },
  data() {
    return {
      list: []
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    refresh() {
      this.list = [
        {
          id: '1',
          label: '我要休假',
          description: '个人提交休假申请窗口',
          svg: 'menu-apply',
          href: '/application/newApply'
        },
        {
          id: '2',
          label: '查询和审批',
          description: '查询批假情况和审批单位休假窗口',
          //icon: '/favicon.png',
          svg: 'menu-search',
          href: '/login?redirect=/application/queryAndAuditApplies'
        },
        {
          id: '3',
          label: '注册账号',
          description: '注册和审批新账号窗口',
          svg: '注册',
          //icon: '/favicon.png',
          href: '/register/main'
        },
        {
          id: '4',
          label: '我的休假',
          description: '个人休假情况概览窗口（暂未开放）',
          // icon: '/favicon.png',
          svg: 'menu-approval',
          href: '/welcome'
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
