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
              <el-tab-pane :label="$t('profile.timeline')" name="timeline">施工中</el-tab-pane>
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
// import Timeline from './components/Timeline'
import Account from './components/Account'
export default {
  name: 'Profile',
  components: { UserCard, Activity, Account },
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
    }
  },
  methods: {
    refreshUserAvatar() {
      this.$store.dispatch('user/initAvatar')
    }
  }
}
</script>
