<template>
  <el-card>
    <ApplySearchCommon
      ref="queryAppliesForm"
      :loading.sync="appliesListIsLoading"
      :list.sync="appliesList"
      :pages.sync="pages"
    />
    <ApplicationList
      ref="applicationlist"
      :list="appliesList"
      :pages.sync="pages"
      :loading="appliesListIsLoading"
    >
      <template slot="action" slot-scope="{row}">
        <action-examine :row="row" />
      </template>
    </ApplicationList>
  </el-card>
</template>

<script>
import ApplySearchCommon from './ApplySearchCommon'
import ApplicationList from './ApplicationList'
import ActionExamine from './ActionExamine'
export default {
  name: 'QueryAndAuditApplies',
  components: { ApplySearchCommon, ApplicationList, ActionExamine },
  data() {
    return {
      appliesList: [],
      appliesListIsLoading: false,
      pages: {}
    }
  },
  methods: {}
}
</script>
