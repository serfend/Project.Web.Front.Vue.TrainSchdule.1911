<template>
  <el-container>
    <div style="width:100%">
      <el-main>
        <el-row v-if="showTitle" type="flex">
          <div>
            <span style="color:#ffffff;font-size:2em">{{ $store.state.settings.title }}</span>
            <span style="color:#aaaaaa;font-size:0.8em">{{ $store.state.settings.version }}</span>
          </div>
        </el-row>
        <el-divider v-if="showTitle" />
        <el-row>
          <el-col v-for="i in innerList" :key="i.id" :xs="12" :sm="8" :md="6" :lg="4">
            <AppIcon
              style="margin:3em 2em"
              :icon="i.icon"
              :svg="i.svg"
              :size="8"
              :label="i.label"
              :description="i.description"
              @click="lintTo(i)"
            />
          </el-col>
        </el-row>
        <Footer />
      </el-main>
    </div>
  </el-container>
</template>

<script>
import AppIcon from '@/components/AppIcon'
import Footer from './Footer'
export default {
  name: 'Welcome',
  components: { AppIcon, Footer },
  props: {
    showTitle: {
      type: Boolean,
      default: true
    },
    list: {
      type: Array,
      default() {
        return [
          {
            label: '注册账号',
            description: '注册和审批新账号窗口',
            svg: 'registernew',
            // icon: '/favicon.png',
            href: '/register?isRegister=true'
          },
          {
            label: '我要休假',
            description: '个人提交休假申请窗口',
            svg: 'newapply',
            href: '/application/newApply'
          },
          {
            label: '我的假期',
            description: '个人休假情况概览窗口',
            // icon: '/favicon.png',
            svg: 'people_fill',
            href: '/application/myApply'
          },
          {
            label: '休假审批',
            description: '查询批假情况和审批单位休假窗口',
            // icon: '/favicon.png',
            svg: 'auditapply',
            href: '/application/queryAndAuditApplies'
          },
          {
            label: '统计信息',
            description: '各单位休假情况统计驾驶舱',
            // icon: '/favicon.png',
            svg: 'dashboard',
            href: '/dashboard'
          }
        ]
      }
    }
  },
  data() {
    return {
      qrCodeUrl: '',
      innerList: []
    }
  },
  watch: {
    list: {
      handler(val) {
        if (!val) return
        var result = []
        var vLen = val.length
        for (var j = 0; j < vLen; j++) {
          result.push(Object.assign(val[j], { id: Math.random() }))
        }
        this.innerList = result
      },
      immediate: true
    }
  },
  methods: {
    lintTo(item) {
      if (item.callback) {
        item.callback()
      }
      if (item.href) {
        this.$router.push(item.href)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  background-color: #cccccc;

  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-image: repeating-linear-gradient(
    to bottom,
    rgb(30, 30, 144),
    rgb(185, 157, 201),
    rgb(162, 104, 180)
  );
}
</style>
