<template>
  <el-form label-width="80px">
    <el-form-item label="忍忍id">
      <el-input v-model="innerUserInfo.gameid" />
    </el-form-item>
    <el-form-item label="昵称">
      <el-input v-model="innerUserInfo.nickName" disabled />
    </el-form-item>
    <el-form-item label="头衔">
      <el-input v-model="innerUserInfo.level" disabled />
    </el-form-item>
    <el-form-item label="上次领取">
      <el-tag>{{ toDate(innerUserInfo.lastHandleStamp) }}</el-tag>
    </el-form-item>
  </el-form>
</template>

<script>
import { userinfo } from '@/api/game'
export default {
  name: 'UserProfile',
  props: {
    userinfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      innerUserInfo: {}
    }
  },
  watch: {
    userinfo: {
      handler(val) {
        this.innerUserInfo = val
      },
      deep: true
    },
    innerUserInfo: {
      handler(val) {
        this.$emit('update:userinfo', val)
      },
      deep: true
    },
    'innerUserInfo.gameid'() {
      this.updateGameR3User()
    }
  },
  mounted() {
    this.userinfo.gameid = localStorage.getItem('lastUser')
    this.updateGameR3User()
  },
  methods: {
    toDate(val) {
      if (val === 0) return '未领取过'
      return new Date(val)
    },
    updateGameR3User() {
      if (this.userinfoLoading) return
      localStorage.setItem('lastUser', this.userinfo.gameid)
      if (this.userinfo.gameid.length === 9) {
        this.userinfoLoading = true
        userinfo(this.userinfo.gameid).then(data => {
          var d = data.user
          if (d.nickName === null) {
            this.$message.error('没有查到这个忍忍哦~')
          }
          this.userinfo.nickName = d.nickName
          this.userinfo.level = d.level
          this.userinfo.lastHandleStamp = d.user.lastHandleStamp
          this.userinfo.enable = d.user.enable
          this.userinfoLoading = false
        })
      }
    }
  }
}
</script>
