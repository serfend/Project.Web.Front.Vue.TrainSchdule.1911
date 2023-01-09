<template>
  <el-card v-if="data" class="single-card">
    <el-form label-width="5rem">
      <el-form-item label="驾驶员">
        <UserFormItem :data="data.driver.user" />
      </el-form-item>
      <el-form-item label="驾龄">
        <div v-if="data.driver">
          <div v-if="data.driver.timeDrive">
            <el-tooltip :content="`驾驶时间:${parseTime(data.driver.timeDrive)}`">
              <span>{{ formatTime(data.driver.timeDrive,'{y}-{m}-{d}') }}</span>
            </el-tooltip>
          </div>
          <div v-if="data.driver.timeWorkCurrentCompany">
            <el-tooltip :content="`本单位驾驶时间:${parseTime(data.driver.timeWorkCurrentCompany)}`">
              <span>{{ formatTime(data.driver.timeWorkCurrentCompany,'{y}-{m}-{d}') }}</span>
            </el-tooltip>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="出车时间">
        <el-tooltip :content="parseTime(data.timeStart)">
          <span>{{ formatTime(data.timeStart,'{y}-{m}-{d}') }}</span>
        </el-tooltip>
        <span>-</span>
        <el-tooltip :content="parseTime(data.timeEnd)">
          <span>{{ formatTime(data.timeEnd,'{y}-{m}-{d}') }}</span>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="人数">
        <span>{{ data.passengerCount }}</span>
      </el-form-item>
      <el-form-item label="距离">
        <span>{{ data.distance }}km</span>
      </el-form-item>
      <el-form-item label="路径">
        <div v-if="data.wayPath">
          <el-popover v-if="data.wayPath.length>2">
            <el-steps :active="data.wayPath.length" align-center>
              <el-step v-for="i,index in data.wayPath" :key="index" :title="i.shortName" :description="i.name" />
            </el-steps>
            <el-button slot="reference" type="text">共{{ data.wayPath.length }}个地点</el-button>
          </el-popover>
          <el-tooltip v-else :content="data.wayPath.map(i=>i.name).join('-')">
            <span>{{ data.wayPath.map(i=>i.shortName).join('-') }}</span>
          </el-tooltip>
          <div />
        </div>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { parseTime, formatTime, datedifference } from '@/utils'

export default {
  name: 'TravelItem',
  components: {
    UserFormItem: () => import('@/components/User/UserFormItem')
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    parseTime, formatTime, datedifference
  }
}
</script>
<style lang="scss" scoped>
.single-card {
  width: 30rem;
}
</style>
