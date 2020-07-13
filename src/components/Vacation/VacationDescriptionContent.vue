<template>
  <ul v-if="usersVacation" class="tooltip-vacation">
    <li>
      <b>全年假期天数：</b>
      <span>{{ usersVacation.yearlyLength }}</span>天
    </li>
    <li>
      <b>当前已休次数：</b>
      <span>{{ usersVacation.nowTimes }}</span>次
    </li>
    <li>
      <b>剩余假期天数：</b>
      <span>{{ usersVacation.leftLength }}</span>天
    </li>
    <li>
      <b>全年可休路途：</b>
      <span>{{ usersVacation.maxTripTimes }}</span>次
    </li>
    <li>
      <b>当前已休路途：</b>
      <span>{{ usersVacation.onTripTimes }}</span>次
    </li>
    <li>
      <b>备注：</b>
      <span>{{ usersVacation.description || '暂无' }}</span>
    </li>
    <li>
      <b>其他假期：</b>
      <el-tooltip
        v-if="usersVacation.additionals&&usersVacation.additionals.length>0"
        effect="light"
        placement="right"
      >
        <div slot="content">
          <div
            v-for="(v,i) in usersVacation.additionals"
            :key="i"
            :style="{color:v.description=='法定节假日'?'#13ce66':'#ff4949'}"
          >{{ parseTime(v.start) }}:{{ v.name }} {{ v.length }}天</div>
        </div>
        <span>{{ usersVacation.additionals.reduce((prev,cur)=>prev+cur.length,0) }}天</span>
      </el-tooltip>
      <span v-else>无</span>
    </li>
  </ul>
</template>

<script>
import { parseTime } from '@/utils'
export default {
  props: {
    usersVacation: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    parseTime(val) {
      return parseTime(val, '{y}年{m}月{d}日')
    }
  }
}
</script>
<style lang="scss" scoped>
.tooltip-vacation {
  width: 260px;
  ul,
  li {
    list-style: none;
    padding: 8px;
    letter-spacing: 1px;
    span {
      color: #00f;
    }
  }
}
</style>
