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
      company: null,
      usersByCompany: [],
      nowCollapseSelectUserId: ''
    }
  },
  watch: {
    company: {
      handler(val) {
        if (val) {
          getMembers({ code: val.code, page: 0, pageSize: 999 }).then(data => {
            this.usersByCompany = data.list.map(li => {
              li.canLoadAvatar = false
              return li
            })
          })
        }
      },
      immediate: true
    }
  },
  methods: {
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
