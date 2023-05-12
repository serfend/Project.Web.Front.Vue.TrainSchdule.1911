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
function getTimeDesc(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  const left_desc = `${h}h${m}m${s}s`
  return left_desc
}

const getDateDelta = (s, e) => {
  const yearDelta = e.getFullYear() - s.getFullYear()
  const monthDelta = e.getMonth() - s.getMonth()
  const dayDelta = e.getDate() - s.getDate()
  return [yearDelta, monthDelta, dayDelta]
}
const getTimeDelta = (s, e, interval) => {
  const dateSpan = e - s
  return Math.floor(dateSpan / interval)
}
const DateIntervalOption = {
  year: (s, e) => {
    const delta = getDateDelta(s, e)
    if (delta[0] <= 0) return delta[0]
    if (delta[1] < 0 || (delta[1] === 0 && delta[2] < 0)) return delta[0] - 1
    return delta[0]
  },
  month: (s, e) => {
    const delta = getDateDelta(s, e)
    const r = delta[0] * 12 + delta[1]
    if (delta[2] < 0) return r - 1
    return r
  },
  day: (s, e) => {
    const s_date = new Date(s.getYear(), s.getMonth(), s.getDate())
    const e_date = new Date(e.getYear(), e.getMonth(), e.getDate())
    return getTimeDelta(s_date, e_date, 24 * 3600000)
  },
  dayWithObject: (s, e) => {
    let r = getTimeDelta(s, e, 1000)
    const day = Math.floor(r / 86400)
    r = r - day * 86400
    const hour = Math.floor(r / 3600)
    r = r - hour * 3600
    const minute = Math.floor(r / 60)
    const second = r - minute * 60
    return { day, hour, minute, second }
  },
  hour: (s, e) => getTimeDelta(s, e, 3600000),
  minute: (s, e) => getTimeDelta(s, e, 60000),
  second: (s, e) => getTimeDelta(s, e, 1000)
}
/**
 *比较两个日期之间相差的天数
 *
 * @export
 * @param {Date} end
 * @param {Date} start
 * @param {Enum:DateIntervalOption} interval
 * @returns
 */
function datedifference(end, start, interval = 'day') {
  // start和end是2006-12-18格式
  if (!start) start = new Date()
  if (!end) end = new Date()
  start = new Date(start)
  end = new Date(end)
  const fn = DateIntervalOption[interval]
  if (!fn) return -1
  return fn(start, end)
}

function relativeDate(d, compareTo) {
  d = new Date(d)
  let now = compareTo || new Date()
  now = new Date(now)
  const nowY = now.getFullYear()
  const dY = d.getFullYear()
  const nowM = now.getMonth() + 1
  const dM = d.getMonth() + 1
  const nowD = now.getDate()
  const dD = d.getDate()
  const sameYear = nowY === dY ? '' : `${dY}年`
  const same = !sameYear && nowM === dM
  const sameMonth = same ? '' : `${dM}月`
  const sameDay = !sameMonth && nowD === dD ? '' : `${dD}日`
  const result = `${sameYear}${sameMonth}${sameDay}`
  return result || compareTo || '今天'
}
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  if (time === null) return null
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  var date = toDate(time)

  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || '00'
  })
  return time_str
}
function sci_str(data, length = 2, padding = '0', prefix_or_append = true) {
  data = `${data}`
  const l = length - data.length
  if (l <= 0) return data
  const r = new Array(l).fill(padding).join('')
  if (prefix_or_append) data = `${r}${data}`
  else data = `${data}${r}`
  return data
}

/**
 * 将任意时间转换为时间
 *
 * @export
 * @param {*} time
 * @returns
 */
function toDate(time) {
  if (typeof time === 'object') {
    return time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    return new Date(time)
  }
}
/**
 * @param {number} time
 * @param {string} option
 * @param {Boolean} show_time 是否显示时分
 * @returns {string}
 */
function formatTime(time, option, show_time) {
  time = toDate(time)
  const d = new Date(time)
  const now = Date.now()

  let diff = (now - d) / 1000
  const isFuture = diff < 0
  const append = isFuture ? '后' : '前'
  diff = Math.abs(diff)
  let result
  if (!isFuture && diff < 60) {
    return `${Math.floor(diff)}秒${append}`
  } else if (diff < 3600) {
    return `${Math.floor(diff / 60)}分钟${append}`
  } else if (diff < 3600 * 24) {
    return `${Math.floor(diff / 3600)}小时${append}`
  } else if (diff < 3600 * 24 * 7) {
    const day_diff = Math.abs(datedifference(now, d))
    if (day_diff === 1) {
      result = isFuture ? '明天' : '昨天'
    } else if (day_diff === 2) {
      result = isFuture ? '后天' : '前天'
    } else {
      result = `${day_diff}天${append}`
    }
    if (result && show_time) {
      const m = time.getMinutes() || '整'
      result = `${result}${time.getHours()}点${m}`
    }
    return result
  }
  return parseTime(time, option)
}
module.exports = {
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
    getTimeDesc,
    formatTime,
    relativeDate,
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
@mixin common($color: #4a9fff) {
  background-color: #1a237e3f !important;
  color: $color !important;
}
.styled-primary-card {
  position: relative;
  @include common();
  :hover {
    .right-button {
      right: 0.5rem;
    }
  }
}

.styled-primary-pagination {
  .el-pagination {
    span {
      color: #4a9fff !important;
    }
    button {
      @include common();
    }
    ul {
      @include common();
    }
    .active {
      background-color: #2279eb !important;
    }
    li {
      @include common();
    }
    input {
      @include common();
    }
  }
}

@import "@/views/dashboard/Statistics/style";
.counter-timer-primary {
  @include common();
  text-shadow: 1px 0px 100px #ffffffc2;
  color: #25ffed;
  background: url(~@/assets/dashboard/images/head_bg.png) no-repeat;
  background-size: 100% 13.5rem;
}
</style>
