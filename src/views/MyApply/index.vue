<template>
  <div>
    <el-row class="row">
      <el-col :xl="7" :lg="8" :md="9" :sm="10" :xs="24">
        <User :data="currentUser" :can-load-avatar="true" />
      </el-col>
      <el-col v-if="currentUser" :xl="17" :lg="16" :md="15" :sm="14" :xs="24">
        <ApplyOverview :userid="currentUser.id" />
      </el-col>
    </el-row>
    <el-row class="row">
      <el-card v-loading="loading">
        <el-steps direction="vertical">
          <el-step v-for="i in list" :key="i.id">
            <div slot="title">
              <div v-if="i.create">
                <span>{{ format(i.create) }}</span>
                <el-tag
                  v-if="statusDic[i.status]"
                  :color="statusDic[i.status].color"
                  class="white--text"
                >{{ statusDic[i.status].desc }}</el-tag>
                <el-switch v-model="i.show" />
                <el-link :href="applyDetailUrl(i.id)">查看详情</el-link>
              </div>
              <div v-else-if="!haveNext">没有更多了</div>
              <el-button v-else @click="load">加载更多...</el-button>
            </div>
            <div slot="description">
              <ApplyCard
                v-if="i.create"
                :data="i"
                :show="i.show"
                @updated="applyUpdate(i.itemIndex)"
              />
            </div>
          </el-step>
        </el-steps>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import { format } from 'timeago.js'
import User from '@/components/User'
import ApplyCard from './components/ApplyCard'
import ApplyOverview from './components/ApplyOverview'
import { querySelf } from '@/api/apply'
export default {
  name: 'MyApply',
  components: { User, ApplyCard, ApplyOverview },
  data() {
    return {
      list: [
        {
          label: '',
          id: 999
        }
      ],
      lastPage: 0,
      haveNext: true,
      loading: false
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.user.data
    },
    statusDic() {
      return this.$store.state.vacation.statusDic
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    applyDetailUrl(id) {
      return `/#/application/applydetail?id=${id}`
    },
    format(val) {
      return format(val, 'zh_CN')
    },
    applyUpdate(index) {
      querySelf({ pageIndex: index, pageSize: 1 }).then(data => {
        if (data.list[0]) {
          this.list[index] = Object.assign(this.list[index], data.list[0])
          this.list[index].show = false
          setTimeout(() => {
            this.list[index].show = true
          }, 1000)
        }
      })
    },
    load() {
      if (this.loading) return
      if (this.haveNext) {
        this.loading = true
        var pages = { pageIndex: this.lastPage, pageSize: 5 }
        querySelf(pages)
          .then(data => {
            this.lastPage++
            this.list.pop() // 删除队尾的提示
            setTimeout(() => {
              for (var i = 0; i < data.list.length; i++) {
                var newItem = Object.assign(
                  {
                    itemIndex: i + pages.pageIndex * pages.pageSize,
                    show: false
                  },
                  data.list[i]
                )
                this.list.push(newItem)
              }
              this.list.push({ label: '', id: 999 })
              if (data.list.length < pages.pageSize) {
                setTimeout(() => {
                  this.$message.error('没有更多了')
                }, 2000)
                this.haveNext = false
              }
              if (pages.pageIndex === 0) {
                setTimeout(() => {
                  this.list[0].show = true
                }, 1000)
              }
            }, 100)
          })
          .finally(() => {
            this.loading = false
          })
      }
    }
  }
}
</script>

<style scoped>
.row {
  margin: 10px;
}
</style>
