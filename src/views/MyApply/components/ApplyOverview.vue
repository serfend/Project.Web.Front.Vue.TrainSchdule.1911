<template>
  <el-card v-loading="loading">
    <el-form>
      <el-form-item label="休假率">
        <VacationDescription
          v-if="usersvacation"
          :users-vacation="usersvacation"
          :this-time-vacation-length="0"
        />
        <span v-else>{{ loading_result }}</span>
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
      default: null,
    },
  },
  data() {
    return {
      usersvacation: null,
      loading: false,
      loading_result: null,
    }
  },
  watch: {
    userid: {
      handler(val) {
        if (val) {
          this.loading = true
          this.loading_result = '加载中...'
          getUsersVacationLimit(val)
            .then((data) => {
              this.usersvacation = {
                yearlyLength: 0,
                nowTimes: 0,
                leftLength: 0,
                onTripTimes: 0,
                maxTripTimes: 0,
                ...data,
              }
            })
            .catch((e) => {
              this.loading_result = JSON.stringify(e)
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          this.loading_result = '未登录'
        }
      },
      immediate: true,
    },
  },
}
</script>

<style>
</style>
