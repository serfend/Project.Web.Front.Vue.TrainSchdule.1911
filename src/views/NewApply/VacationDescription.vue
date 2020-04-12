<template>
  <el-tooltip>
    <div slot="content" class="tooltip-vocation">
      <ul>
        <li>
          <b class="bolder">全年假期长度：</b>
          <span class="text-orange">{{ usersVocation.yearlyLength }}</span>天
        </li>
        <li>
          <b class="bolder">当前已休次数：</b>
          <span class="text-orange">{{ usersVocation.nowTimes }}</span>次
        </li>
        <li>
          <b class="bolder">剩余假期长度：</b>
          <span class="text-orange">{{ usersVocation.leftLength }}</span>天
        </li>
        <li>
          <b class="bolder">全年最多可休路途次数：</b>
          <span class="text-orange">{{ usersVocation.maxTripTimes }}</span>次
        </li>
        <li>
          <b class="bolder">当前已休路途次数:</b>
          <span class="text-orange">{{ usersVocation.onTripTimes }}</span>次
        </li>
        <li>
          <b class="bolder">休假描述:</b>
          <span>{{ usersVocation.description || `暂无说明` }}</span>
        </li>
      </ul>
    </div>
    <el-progress :percentage="caculateVocationPercentage()" />
  </el-tooltip>
</template>

<script>
export default {
  name: 'VacationDescription',
  props: {
    usersVocation: {
      type: Object,
      default() {
        return {}
      }
    },
    thisTimeVacationLength: {
      type: Number,
      default: 0
    }
  },
  methods: {
    caculateVocationPercentage() {
      if (this.usersVocation.yearlyLength === 0) return 100
      var fn = parseInt
      var result = Math.floor(
        100 *
          ((fn(this.usersVocation.yearlyLength) -
            fn(this.usersVocation.leftLength) +
            fn(this.thisTimeVacationLength)) /
            fn(this.usersVocation.yearlyLength))
      )
      if (result < 0) result = 0
      if (result > 100) result = 100
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
.tooltip-vocation {
  width: 260px;
  ul,
  li {
    list-style: none;
    padding: 8px;
    letter-spacing: 1px;

    .text-orange {
      color: orange;
    }
  }
}
</style>
