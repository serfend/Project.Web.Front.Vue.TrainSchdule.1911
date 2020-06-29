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
          <el-step v-for="i in iList" :key="i.id">
            <div slot="title">
              <span>{{ format(i.create) }}</span>
              <el-tag
                v-if="statusDic[i.status]"
                :color="statusDic[i.status].color"
                class="white--text"
              >{{ statusDic[i.status].desc }}</el-tag>
              <el-switch v-model="i.show" />
              <el-link :href="applyDetailUrl(i.id)" target="_blank">查看详情</el-link>
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
        <div v-if="!haveNext">没有更多了</div>
        <el-button v-else @click="load">加载更多...</el-button>
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
  props: {
    start: {
      type: String,
      default: `${new Date().getFullYear()}-01-01`
    },
    id: {
      type: String,
      default: null
    },
    autoExpand: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      innerList: [],
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
    },
    iList: {
      set(val) {
        this.innerList = val
        this.$emit('update:list', this.innerList)
      },
      get() {
        return this.innerList
      }
    }
  },
  watch: {
    list: {
      handler(val) {
        this.innerList = val
      },
      deep: true
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
          this.iList[index] = Object.assign(this.list[index], data.list[0])
          this.iList[index].show = false
          setTimeout(() => {
            this.iList[index].show = true
          }, 1000)
        }
      })
    },
    load() {
      if (this.loading) return
      if (this.haveNext) {
        this.loading = true
        var pages = { pageIndex: this.lastPage, pageSize: 5 }
        querySelf(pages, this.id, this.start)
          .then(data => {
            this.lastPage++
            const newList = data.list.map((v, i) => {
              v.itemIndex = i + pages.pageIndex * pages.pageSize
              v.show = false
              return v
            })
            setTimeout(() => {
              this.iList = this.iList.concat(newList)
              if (data.list.length < pages.pageSize) {
                this.$message.error('没有更多了')
                this.haveNext = false
              }
              if (pages.pageIndex === 0 && this.autoExpand) {
                setTimeout(() => {
                  this.iList[0].show = true
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
