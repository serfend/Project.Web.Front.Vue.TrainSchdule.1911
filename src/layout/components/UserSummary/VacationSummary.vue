<template>
  <el-row :gutter="20" style="width:100%">
    <el-col :span="8">
      <div class="data-show">
        <div class="data-title">天数</div>
        <el-link class="data-description" @click="toMyVacation">320</el-link>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="data-show">
        <div class="data-title">次数</div>
        <el-link class="data-description" @click="toMyVacation">5</el-link>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="data-show">
        <div class="data-title">休假率</div>
        <el-link class="data-description" @click="toMyVacation">23%</el-link>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'VacationSummary',
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  methods: {
    toMyVacation() {
      this.$router.push('/application/myapply')
    }
  }
}
</script>

<style lang="scss" scoped>
.data-show {
  display: block;
  text-align: center;
  margin: 5px;
  .data-title {
    color: #ccc;
  }
  .data-description {
    color: #000;
    font-weight: 600;
    font-size: 16px;
  }
}
</style>
