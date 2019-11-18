<template>
  <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="20">
      <el-col :lg="32" :md="32">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :lg="{ span: 8 }" :md="{ span: 24 }" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <el-col :lg="{ span: 8 }" :md="{ span: 24 }" style="margin-bottom:30px;">
        <box-card />
      </el-col>
      <el-col :lg="8" :sm="24" :xs="24">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    PieChart,
    BarChart,
    TodoList,
    BoxCard
  },
  data() {
    return {
      lineChartData: {
        onApplyingData: [0, 1],
        beenAuditData: [0, 1],
        beenDeniedData: [0, 1],
        titles: ['暂无数据']
      }
    }
  },
  methods: {
    handleSetLineChartData(
      onApplyingData,
      beenAuditData,
      beenDeniedData,
      titles
    ) {
      this.lineChartData = {
        onApplying: onApplyingData,
        beenAudit: beenAuditData,
        beenDenied: beenDeniedData
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
