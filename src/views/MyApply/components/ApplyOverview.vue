<template>
  <el-card v-loading="!usersVocation">
    <el-form>
      <el-form-item label="休假率">
        <VacationDescription
          v-if="usersVocation"
          :users-vocation="usersVocation"
          :this-time-vacation-length="0"
        />
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { getUsersVocationLimit } from '@/api/userinfo'
import VacationDescription from '@/views/NewApply/VacationDescription'
export default {
  name: 'ApplyOverview',
  components: { VacationDescription },
  props: {
    userid: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      usersVocation: null
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.user.data
    }
  },
  watch: {
    userid: {
      handler(val) {
        if (val) {
          getUsersVocationLimit(val, new Date().getFullYear()).then(data => {
            this.usersVocation = {
              yearlyLength: 0,
              nowTimes: 0,
              leftLength: 0,
              onTripTimes: 0,
              maxTripTimes: 0,
              ...data
            }
          })
        }
      },
      immediate: true
    }
  }
}
</script>

<style>
</style>
