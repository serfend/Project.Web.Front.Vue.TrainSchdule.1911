<template>
  <div>
    <el-pagination
      :current-page="pagesetting.pageIndex"
      :page-sizes="[1, 5, 20, 50, 100, 200]"
      :page-size="pagesetting.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagesetting.totalCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    pagesetting: {
      type: Object,
      default() {
        return {
          pageSize: 20,
          pageIndex: 1,
          totalCount: 100
        }
      }
    }
  },
  data() {
    return {
      pageInnerSetting: {
        pageSize: 20,
        pageIndex: 1
      }
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.pageInnerSetting.pageIndex = val
      this.$emit('updatepage', this.pageInnerSetting)
    },
    handleSizeChange(val) {
      this.pageInnerSetting.pageSize = val
      this.$emit('updatepage', this.pageInnerSetting)
    }
  }
}
</script>

