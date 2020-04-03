<template>
  <el-card class="content-card">
    <h3 slot="header">{{ $t('application.auditStream') }}</h3>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="说明" name="ApplyStreamAbout">
        <ApplyStreamAbout />
      </el-tab-pane>
      <el-tab-pane label="方案规则" name="ApplyStreamSolution">
        <ApplyStreamSolution />
      </el-tab-pane>
      <el-tab-pane label="方案项" name="ApplyAuditStream">
        <ApplyAuditStream />
      </el-tab-pane>
      <el-tab-pane label="流节点" name="ApplyAuditStreamAction">
        <ApplyAuditStreamAction />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import ApplyStreamAbout from './components/ApplyStreamAbout'
import ApplyStreamSolution from './components/ApplyStreamSolution'
import ApplyAuditStream from './components/ApplyAuditStream'
import ApplyAuditStreamAction from './components/ApplyAuditStreamAction'
export default {
  name: 'ApplyStream',
  components: {
    ApplyStreamSolution,
    ApplyAuditStream,
    ApplyAuditStreamAction,
    ApplyStreamAbout
  },
  data() {
    return {
      activeName: 'ApplyStreamAbout'
    }
  },
  methods: {
    handleClick(val) {
      console.log(val)
    }
  }
}
</script>

<style scoped>
.content-card {
  padding-top: 20px;
}
</style>
