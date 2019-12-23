<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('monthSolider')">
        <div class="card-panel-icon-wrapper icon-monthSolider">
          <svg-icon icon-class="user" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">本月战士休假情况</div>
          <count-to :start-val="0" :end-val="0" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('monthOfficer')">
        <div class="card-panel-icon-wrapper icon-monthOfficer">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">本月干部休假情况</div>
          <count-to :start-val="0" :end-val="0" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('annualSolider')">
        <div class="card-panel-icon-wrapper icon-annualSolider">
          <svg-icon icon-class="user" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">年度战士休假情况</div>
          <count-to :start-val="0" :end-val="0" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('annualOfficer')">
        <div class="card-panel-icon-wrapper icon-annualOfficer">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">年度干部休假情况</div>
          <count-to :start-val="0" :end-val="0" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col {
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-monthSolider {
        background: #40c9c6;
      }
      .icon-monthOfficer {
        background: #36a3f7;
      }
      .icon-annualSolider {
        background: #f4516c;
      }
      .icon-annualOfficer {
        background: #34bfa3;
      }
    }
    .icon-monthSolider {
      color: #40c9c6;
    }
    .icon-monthOfficer {
      color: #36a3f7;
    }
    .icon-annualSolider {
      color: #f4516c;
    }
    .icon-annualOfficer {
      color: #34bfa3;
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      font-weight: bold;
      padding-top: 1em;
      .card-panel-text {
        color: rgba(0, 0, 0, 0.45);
      }
    }
  }
}
</style>
