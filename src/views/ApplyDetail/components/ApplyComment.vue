<template>
  <div v-if="id" v-loading="loading_whole">
    <ApplyCommentSender :id="id" @newContent="newContent" />
    <el-divider />
    <SingleComment v-for="(i,index) in list" :key="index" :data="i" />
    <div class="footer">
      <el-button
        v-loading="loading_next"
        :disabled="!hasNextPage"
        type="text"
        @click="load_page(false)"
      >{{ hasNextPage?'查看更多':'没有更多啦~' }}</el-button>
    </div>
    <ApplyCommentSender v-if="list.length>10" :id="id" @newContent="newContent" />
  </div>
</template>

<script>
import ApplyCommentSender from './ApplyCommentSender'
import SingleComment from './SingleComment'
import { getComments } from '@/api/apply/attach_info'
export default {
  name: 'ApplyComment',
  components: { SingleComment, ApplyCommentSender },
  props: {
    id: {
      type: String,
      default: null,
    },
    totalCount: {
      type: [Number, String],
      default: null,
    },
    order: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    loading_whole: false,
    loading_next: false,
    list: [],
    current_page: 0,
    current_page_size: 5,
  }),
  computed: {
    hasNextPage() {
      return this.totalCount > this.current_page * this.current_page_size
    },
  },
  mounted() {
    this.load_page()
  },
  methods: {
    newContent(content) {
      console.log('new content', content)
      const item = {
        content,
        create: new Date(),
        like: 0,
        myLike: false,
        from: this.$store.state.user.data,
      }
      this.list.unshift(item)
      this.current_page = 0
    },
    async reload_page() {
      this.loading_whole = true
      this.current_page = 0
      await this.load_page(true)
      this.loading_whole = false
    },
    async load_page(need_clear) {
      if (!this.id) return
      this.loading_next = true
      getComments({
        id: this.id,
        pageIndex: this.current_page,
        pageSize: this.current_page_size,
        order: this.order,
      })
        .then((data) => {
          if (need_clear) this.list = []
          this.list = this.list.concat(data.list)
          this.$emit('update:totalCount', data.totalCount)
        })
        .finally(() => {
          this.loading_next = false
          this.current_page++
        })
    },
  },
}
</script>
<style lang="scss" scoped>
.footer {
  display: flex;
  justify-content: center;
}
</style>
