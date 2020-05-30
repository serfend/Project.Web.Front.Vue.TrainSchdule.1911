<template>
  <ul v-if="usersVacation" class="tooltip-vacation">
    <li>
      <b>全年假期长度：</b>
      <span>{{ usersVacation.yearlyLength }}</span>天
    </li>
    <li>
      <b>当前已休次数：</b>
      <span>{{ usersVacation.nowTimes }}</span>次
    </li>
    <li>
      <b>剩余假期长度：</b>
      <span>{{ usersVacation.leftLength }}</span>天
    </li>
    <li>
      <b>全年最多可休路途次数：</b>
      <span>{{ usersVacation.maxTripTimes }}</span>次
    </li>
    <li>
      <b>当前已休路途次数:</b>
      <span>{{ usersVacation.onTripTimes }}</span>次
    </li>
    <li>
      <b>休假描述:</b>
      <span>{{ usersVacation.description || `暂无说明` }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    usersVacation: {
      type: Object,
      default() {
        return {}
      }
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
