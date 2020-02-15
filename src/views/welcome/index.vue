<template>
  <el-container>
    <el-aside>
      <div class="menu-top">
        <div>
          <img src="/favicon-32x32.png" style="width:40px;">
        </div>
        <div class="menu-top-title" hidden="none">default.system.company.name</div>
        <div class="menu-top-title">{{ $t('default.system.project.name') }}</div>
      </div>
      <router-link to="/application/newApply">
        <div class="menu">
          <div>
            <svg-icon icon-class="menu-apply" />
            {{ $t('application.new') }}
          </div>
          <div class="menu-des">个人提交休假申请窗口</div>
        </div>
      </router-link>
      <router-link to="login?redirect=/application/queryAndAuditApplies">
        <div class="menu">
          <div>
            <svg-icon icon-class="menu-search" />
            {{ $t('application.query') }}
          </div>
          <div class="menu-des">查询批假情况和审批单位休假窗口</div>
        </div>
      </router-link>
      <router-link to="welcome">
        <div class="menu" @click.prevent="authRegisterUser(dutyType==='')">
          <div>
            <svg-icon :icon-class="dutyType===''?'menu-audit':'menu-register'" />
            {{ dutyType===''?'注册':$t('register.audit') }}
          </div>
          <div class="menu-des">审批各单位注册新账号窗口</div>
        </div>
      </router-link>
      <router-link to="login?redirect=404">
        <div class="menu">
          <div>
            <svg-icon icon-class="menu-approval" />
            {{ $t('application.my') }}
          </div>
          <div class="menu-des">个人休假情况概览窗口（暂未开放）</div>
        </div>
      </router-link>
    </el-aside>
    <el-main />
  </el-container>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      show: false
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
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  background: url("../../assets/jpg/bg.jpg") no-repeat center center;
  background-size: 100%;
  height: 100%;
  background-size: cover;
  background-attachment: fixed;
  background-color: #cccccc;
}
.el-aside {
  padding: 0;
  margin-bottom: 0 !important;
  background: rgba(255, 255, 255, 0.4);
  width: 300px;
}
.menu-top {
  color: rgb(25, 143, 255);
  font-weight: bold;
  background: rgba(255, 255, 255, 0.3);
  height: 23%;
  text-align: center;
  border-bottom: #808082 1px solid;
  border-right: #808082 1px solid;
  vertical-align: middle;
  font-size: 1.15rem;
  padding-top: 15%;
  letter-spacing: 2px;
  svg {
    font-size: 3.2rem;
    vertical-align: middle;
    margin-right: 20px;
  }
  .menu-top-title {
    line-height: 25px;
  }
}
.menu {
  color: rgb(25, 143, 255);
  font-weight: bold;
  background: rgba(255, 255, 255, 0.3);
  height: 23%;
  text-align: center;
  border-bottom: #808082 1px solid;
  border-right: #808082 1px solid;
  vertical-align: middle;
  font-size: 1.15rem;
  letter-spacing: 2px;
  display: flex;
  align-items: center; /*定义body的元素垂直居中*/
  justify-content: center; /*定义body的里的元素水平居中*/
  min-height: 150px;
  flex-direction: column;
  //图标
  svg {
    font-size: 3.2rem;
    vertical-align: middle;
    margin-right: 25px;
  }
  // 描述
  .menu-des {
    margin-top: -20px;
    opacity: 0;
    font-size: 1rem;
    transition: margin-top 0.5s, opacity 1s ease-out;
  }
}
.menu:hover {
  .menu-des {
    opacity: 1;
    margin-top: 0;
  }
}
// .menu-item2:hover::before {
//   .menu-des {
//     opacity: 0;
//     margin-top: 0;
//   }
// }

// .welcome {
//   background-color: #2d3a4b;
//   height: 100vh;
//   padding: 5% 12%;
//   .image {
//     width: 100%;
//     height: 400px;
//   }

//   .welcome-card.el-card {
//     &.is-always-shadow:hover {
//       background: #2d3a4b;
//       transition: all ease 0.2s;
//     }

//     &.is-always-shadow:hover .title {
//       color: white;
//     }

//     &.is-always-shadow .svg-icon {
//       width: 100%;
//       height: 15em;
//       padding: 12px 24px;
//     }

//     &.is-always-shadow:hover .svg-icon {
//       vertical-align: -0.15em;
//       transform: scale(1.1);
//       color: white;
//       transition: all ease 0.2s;
//     }
//   }

//   .title {
//     padding: 12px;
//   }
// }
</style>
