<template>
  <el-card>
    <ApplySearchCommon ref="queryAppliesForm" :list.sync="appliesList" :pages.sync="pages" />
    <!-- <ApplicationList ref="applicationlist" :list="dataList" :pages="pages">
      <template slot="action" slot-scope="{row}">
        <action-examine :row="row" />
      </template>
    </ApplicationList>-->
  </el-card>
</template>

<script>
import ApplySearchCommon from './components/ApplySearchCommon'
export default {
  name: 'QueryAndAuditApplies',
  components: { ApplySearchCommon },
  data() {
    return {
      appliesList: [],
      pages: {}
    }
  },
  methods: {}
}
</script>
