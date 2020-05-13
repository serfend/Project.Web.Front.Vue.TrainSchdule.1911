<template>
  <div>
    <el-input
      v-model="nowSelectRealName"
      style="width: 100%"
      placeholder="输入姓名查找"
      @input="handleUserSelectByRealnameChange"
    />
    <el-collapse
      v-model="nowCollapseSelectUserId"
      accordion
      @change="loadCollapseUserAvatarRealName"
    >
      <el-collapse-item v-for="u in usersByRealName" :key="u.id" :name="u.id">
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
import User from '@/components/User'
import { getUserIdByRealName } from '@/api/userinfo'
export default {
  name: 'FindUserByRealName',
  components: { User },
  data: () => ({
    nowSelectRealName: '',
    usersByRealName: [],
    nowCollapseSelectUserId: ''
  }),
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
    loadCollapseUserAvatarRealName(id) {
      return this.loadCollapseUserAvatar(this.usersByRealName, id)
    },
    loadCollapseUserAvatar(users, id) {
      for (var i = 0; i < users.length; i++) {
        if (users[i].id === id) {
          users[i].canLoadAvatar = true
          break
        }
      }
    },
    handleUserSelectByRealnameChange(val) {
      if (!val) return (this.usersByRealName = [])
      getUserIdByRealName(val).then(data => {
        this.usersByRealName = data.list.map(li => {
          li.canLoadAvatar = false
          return li
        })
      })
    }
  }
}
</script>

<style>
</style>
