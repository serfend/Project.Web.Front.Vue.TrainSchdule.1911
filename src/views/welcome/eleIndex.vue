<template>
  <el-container>
    <div class="element">
      <div class="container">
        <router-link to="/application/newApply">
          <div :class="isActive==0?'menuactive':'menu'" @mouseenter="changeActive(0)">
            <div class="description">
              <svg-icon icon-class="menu-apply" />
              <div>个人提交休假申请窗口</div>
            </div>
            <div class="title">{{ $t('application.new') }}</div>
          </div>
        </router-link>
        <router-link to="/register/main">
          <div
            :class="isActive==1?'menuactive':'menu'"
            @mouseenter="changeActive(1)"
            @click.prevent="authRegisterUser(dutyType==='')"
          >
            <div class="description">
              <svg-icon :icon-class="dutyType===''?'注册':'menu-approval'" />
              <div>审批各单位注册新账号窗口</div>
            </div>
            <div class="title">{{ dutyType===''?$t('register.new'):$t('register.audit') }}</div>
          </div>
        </router-link>
        <router-link to="login?redirect=/application/queryAndAuditApplies">
          <div :class="isActive==2?'menuactive':'menu'" @mouseenter="changeActive(2)">
            <div class="description">
              <svg-icon icon-class="menu-search" />
              <div class="description">查询批假情况和审批单位休假窗口</div>
            </div>
            <div class="title">{{ dutyType===''?$t('application.query'):$t('application.audit') }}</div>
          </div>
        </router-link>
        <router-link to="/welcome">
          <div :class="isActive==3?'menuactive':'menu'" class="menu" @mouseenter="changeActive(3)">
            <div class="description">
              <svg-icon icon-class="menu-search" />
              <div class="description">个人休假情况概览窗口（暂未开放）</div>
            </div>
            <div class="title">{{ $t('application.my') }}</div>
          </div>
        </router-link>
      </div>
    </div>
  </el-container>
</template>

<script>
import AppIcon from '@/components/AppIcon'
export default {
  name: 'welcome',
  components: { AppIcon },
  data() {
    return {
      isActive: 0
    }
  },
  computed: {
    dutyType() {
      return this.$store.state.user.dutiesType
    }
  },
  methods: {
    authRegisterUser(isToRegister) {
      this.$store.state.user.isToRegister = isToRegister
      return this.$router.push(`/register/main`)
    },
    changeActive(index) {
      this.isActive = index
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
/*背景局部清晰*/
.el-container {
  background: url("../../assets/jpg/bg.jpg") no-repeat center center;
  background-size: 100%;
  height: 100%;
  background-size: cover;
  background-attachment: fixed;
  background-color: #cccccc;
}
.container {
  height: 100%;
  width: 100%;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, 0.3);
  overflow: hidden;

  display: flex;
}
.container::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  filter: blur(80px);
  z-index: -1;
  margin: -30px;
}
.element {
  width: 900px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto; /* 有了这个就自动居中了 */
  background: inherit;
}
body {
  height: 100vh;
  background: -webkit-radial-gradient(center, #c2e59c, #64b3f4);
  background: radial-gradient(center, #c2e59c, #64b3f4);
}
.container {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.menu {
  width: 100px;
  height: 100%;
  background: #4483cf;
  text-align: center;
  font-size: 45px;
  color: #1607c0;
  border: solid 1px #3383af;
  opacity: 0.5;
  transition: all 0.5s;
  margin: 0px 0.2em;
  border-radius: 6px;
}

.menuactive {
  width: 500px;
  height: 100%;
  background: #4483cf;
  text-align: center;
  font-size: 45px;
  color: #1607c0;
  border: solid 1px #3383af;
  opacity: 1;
  transition: all 0.5s;
  margin: 0px 0.2em;
  border-radius: 6px;

  box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  color: #ffffff;
}

.title {
  box-sizing: border-box;
  width: 100px;
  height: 100%;
  display: flex;
  -webkit-writing-mode: vertical-rl;
  writing-mode: vertical-rl;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  font-size: 22px;
  letter-spacing: 1em !important;
  font-weight: bold;
  white-space: nowrap;
  margin: 0px;
  padding: 1em;
}

.description {
  font-size: 10px;
  color: #3f3f3f;
}
.menu:nth-child(4),
.menu:nth-child(7) {
  clear: left;
}
</style>