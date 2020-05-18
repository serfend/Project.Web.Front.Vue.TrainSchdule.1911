<template>
  <div v-if="data" class="SummaryContainer">
    <el-image
      v-if="data.avatar"
      :src="data.avatar"
      class="avatar"
      :style="{transform:showout?'':'scale(0)'}"
    />
    <div class="userinfo">
      <div class="username">{{ data.realName }}</div>
      <el-tag class="userduties">{{ data.dutiesName }}</el-tag>
    </div>
    <div class="menu-divider" />
    <VacationSummary :data="data" />
    <div class="menu-divider" />
  </div>
</template>

<script>
import VacationSummary from './VacationSummary'
export default {
  name: 'UserSummary',
  components: { VacationSummary },
  props: {
    data: {
      type: Object,
      default: null
    },
    showout: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/element-variables.scss";

.menu-divider {
  width: 100%;
  height: 1px;
  background-color: #ccc8;
  margin-top: 2px;
}
.SummaryContainer {
  min-height: 300px;
  position: relative;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  -ms-flex-align: center;
  align-items: center;
  .userinfo {
    margin-top: 3em;
    font-weight: 600;
    text-align: center;
    .username {
      color: $--color-primary;
    }
    .userduties {
      color: $--color-primary;
      display: grid;
    }
  }

  .avatar {
    transition: all 0.5s ease;
    position: absolute;
    cursor: pointer;
    top: -3em;
    width: 4.5em;
    height: 4.5em;
    border-radius: 50%;
  }
}
</style>
