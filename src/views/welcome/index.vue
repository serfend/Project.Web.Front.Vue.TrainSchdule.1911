<template>
  <el-container>
    <div style="width:100%">
      <el-main>
        <el-row v-if="showTitle" type="flex">
          <div>
            <span style="color:#ffffff;font-size:2em">休假登记和审核系统</span>
            <span style="color:#aaaaaa;font-size:0.8em">v1.0.0</span>
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
      </el-main>

      <el-footer height="2em" class="footer">
        <el-popover placement="top" trigger="hover" @show="contactMeHasShow = true">
          <ContactMe
            v-if="contactMeHasShow"
            content="https://u.wechat.com/MPTgt41EIncEhLhBIGPovMo"
          />
          <el-link slot="reference" type="primary">联系我们</el-link>
        </el-popover>
        <el-popover placement="top" trigger="hover" @show="helpMeHasShow = true">
          <ContactMe
            v-if="helpMeHasShow"
            content="http://39.97.229.104/s/b4afa7"
            description="扫码反馈意见/问题"
          />
          <el-link slot="reference" type="primary" href="http://192.168.8.8/newbbs">用户反馈</el-link>
        </el-popover>
        <el-popover placement="top" trigger="hover" @show="helpMeHasShow = true">
          <ContactMe
            v-if="helpMeHasShow"
            content="http://39.97.229.104/s/policy"
            description="扫码查看相关政策"
          />
          <el-link slot="reference" type="primary" href="http://192.168.8.8/newbbs">相关政策</el-link>
        </el-popover>
      </el-footer>
    </div>
  </el-container>
</template>

<script>
import AppIcon from '@/components/AppIcon'
import ContactMe from '@/components/ContactMe'
export default {
  name: 'Welcome',
  components: { AppIcon, ContactMe },
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
            svg: '注册',
            // icon: '/favicon.png',
            href: '/register'
          },
          {
            label: '我要休假',
            description: '个人提交休假申请窗口',
            svg: '测试申请',
            href: '/login?redirect=/application/newApply'
          },
          {
            label: '我的假期',
            description: '个人休假情况概览窗口',
            // icon: '/favicon.png',
            svg: 'people_fill',
            href: '/login?redirect=/application/myApply'
          },
          {
            label: '休假审批',
            description: '查询批假情况和审批单位休假窗口',
            // icon: '/favicon.png',
            svg: '提案审批',
            href: '/login?redirect=/application/queryAndAuditApplies'
          },
          {
            label: '统计情况',
            description: '各单位休假情况统计操作仓',
            // icon: '/favicon.png',
            svg: 'dashboard',
            href: '/login?redirect=/dashboard'
          }
        ]
      }
    }
  },
  data() {
    return {
      qrCodeUrl: '',
      innerList: [],
      contactMeHasShow: false,
      helpMeHasShow: false
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
.footer {
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  transition: all 0.5s;
  background: #f5f6f59f;
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
