<template>
  <el-card class="content-card">
    <el-form label-width="5rem">
      <el-form-item label="审批类型">
        <el-select v-model="data.entityType">
          <el-option label="休假" value="vacation" />
          <el-option label="请假" value="inday" />
        </el-select>
      </el-form-item>
      <el-form-item label="查询单位">
        <CompanySelector
          v-model="data.companyRegion"
          default-select-first
          placeholder="选择管理的主单位（单位作用域是界定当前规则有效范围的配置）"
          style="width:30rem"
          @change="requireRefresh"
        />
      </el-form-item>
      <el-form-item label="转移到">
        <CompanySelector
          v-model="data.newCompanyRegion"
          placeholder="选择变动到新的单位作用域"
          style="width:30rem"
          @change="requireRefresh"
        />
      </el-form-item>
    </el-form>
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
import CompanySelector from '@/components/Company/CompanySelector'
import ApplyStreamAbout from './components/ApplyStreamAbout'
import ApplyStreamSolution from './components/ApplyStreamSolution'
import ApplyAuditStream from './components/ApplyAuditStream'
import ApplyAuditStreamAction from './components/ApplyAuditStreamAction'
import {
  queryStreamNode,
  queryStreamSolution,
  queryStreamSolutionRule
} from '@/api/audit/applyAuditStream'
import { debounce } from '@/utils'
export default {
  name: 'ApplyStream',
  components: {
    CompanySelector,
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
        entityType: 'vacation',
        companyRegion: null,
        newCompanyRegion: null,
        allSolutionRule: [],
        allSolutionRuleDic: {},
        allSolution: [],
        allSolutionDic: {},
        allActionNode: [],
        allActionNodeDic: {}
      }
    }
  },
  computed: {
    requireRefresh() {
      return debounce(() => {
        this.refresh()
      }, 500)
    }
  },
  watch: {
    'data.companyRegion': {
      handler(val) {
        this.data.newCompanyRegion = val
      }
    },
    'data.entityType': {
      handler(val) {
        this.solutionRuleRefresh()
      }
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    refresh() {
      this.solutionRuleRefresh()
      this.solutionRefresh()
    },
    solutionRuleRefresh() {
      this.loading = true
      const region = this.data.companyRegion || {}
      queryStreamSolutionRule(region.code, this.data.entityType)
        .then(data => {
          this.data.allSolutionRule = data.list
        })
        .finally(() => {
          this.loading = false
        })
    },
    async solutionRefresh() {
      this.loading = true
      const node = this.actionNodeRefresh
      // 加载解决方案
      const solution = () => {
        const region = this.data.companyRegion || {}
        return queryStreamSolution(region.code).then(data => {
          var tableData = data.list
          var length = tableData.nodes ? tableData.nodes.length : 0
          for (var i = length; i < length; i++) {
            tableData.nodes[i].key = Math.random()
          }
          this.data.allSolution = tableData
        })
      }

      return node()
        .then(() => solution())
        .finally(() => {
          this.loading = false
        })
    },
    async actionNodeRefresh() {
      this.loading = true
      const region = this.data.companyRegion || {}
      return await queryStreamNode(region.code)
        .then(data => {
          this.data.allActionNode = data.list
          for (var n in this.data.allActionNode) {
            const node = this.data.allActionNode[n]
            this.data.allActionNodeDic[node.name] = node
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
