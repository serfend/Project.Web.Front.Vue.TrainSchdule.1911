<template>
  <div class="app-container">
    <div v-if="user">
      <el-row>
        <el-col>
          <user-card :user="nowuser" @avatarRefresh="refreshUserAvatar" />
        </el-col>
        <el-col>
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane :label="$t('profile.activity')" name="activity">
                <activity :data="useractions" />
              </el-tab-pane>
              <el-tab-pane :label="$t('profile.timeline')" name="timeline">
                <timeline :data="vocations" />
              </el-tab-pane>
              <el-tab-pane :label="$t('profile.account')" name="account">
                <account :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import UserCard from './components/UserCard'
import Activity from './components/Activity'
import Timeline from './components/Timeline'
import Account from './components/Account'
export default {
  name: 'Profile',
  components: { UserCard, Activity, Timeline, Account },
  data() {
    return {
      activeTab: 'activity',
      user: {}
    }
  },
  computed: {
    nowuser() {
      var baseUser = this.$store.state.user.data
      baseUser.avatar = this.$store.state.user.avatar
      return baseUser
    },
    useractions() {
      return {}
    },
    vocations() {
      var list = this.$store.state.user.vocationList
      var result = []
      var vocationStatus = this.$store.state.vocation.statusDic
      list.forEach(item => {
        var r = item.request
        var status =
          item.recallId === null ? vocationStatus[item.status] : '已召回'
        result.push({
          timestamp: r.stampLeave,
          title:
            '去往' +
            r.vocationPlace.name +
            '的' +
            r.vocationLength +
            '天的' +
            r.vocationType,
          content: '(' + status + ') 创建于' + item.create + ',因' + r.reason
        })
      })
      return result
    }
  },
  methods: {
    refreshUserAvatar() {
      this.$store.dispatch('user/initAvatar')
    }
  }
}
</script>
