<template>
  <div class="welcome d-flex align-center">
    <el-row
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
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.welcome {
  background-color: #2d3a4b;
  height: 100vh;
  padding: 5% 12%;
  .image {
    width: 100%;
    height: 400px;
  }

  .welcome-card.el-card {
    &.is-always-shadow:hover {
      background: #2d3a4b;
      transition: all ease 0.2s;
    }

    &.is-always-shadow:hover .title {
      color: white;
    }

    &.is-always-shadow .svg-icon {
      width: 100%;
      height: 15em;
      padding: 12px 24px;
    }

    &.is-always-shadow:hover .svg-icon {
      vertical-align: -0.15em;
      transform: scale(1.1);
      color: white;
      transition: all ease 0.2s;
    }
  }

  .title {
    padding: 12px;
  }
}
</style>
