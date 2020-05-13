<template>
  <el-card class="content-card">
    <el-tabs v-model="activeName" class="tab-container">
      <el-tab-pane label="说明" name="ApplyStreamAbout">
        <ApplyStreamAbout v-show="activeName=='ApplyStreamAbout'" />
      </el-tab-pane>
      <el-tab-pane label="方案规则" name="ApplyStreamSolution">
        <ApplyStreamSolution :loading="loading" :data="data" @refresh="solutionRuleRefresh" />
      </el-tab-pane>
      <el-tab-pane label="方案项" name="ApplyAuditStream">
        <ApplyAuditStream :loading="loading" :data="data" @refresh="solutionRefresh" />
      </el-tab-pane>
      <el-tab-pane label="流节点" name="ApplyAuditStreamAction">
        <ApplyAuditStreamAction :loading="loading" :data="data" @refresh="actionNodeRefresh" />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import ApplyStreamAbout from './components/ApplyStreamAbout'
import ApplyStreamSolution from './components/ApplyStreamSolution'
import ApplyAuditStream from './components/ApplyAuditStream'
import ApplyAuditStreamAction from './components/ApplyAuditStreamAction'
import {
  queryStreamNode,
  queryStreamSolution,
  queryStreamSolutionRule
} from '@/api/applyAuditStream'
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
      activeName: 'ApplyStreamAbout',
      loading: false,
      data: {
        allSolutionRule: [],
        allSolutionRuleDic: {},
        allSolution: [],
        allSolutionDic: {},
        allActionNode: [],
        allActionNodeDic: {}
      }
    }
  },
  mounted() {
    this.solutionRuleRefresh()
    this.solutionRefresh()
  },
  methods: {
    solutionRuleRefresh() {
      this.loading = true
      queryStreamSolutionRule()
        .then(data => {
          this.data.allSolutionRule = data.list
        })
        .finally(() => {
          this.loading = false
        })
    },
    solutionRefresh() {
      this.loading = true
      this.actionNodeRefresh()
      // 加载解决方案
      queryStreamSolution()
        .then(data => {
          var tableData = data.list
          var length = tableData.nodes ? tableData.nodes.length : 0
          for (var i = length; i < length; i++) {
            tableData.nodes[i].key = Math.random()
          }
          this.data.allSolution = tableData
        })
        .finally(() => {
          this.loading = false
        })
    },
    actionNodeRefresh() {
      this.loading = true
      queryStreamNode()
        .then(data => {
          this.data.allActionNode = data.list
          for (var n in this.data.allActionNode) {
            this.data.allActionNodeDic[
              this.data.allActionNode[n].name
            ] = this.data.allActionNode[n]
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
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
