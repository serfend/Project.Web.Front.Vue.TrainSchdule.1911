<template>
  <el-container>
    <el-aside>
      <div class="menu-item1">
        <div>
          <img src="/favicon-32x32.png" style="width:40px;">
        </div>
        <div class="menu-item1-title">61035部队</div>
        <div class="menu-item1-title">休假登记和审核系统</div>
      </div>
      <router-link to="application/new">
        <div class="menu-item2">
          <div>
            <svg-icon icon-class="menu-apply" />申请休假
          </div>
          <div class="menu-des">个人提交休假申请窗口</div>
        </div>
      </router-link>
      <router-link to="login?redirect=application/list">
        <div class="menu-item2">
          <div>
            <svg-icon icon-class="menu-search" />查询结果
          </div>
          <div class="menu-des">个人查询休假审批状态窗口</div>
        </div>
      </router-link>
      <router-link to="login?redirect=application/examine">
        <div class="menu-item2">
          <div>
            <svg-icon icon-class="menu-approval" />审核申请
          </div>
          <div class="menu-des">单位逐级报批休假窗口</div>
        </div>
      </router-link>
    </el-aside>
    <el-main />
  </el-container>
  <!--<div class="welcome d-flex align-center">

     <el-rows
      class="row-bg"
      justify="space-around"
      type="flex"
    >
      <el-col
        :md="6"
        :sm="24"
      >
        <router-link to="application/new">
          <el-card
            :body-style="{ padding: '0px' }"
            class="welcome-card"
          >
            <div class="title">
              <span>创建申请</span>
            </div>
            <svg-icon icon-class="测试申请" />
          </el-card>
        </router-link>
      </el-col>
      <el-col
        :md="6"
        :sm="24"
      >
        <router-link to="login?redirect=application/examine">
          <el-card
            :body-style="{ padding: '0px' }"
            class="welcome-card"
          >
            <div class="title">
              <span>审核申请</span>
            </div>
            <svg-icon icon-class="提案审批" />
          </el-card>
        </router-link>
      </el-col>
      <el-col
        :md="6"
        :sm="24"
      >
        <router-link to="login?redirect=application/list">
          <el-card
            :body-style="{ padding: '0px' }"
            class="welcome-card"
          >
            <div class="title">
              <span>查询申请</span>
            </div>
            <svg-icon icon-class="无序排列" />
          </el-card>
        </router-link>
      </el-col>
    </el-row>
  </div>-->
</template>

<script>
export default {
  name: '',
  data() {
    return {
      show: false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  background: url(../../assets/jpg/bg.jpg) no-repeat center center;
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
.menu-item1 {
  color: rgb(25, 143, 255);
  font-weight: bold;
  background: rgba(255, 255, 255, 0.3);
  height: 23%;
  text-align: center;
  border-bottom: #808082 1px solid;
  border-right: #808082 1px solid;
  vertical-align: middle;
  font-size: 1.15rem;
  padding-top: 10%;
  letter-spacing: 2px;
  svg {
    font-size: 3.2rem;
    vertical-align: middle;
    margin-right: 20px;
  }
  .menu-item1-title {
    line-height: 25px;
  }
}
.menu-item2 {
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
  svg {
    font-size: 3.2rem;
    vertical-align: middle;
    margin-right: 25px;
  }
  .menu-des {
    margin-top: -20px;
    opacity: 0;
    font-size: 1rem;
    transition: margin-top 0.5s, opacity 1s ease-out;
  }
}
.menu-item2:hover {
  .menu-des {
    opacity: 1;
    margin-top: 0;
  }
}
.menu-item2:hover::before {
  .menu-des {
    opacity: 0;
    margin-top: 0;
  }
}

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
