<template>
  <el-card>
    <ApplySearchCommon
      ref="queryAppliesForm"
      :loading.sync="appliesListIsLoading"
      :list.sync="appliesList"
      :pages.sync="pages"
      :pages-total-count.sync="pagesTotalCount"
      :fullui.sync="fullSearchUI"
    />
    <ApplicationList
      ref="applicationlist"
      :list="appliesList"
      :pages.sync="pages"
      :pages-total-count="pagesTotalCount"
      :loading="appliesListIsLoading"
      @updated="requestUpdate"
    >
      <template slot="action" slot-scope="{row}">
        <el-link type="info" :href="detailUrl(row.id)">查看详情</el-link>
        <action-examine :row="row" @updated="requestUpdate" />
        <action-user :row="row" @updated="requestUpdate" />
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
      pages: {
        pageSize: 20,
        pageIndex: 0
      },
      pagesTotalCount: 0,
      fullSearchUI: false
    }
  },
  watch: {
    pages: {
      handler(val) {
        localStorage.setItem('queryAndAuditApplies', JSON.stringify({ pages: val }))
      }, deep: true
    }
  },

  mounted() {
    var item = JSON.parse(localStorage.getItem('queryAndAuditApplies'))
    if (item) {
      if (item.pages) {
        this.pages = item.pages
      }
    }
  },
  methods: {
    detailUrl(id) {
      var t = `/#/application/applydetail?id=${id}`
      return t
    },
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
