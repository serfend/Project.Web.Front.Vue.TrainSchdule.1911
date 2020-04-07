<template>
  <el-card>
    <ApplySearchCommon
      ref="queryAppliesForm"
      :loading.sync="appliesListIsLoading"
      :list.sync="appliesList"
      :pages.sync="pages"
      :fullui.sync="fullSearchUI"
    />
    <ApplicationList
      ref="applicationlist"
      :list="appliesList"
      :pages.sync="pages"
      :loading="appliesListIsLoading"
      @updated="requestUpdate"
    >
      <template slot="action" slot-scope="{row}">
        <action-examine style="float:right" :row="row" @updated="requestUpdate" />
        <action-user style="float:right" :row="row" @updated="requestUpdate" />
      </template>
    </ApplicationList>
  </el-card>
</template>

<script>
import ApplySearchCommon from './ApplySearchCommon'
import ApplicationList from './ApplicationList'
import ActionExamine from './ActionExamine'
import ActionUser from './ActionUser'
export default {
  name: 'QueryAndAuditApplies',
  components: { ApplySearchCommon, ApplicationList, ActionExamine, ActionUser },
  data() {
    return {
      appliesList: [],
      appliesListIsLoading: false,
      pages: {},
      fullSearchUI: false
    }
  },
  destroyed() {
    document.body.style.zoom = 1
  },
  mounted() {
    this.$message.success('已为您将页面放大到150%')
    document.body.style.zoom = 1.5
  },
  methods: {
    requestUpdate() {
      this.$refs.queryAppliesForm.searchData()
    }
  }
}
</script>
<style scoped>
.alldivinline {
  float: inline-end !important;
}
</style>
