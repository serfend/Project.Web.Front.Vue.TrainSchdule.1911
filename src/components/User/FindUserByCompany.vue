<template>
  <div>
    <CompanySelector v-model="company" placeholder="选择单位" />
    <el-collapse
      v-model="nowCollapseSelectUserId"
      accordion
      @change="loadCollapseUserAvatarCompany"
    >
      <el-collapse-item v-for="u in usersByCompany" :key="u.id" :name="u.id">
        <template slot="title">
          <el-tag>{{ u.dutiesName }}</el-tag>
          {{ u.companyName }} {{ u.realName }}
        </template>
        <User :data="u" :can-load-avatar="u.canLoadAvatar" />
      </el-collapse-item>
      <el-button v-show="hasNextPage" v-loading="loading" style="width:100%" @click="nextPage">下一页</el-button>
    </el-collapse>
  </div>
</template>

<script>
import CompanySelector from '@/components/Company/CompanySelector'
import User from '@/components/User'
import { getMembers } from '@/api/company'

export default {
  name: 'FindUserByCompany',
  components: { CompanySelector, User },
  data() {
    return {
      loading: false,
      company: null,
      usersByCompany: [],
      hasNextPage: false,
      pages: {
        pageIndex: 0,
        pageSize: 20
      },
      nowCollapseSelectUserId: ''
    }
  },
  watch: {
    company: {
      handler(val) {
        if (val) {
          this.pages.pageIndex = -1
          this.usersByCompany = []
          this.$nextTick(() => {
            this.nextPage()
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    nextPage() {
      this.loading = true
      this.pages.pageIndex++
      const item = { code: this.company.code }
      const query = Object.assign(this.pages, item)
      getMembers(query)
        .then(data => {
          const list = data.list.map(li => {
            li.canLoadAvatar = false
            return li
          })
          this.usersByCompany = this.usersByCompany.concat(list)
          this.hasNextPage = data.totalCount > this.usersByCompany.length
        })
        .finally(() => {
          this.loading = false
        })
    },
    mapUser(li) {
      return {
        description: li.companyName + li.dutiesName,
        id: li.id,
        value: li.id,
        realName: li.realName,
        avatar: li.avatar
      }
    },
    loadCollapseUserAvatarCompany(id) {
      return this.loadCollapseUserAvatar(this.usersByCompany, id)
    },
    loadCollapseUserAvatar(users, id) {
      for (var i = 0; i < users.length; i++) {
        if (users[i].id === id) {
          users[i].canLoadAvatar = true
          break
        }
      }
    }
  }
}
</script>

<style>
</style>
