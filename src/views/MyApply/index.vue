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
              </div>
              <div v-else-if="!haveNext">没有更多了</div>
              <el-button v-else @click="load">加载更多...</el-button>
            </div>
            <div slot="description">
              <ApplyCard v-if="i.create" :data="i" :show="i.show" />
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
      lastPage: -1,
      haveNext: true,
      loading: false
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.user.data
    },
    statusDic() {
      return this.$store.state.vocation.statusDic
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    format(val) {
      return format(val, 'zh_CN')
    },
    load() {
      if (this.loading) return
      if (this.haveNext) {
        this.loading = true
        this.lastPage++
        querySelf({ pageIndex: this.lastPage, pageSize: 20 })
          .then(data => {
            this.list.pop()
            for (var i = 0; i < data.list.length; i++) {
              this.list.push(data.list[i])
            }
            this.list.push({ label: '', id: 999 })
            if (data.list.length < 20) {
              setTimeout(() => {
                this.$message.error('没有更多了')
              }, 2000)
              this.haveNext = false
            }
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
