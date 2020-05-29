<template>
  <el-card v-loading="!usersvacation">
    <el-form>
      <el-form-item label="休假率">
        <VacationDescription
          v-if="usersvacation"
          :users-vacation="usersvacation"
          :this-time-vacation-length="0"
        />
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { getUsersVacationLimit } from '@/api/user/userinfo'
import VacationDescription from '@/components/Vacation/VacationDescription'
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
      usersvacation: null
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
          getUsersVacationLimit(val, new Date().getFullYear()).then(data => {
            this.usersvacation = {
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
