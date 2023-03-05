<template>
  <div class="modal">
    <div class="alert-box">
      <AleretStripe style="position:absolute;top:0" />
      <div class="alert-header">{{ title }}</div>
      <el-row class="alert-body">
        <el-col :span="6">
          <div style="width:6rem">
            <LottieIcon
              path="/assets/lottie/lottie.warning.json"
              :animate-speed="0.5"
              style="width:6rem;margin: auto;"
            />
          </div>
        </el-col>
        <el-col :span="18">
          <div v-for="(des, index) in descriptions" :key="index">{{ des }}</div>
        </el-col>
      </el-row>
      <el-row class="btn-group">
        <CyberBtn
          v-for="btn in buttons"
          :key="btn.name"
          v-bind="btn.attrs"
          @click="onUserClick(btn)"
        >{{ btn.name }}</CyberBtn>
      </el-row>
      <AleretStripe style="position:absolute;bottom:0" :direction="true" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'FullScreenWarning',
  components: {
    AleretStripe: () => import('./AlertStripe'),
    CyberBtn: () => import('./CyberBtn'),
    LottieIcon: () => import('@/components/LottieIcon')
  },
  props: {
    title: { type: String, default: 'Warning 安全告警' },
    description: { type: String, default: 'XXX事件产生告警\n告警详细信息' },
    buttons: {
      type: Array,
      default: () => [
        {
          name: '关闭',
          event: 'onClose',
          attrs: { color: 'info', background: '#888888' }
        },
        {
          name: '查看详情',
          event: 'onDetail',
          attrs: { color: 'primary' }
        },
        {
          name: '忽略',
          event: 'onIgnore',
          attrs: { color: 'danger' }
        }
      ]
    }
  },
  computed: {
    descriptions() {
      const { description } = this
      if (!description) return null
      return description.split('\n')
    }
  },
  mounted() {},
  methods: {
    onUserClick(btn) {
      const isFunc =
        Object.prototype.toString.call(btn.event) === '[object Function]'
      if (isFunc) return btn.event()
      return this.$emit(btn.event)
    }
  }
}
</script>
<style lang="scss" scoped>
$--background: #000d38e8;
.modal {
  position: fixed;
  z-index: 9999;
  background: $--background;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  animation: modal-start linear 0.5s;
}
@keyframes modal-start {
  0% {
    background: #001c7900;
  }
  100% {
    background: $--background;
  }
}
.btn-group {
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin: 0 1rem;
}
@font-face {
  font-family: cyberFont;
  src: url(~@/assets/dashboard/fonts/DS-Cyber-CN.ttf);
}
.alert-header {
  font-size: 2.5rem;
  margin: 2rem 0 0.5rem 0;
}
.alert-body {
  width: 100%;
  height: 9rem;
  padding: 1rem;
}
.alert-box {
  overflow: hidden;
  position: fixed;
  font-family: cyberFont;
  color: #edeef7;
  text-shadow: 0 0 0.3rem #ffffff;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30rem;
  height: 20rem;
  padding: 0.5rem;
  background-color: #ffffff20;
  box-shadow: 0 0 0.5rem #000000;
  transition: all ease 0.5s;
  animation: dialog-show-start 0.2s ease none 3,
    dialog-show-end 0.5s cubic-bezier(0.075, 0.82, 0.165, 1) 0.6s,
    dialog-show-highlight 1s cubic-bezier(0.64, 0.01, 0, 1.1) 1s 5;
}

@keyframes dialog-show-start {
  0% {
    background-color: #ffffff;
    box-shadow: 0 0 0.5rem #ffffff;
    color: #00000000;
    width: 0.5rem;
    height: 10rem;
    opacity: 0;
  }
  100% {
    background-color: #ffffff;
    box-shadow: 0 0 0.5rem #ffffff;
    color: #00000000;
    width: 0.5rem;
    height: 10rem;
    opacity: 1;
  }
}

@keyframes dialog-show-end {
  0% {
    width: 0.5rem;
    height: 10rem;
    opacity: 0;
  }
  40% {
    width: 30rem;
    height: 10rem;
    opacity: 1;
  }
  70% {
    width: 30rem;
    height: 10rem;
    opacity: 1;
  }
  100% {
    width: 30rem;
    height: 15rem;
    opacity: 1;
  }
}

@keyframes dialog-show-highlight {
  0% {
    background-color: #ffffff3f;
    box-shadow: 0 0 0.5rem #000000;
  }
  50% {
    background-color: #ffffff9f;
    box-shadow: 0 0 0.5rem #ffffff;
  }
  100% {
    background-color: #ffffff3f;
    box-shadow: 0 0 0.5rem #000000;
  }
}
</style>
