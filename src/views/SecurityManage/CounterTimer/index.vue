<template>
  <el-card class="counter-timer-primary">
    <span class="center primary-title">
      <span>历史上的</span>
      <span class="center-date">{{
        parseTime(new Date(), "{y}年{m}月{d}日 {h}:{i}:{s}")
      }}</span>
      <span>今天</span>
    </span>
    <span class="center primary-title">
      <span>百日攻坚</span>
      <span class="center-date">{{ sci_str(config.countDown.time[0]) }}</span>
      <span>天</span>
      <span class="center-date">{{ sci_str(config.countDown.time[1]) }}</span>
      <span :style="{ opacity: spliter_opacity }">:</span>
      <span class="center-date">{{ sci_str(config.countDown.time[2]) }}</span>
      <span
        v-show="config.showSecond"
        :style="{ opacity: spliter_opacity }"
      >:</span>
      <span v-show="config.showSecond">{{
        sci_str(config.countDown.time[3])
      }}</span>
      <span>倒计时</span>
    </span>
  </el-card>
</template>
<script>
const week = [
  '星期日',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六'
]
import { datedifference, parseTime, sci_str } from '@/utils'
export default {
  name: 'CounterTimer',
  data: () => ({
    time: [],
    date: '',
    config: {
      running: true,
      showSecond: false,
      useClock: false, // 是否使用当前计算机时间
      spliter_breath: false, // 呼吸灯显示
      show_btn: true,
      show_btn_timer: null,
      countDown: {
        enable: true,
        target: new Date('2023-1-1'),
        value: null,
        time: []
      }
    },
    lastDate: 0
  }),
  computed: {
    spliter_opacity() {
      const { config } = this
      const r = !config.running || config.spliter_breath
      return r ? 1 : 0
    }
  },
  mounted() {
    this.time_reset()
    setInterval(() => {
      this.update_time()
    }, 5e2)
  },
  methods: {
    parseTime,
    sci_str,
    showBtn() {
      this.config.show_btn = true
      if (this.config.show_btn_timer) {
        clearTimeout(this.config.show_btn_timer)
      }
      this.config.show_btn_timer = setTimeout(() => {
        this.config.show_btn = false
      }, 5e3)
    },
    update_time() {
      if (!this.config.running) return
      this.time = this.getTime()
      const { countDown } = this.config
      const { enable, target } = countDown
      if (enable) {
        const r = datedifference(target, new Date(), 'dayWithObject')
        countDown.value = `${r.day}天${r.hour}时${r.minute}分`
        countDown.time = [r.day, r.hour, r.minute, r.second]
      }
      if (this.config.useClock) this.date = this.time[3]
    },
    time_reset() {
      this.lastDate = -1
      this.update_time()
    },
    getTime() {
      this.config.spliter_breath = !this.config.spliter_breath
      const n = new Date()
      let r
      const u = this.config.useClock
      if (u) r = [n.getHours(), n.getMinutes(), n.getSeconds()]
      else {
        this.lastDate += 0.5
        r = [
          Math.floor(this.lastDate / 3600),
          Math.floor((this.lastDate % 3600) / 60),
          Math.floor(this.lastDate % 60)
        ]
      }
      r = r.map(i => i.toString().padStart(2, '0'))
      if (u) {
        r.push(
          `${n.getFullYear()}年${n.getMonth() + 1}月${n.getDate()}日${
            week[n.getDay()]
          }`
        )
      }
      return r
    }
  }
}
</script>
<style lang="scss" scoped>
.center {
  text-align: center;
}
.center-date {
  color: #f00;
}
.primary-title {
  font-size: 4rem;
  display: block;
  font-weight: 800;
}
@import "../style";
@import "@/views/dashboard/Statistics/style";
.counter-timer-primary {
  @include common();
  text-shadow: 1px 0px 100px #ffffffc2;
  color:#25ffed;
  background: url(~@/assets/dashboard/images/head_bg.png) no-repeat;
  background-size: 100% 13.5rem;
}
</style>
