<template>
  <div>
    <el-input
      v-model="nowSelectRealName"
      style="width: 100%"
      placeholder="输入姓名查找"
      @input="handleUserSelectByRealnameChange"
    />
    <el-collapse v-model="nowCollapseSelectUserId" accordion @change="selectUserChange">
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
import { getUserIdByRealName } from '@/api/user/userinfo'
export default {
  name: 'FindUserByRealName',
  components: { User },
  data: () => ({
    nowSelectRealName: '',
    usersByRealName: [],
    userDict: {},
    nowCollapseSelectUserId: ''
  }),
  watch: {
    usersByRealName: {
      handler(val) {
        if (val) {
          this.userDict = {}
          var vLen = val.length
          for (var i = 0; i < vLen; i++) {
            this.userDict[val[i].id] = val[i]
          }
        }
      }
    },
    immediate: true
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
    selectUserChange(id) {
      if (id) {
        this.loadCollapseUserAvatarRealName(id)
      }
    },
    loadCollapseUserAvatarRealName(id) {
      var u = this.userDict[id]
      this.$emit('change', u)
      u.canLoadAvatar = true
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
