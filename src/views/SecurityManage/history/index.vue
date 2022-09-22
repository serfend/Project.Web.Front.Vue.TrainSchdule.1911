<template>
  <div>
    <el-row class="row">
      <el-card>
        <h1 class="center">
          <span>历史上的今天</span>
          <span class="center-date">2022年9月22日</span>
        </h1>
      </el-card>
    </el-row>
    <el-row :gutter="20" class="row">
      <el-col :span="8">
        <EventList />
      </el-col>
      <el-col :span="16">
        <el-card>
          详情
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'SecurityManage',
  components: {
    EventList: () => import('../event/EventList')
  }
}
</script>
<style lang="scss" scoped>
.center {
  text-align: center;
}
.center-date{
  color:#f00;
}
.row{
  margin-bottom:1rem;
}
</style>
