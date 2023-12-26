<template>
  <div style="text-align:center;">
    <transition-group name="list" tag="div">
      <div
        v-for="(x, index) in list"
        :key="x.id"
        v-loading="x.loading"
        class="slide-container list-item"
      >
        <SingleStatistics :callback-export-to-xls.sync="x.exportToXls" :loading.sync="x.loading" />
        <div class="slide-remove">
          <el-button
            type="text"
            icon="el-icon-download"
            @click="x.exportToXls(index)"
          >导出</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="cardRemove(index)"
          >删除</el-button>
        </div>
      </div>
    </transition-group>
    <el-button
      type="text"
      icon="el-icon-edit"
      style="width:100%"
      @click="cardAdd"
    >添加新的统计</el-button>
  </div>
</template>
<script>
export default {
  name: 'StatisticsVacation',
  components: {
    SingleStatistics: () => import('./SingleStatistics')
  },
  data: () => ({
    list: []
  }),
  mounted() {
    this.cardAdd()
  },
  methods: {
    cardAdd() {
      const card = new Date().getTime()
      this.list.push({
        id: card,
        showBar: true,
        loading: false,
        exportToXls: () => {}
      })
    },
    cardRemove(index) {
      this.list.splice(index, index + 1)
    },
  }
}
</script>
<style lang="scss">
.slide-container {
  position: relative;
}
.slide-remove {
  position: absolute;
  top: 0;
  right: 0;
}

.list-item {
  display: inline-block;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(-5rem);
}
</style>
