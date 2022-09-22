<template>
  <Sticky :sticky-top="50" style="overflow:hidden">
    <el-card v-loading="!records" class="main">
      <div class="title-card">
        <h2>参会人员{{ conference?'':'(当前列举部分)' }}</h2>
      </div>
      <el-divider />
      <div style="width:100%;text-align:center">
        <el-button
          v-if="conference"
          type="text"
          style="display:block;width:100%"
          @click="showEditConference = true"
        >添加成员</el-button>
        <el-alert
          v-show="records && records.length"
          effect="dark"
          type="info"
          center
        >{{ requireOnDouble?'双击':'点击' }}列表的任意一项以选中</el-alert>
      </div>
      <div v-if="records" class="list-container">
        <transition-group name="fade-out">
          <div v-if="!records.length" key="nodata" style="width:100%">
            <NoData />
          </div>
          <SingleItem
            v-for="item in records.filter(i=>i)"
            :ref="`s-${item.id}`"
            :key="item.id"
            :data="item"
            :require-on-double="requireOnDouble"
            class="records-list"
            @onDelete="$emit('onDelete',item.id)"
            @requireRefresh="$emit('requireRefresh')"
            @onSelect="v=>handleSelect(item.id,v)"
          />
        </transition-group>
      </div>

      <Pagination v-if="conference" :pagesetting.sync="innerPage" :total-count="pagesTotalCount" />
    </el-card>

    <Editor
      v-if="conference"
      :show.sync="showEditConference"
      :records="records"
      :conference="conference"
      @requireRefresh="$emit('requireRefresh')"
      @requireDelete="requireDelete"
    />
  </Sticky>
</template>

<script>
export default {
  name: 'ConferRecords',
  components: {
    SingleItem: () => import('./SingleItem'),
    Pagination: () => import('@/components/Pagination'),
    NoData: () => import('@/views/Loading/NoData'),
    Sticky: () => import('@/components/Sticky'),
    Editor: () => import('./Edit')
  },
  model: {
    prop: 'records',
    event: 'change'
  },
  props: {
    records: { type: Array, default: null },
    conference: { type: Object, default: null },
    totalCount: { type: Number, default: 0 },
    pages: { type: Object, default: null },
    focusUsers: { type: Array, default: null },
    requireOnDouble: { type: Boolean, default: true }
  },
  data: () => ({
    inner_page: { pageIndex: 0, pageSize: 20 },
    pagesTotalCount: 0,
    focusUsersDict: {},
    showEditConference: false
  }),
  computed: {
    innerPage: {
      get() {
        return this.inner_page
      },
      set(val) {
        this.inner_page = val
        this.$emit('update:pages', val)
      }
    }
  },
  watch: {
    totalCount: {
      handler(val) {
        this.pagesTotalCount = val
      },
      immediate: true
    },
    pages: {
      handler(val) {
        this.inner_page = val
      }
    },
    inner_page: {
      handler(val) {
        this.refresh()
      },
      deep: true
    }
  },
  mounted() {
    this.innerPage = this.inner_page
  },
  methods: {
    refresh() {
      this.$emit('requireRefresh', this.innerPage)
    },
    handleSelect(id, enable) {
      const dict = this.focusUsersDict
      dict[id] = enable
      const list = Object.keys(this.focusUsersDict)
      this.$emit('update:focusUsers', list.filter(i => dict[i]))
    },
    requireDelete(id) {
      const item = this.$refs[`s-${id}`]
      item && item[0].requireDelete()
    }
  }
}
</script>
<style lang="scss" scoped>
.list-container {
  max-height: 30rem;
  margin-bottom: 3rem;
  overflow: scroll;
  width: 100%;
}
.title-card {
  display: flex;
  justify-content: center;
}
.records-list {
  &:nth-child(1) {
    border-top: 1px solid #ccc;
  }
}
.main {
  overflow: hidden;
}
</style>
