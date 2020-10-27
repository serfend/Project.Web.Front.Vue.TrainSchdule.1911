<template>
  <div>
    <div v-if="id||(currentUser&&currentUser.id)">
      <div v-if="!$slots.inner">
        <el-row class="row">
          <UserSelector :code.sync="id" :default-info="'查询其他人休假情况'" style="display:inline" />
        </el-row>
        <el-row :gutter="20" class="row">
          <el-col>
            <el-col :xl="7" :lg="8" :md="9" :sm="10" :xs="24">
              <UserFormItem
                :data="id?null:currentUser"
                :userid="id"
                :direct-show-card="true"
                :can-load-avatar="true"
              />
            </el-col>
            <el-col :xl="17" :lg="16" :md="15" :sm="14" :xs="24">
              <ApplyOverview :userid="id||currentUser.id" />
            </el-col>
          </el-col>
        </el-row>
      </div>
      <div v-else>
        <ApplyOverview :userid="id||currentUser.id" class="row" />
        <el-row class="row">
          <el-col>
            <el-col :xl="7" :lg="8" :md="9" :sm="10" :xs="24">
              <UserFormItem
                :data="id?null:currentUser"
                :userid="id"
                :direct-show-card="true"
                :can-load-avatar="true"
              />
            </el-col>
            <slot name="inner" />
          </el-col>
        </el-row>
      </div>
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
          <el-button
            :disabled="!haveNext"
            type="text"
            style="width:100%"
            @click="load"
          >{{ haveNext?'点击加载更多记录':'到底啦~' }}</el-button>
        </el-card>
      </el-row>
    </div>
    <Login v-else />
  </div>
</template>

<script>
import { formatTime } from '@/utils'
import UserFormItem from '@/components/User/UserFormItem'
import UserSelector from '@/components/User/UserSelector'
import ApplyCard from './components/ApplyCard'
import ApplyOverview from './components/ApplyOverview'
import { querySelf } from '@/api/apply/query'
import Login from '@/views/login'
export default {
  name: 'MyApply',
  components: { UserFormItem, UserSelector, ApplyCard, ApplyOverview, Login },
  props: {
    start: {
      type: String,
      default: `${new Date().getFullYear()}-01-01`,
    },
    id: {
      type: String,
      default: null,
    },
    autoExpand: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      innerList: [],
      lastPage: 0,
      haveNext: true,
      loading: false,
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
      },
    },
  },
  watch: {
    list: {
      handler(val) {
        this.innerList = val
      },
      deep: true,
    },
    id: {
      handler(val) {
        this.reload()
      },
    },
  },
  mounted() {
    this.load()
  },
  methods: {
    reload() {
      this.clear_data()
      this.load()
    },
    clear_data() {
      this.innerList = []
      this.lastPage = 0
      this.haveNext = true
    },
    applyDetailUrl(id) {
      return `/#/vacation/applydetail?id=${id}`
    },
    format(val) {
      return formatTime(val)
    },
    applyUpdate(index) {
      querySelf({ pageIndex: index, pageSize: 1 }).then((data) => {
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
        const pages = { pageIndex: this.lastPage, pageSize: 5 }
        querySelf(pages, this.id, this.start)
          .then((data) => {
            this.lastPage++
            const newList = data.list.map((v, i) => {
              v.itemIndex = i + pages.pageIndex * pages.pageSize
              v.show = false
              return v
            })
            setTimeout(() => {
              this.iList = this.iList.concat(newList)
              if (data.list.length < pages.pageSize) {
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
    },
  },
}
</script>

<style scoped>
.row {
  margin: 10px;
}
</style>
