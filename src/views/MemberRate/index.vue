<template>
  <div>
    <el-card class="content-card">
      <el-tabs v-model="activeName" class="tab-container">
        <el-tab-pane label="说明" name="ApplyStreamAbout">施工中</el-tab-pane>
        <el-tab-pane label="参评组" name="ApplyStreamSolution">施工中</el-tab-pane>
        <el-tab-pane label="参评人" name="ApplyAuditStream">施工中</el-tab-pane>
        <el-tab-pane label="流节点" name="ApplyAuditStreamAction">施工中</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'MemberRate'
}
</script>

<style lang="scss"  scoped>
.content-card {
  padding-top: 20px;
}
.tab-container {
  .el-tab-pane {
    animation: fade 0.5s ease;
  }
  @keyframes fade {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
    }
  }
}
</style>
