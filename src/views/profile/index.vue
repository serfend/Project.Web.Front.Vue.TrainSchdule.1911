<template>
  <div v-if="user" class="app-container">
    <el-card>
      <el-tabs v-model="activeTab">
        <el-tab-pane :label="$t('profiles.activity')" name="activity">
          <Activity :data="useractions" />
        </el-tab-pane>
        <el-tab-pane :label="$t('profiles.timeline')" name="timeline">
          <Timeline />
        </el-tab-pane>
        <el-tab-pane :label="$t('profiles.account')" name="account">
          <Account :user="user" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import Activity from './components/Activity'
import Timeline from './components/Timeline'
import Account from './components/Account'
export default {
  name: 'Profile',
  components: { Activity, Timeline, Account },
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
