<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page.sync="innerPages.pageIndex"
      :page-size.sync="innerPages.pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="innerPages.totalCount"
      v-bind="$attrs"
      @size-change="handleChange"
      @current-change="handleChange"
    />
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'

export default {
  name: 'Pagination',
  props: {
    pagesetting: {
      required: true,
      type: Object,
      default() {
        return this.innerPages
      }
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default() {
        return [5, 10, 20, 30, 50, 100]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: false
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      innerPages: { pageIndex: 0, pageSize: 10, totalCount: 0 }
    }
  },
  watch: {
    pagesetting: {
      handler(val) {
        this.innerPages = val
      },
      deep: true
    }
  },
  methods: {
    handleChange(val) {
      this.pages = val
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
      this.$emit('updated')
    }
  }
}
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}
.pagination-container.hidden {
  display: none;
}
</style>
