<template>
  <div v-loading="!contents" style>
    <el-card style="overflow:hidden">
      <template #header>
        <h2>发言记录</h2>
      </template>
      <div style="width:100%;display:flex;justify-content:center">
        <el-button type="text" @click="showRecordContentEdit">添加发言</el-button>
      </div>
      <div style="margin-bottom:3rem">
        <div v-if="userRecordDict && contents">
          <transition-group name="fade-out">
            <NoData v-if="!contents.length" key="nodata" />
            <SingleItem
              v-for="i in contents"
              :key="i.id"
              :data="i"
              :user-record="userRecordDict[i.recordId]"
              :user-record-dict="userRecordDict"
              @onDelete="onDelete(i)"
            />
          </transition-group>
        </div>
      </div>
      <Pagination :pagesetting.sync="innerPage" :total-count="pagesTotalCount" />
    </el-card>
    <Editor
      :show.sync="showEditContent"
      :data="recordContent"
      :user-records="userRecords"
      :user-record-dict="userRecordDict"
      :confer-type="conference && conference.type"
      @requireRefresh="requireRefresh"
    />
  </div>
</template>

<script>
export default {
  name: 'ConferRecordContent',
  components: {
    NoData: () => import('@/views/Loading/NoData'),
    SingleItem: () => import('./SingleItem'),
    Pagination: () => import('@/components/Pagination'),
    Editor: () => import('./Edit')
  },
  model: {
    prop: 'contents',
    event: 'change'
  },
  props: {
    contents: { type: Array, default: null },
    userRecordDict: { type: Object, default: null },
    userRecords: { type: Array, default: null },
    conference: { type: Object, default: null },
    totalCount: { type: Number, default: 0 },
    pages: { type: Object, default: null }
  },
  data: () => ({
    inner_page: { pageIndex: 0, pageSize: 20 },
    pagesTotalCount: 0,
    showEditContent: false,
    recordContent: {}
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
        this.$emit('update:pages', val)
        this.requireRefresh()
      },
      deep: true
    }
  },
  mounted() {
    this.innerPage = this.inner_page
  },
  methods: {
    onDelete(item) {
      this.$emit('onDelete', item.id)
    },
    requireRefresh() {
      this.$emit('requireRefresh')
    },
    showRecordContentEdit() {
      this.showEditContent = true
      this.recordContent = {
        contentType: 1,
        content: '同意',
        userid: this.$store.state.user.userid
      }
    }
  }
}
</script>
