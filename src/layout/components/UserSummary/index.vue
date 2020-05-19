<template>
  <div v-if="data" class="SummaryContainer">
    <el-image
      :src="avatar"
      :preview-src-list="[avatar]"
      class="avatar"
      :style="{transform:showout?'':'scale(0)'}"
    />
    <div class="userinfo">
      <div class="username">{{ data.realName }}</div>
      <el-tag class="userduties" size="mini">{{ data.dutiesName }}</el-tag>
    </div>
    <div style="height:0.7em" />
    <div class="menu-divider" />
    <VacationSummary style="margin:0.3em" :data="vacation" />
    <div class="menu-divider" />
  </div>
</template>

<script>
import VacationSummary from './VacationSummary'
export default {
  name: 'UserSummary',
  components: { VacationSummary },
  props: {
    showout: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    avatar() {
      return this.$store.state.user.avatar
    },
    data() {
      return this.$store.state.user.data
    },
    vacation() {
      return this.$store.state.user.vacation
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../menu-divider.scss";
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
      color: --color-primary;
    }
    .userduties {
      color: --color-primary;
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
