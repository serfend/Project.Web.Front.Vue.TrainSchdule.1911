<template>
  <div
    v-if="showCalendar"
    :style="{ 'pointer-events': disabled ? 'none' : 'auto' }"
    class="calendar-container"
  >
    <div
      class="calendar-body"
      @touchstart="bindTouchStart"
      @touchend="bindTouchEnd"
    >
      <div class="calendar-title">
        <span
          class="calendar-title-cancle"
          @click="cancelChooseDate()"
        >取消</span>
        <div class="calendar-title-choose">
          <span
            class="calendar-title-icon calendar-title-icon-left"
            @click="preMonth"
          />
          <span
            class="calendar-title-show"
          ><span>{{ year }} - {{ month }}</span></span>
          <span
            class="calendar-title-icon calendar-title-icon-right"
            @click="nextMonth"
          />
        </div>
        <span class="calendar-title-confirm" @click="resetCalendar">重置</span>
      </div>
      <div class="calendar-week">
        <span
          v-for="(item, index) in week"
          :key="index"
          class="calendar-week-item"
          :class="{ 'calendar-week-item-holiday': index === 5 || index === 6 }"
        >{{ item }}</span>
      </div>
      <div class="calendar-day">
        <div
          v-for="(item, index) in dayData"
          :key="index"
          class="calendar-day-row"
        >
          <div
            v-for="(ddata, dindex) in item"
            :id="ddata.id"
            :key="dindex"
            class="calendar-day-item"
            :class="{
              'week-7': ddata && (dindex === 5 || dindex === 6),
              'calendar-disabled': ddata.disabled,
              'calendar-choose-range':
                ddata.timestamp >= chooseDayStartTimeStamp &&
                ddata.timestamp <= chooseDayEndTimeStamp &&
                type === 'rangeDay'
            }"
            @click="chooseDate(ddata)"
          >
            <span
              v-if="ddata"
              class="calendar-day-item-num"
              :class="{
                'calendar-checked-default': chooseToday === ddata.id,
                'calendar-checked-start': chooseDayStart === ddata.id,
                'calendar-checked-end': chooseDayEnd === ddata.id
              }"
            >{{ ddata.number }}</span>
            <span
              v-if="ddata.holiday"
              class="calendar-day-item-holiday"
            >休</span>
            <span v-if="ddata" class="calendar-day-item-text">{{
              ddata.text ? ddata.text : ""
            }}</span>
            <span
              v-if="ddata"
              class="calendar-day-item-flag"
              :class="{ 'calendar-day-item-flag-checked': ddata.haveFlag }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CalendarResult from './calendar.result'
import { setCalendarGlobalParams } from './show.day'
import ShowDayObject from './show.day'

export default {
  /** *
   * 说明：日历组件，适用于vue,mpvue
   * 需求：node-sass, sass-loader (配置方式请百度)
   * 参数说明：
   * :params.id  可以在同一个页面使用多个此组件，返回日期的时候会携带id
   * :params.chooseDayTextStart  选择的日期 '2018-1-2'
   * :params.chooseDayTextEnd  选择的日期 '2018-1-2'
   * :params.minDate  最小选择日期 '2018-10-11'
   * :params.maxDate  最大选择日期 '2019-2-10'
   * :holidayData 假日日期设置
   * :activityData  有活动的日期显示flag圆点 {year:{ month:[]}} 月和日小于10不可以有0，01 =》1
   *
   * 函数说明：
   * @chooseDate  选择日期之后执行的函数 { startDate: '2018-11-28', endDate: '2018-12-28', id: 'default' }
   * @hideChooseDate  日历隐藏时执行函数
   * @changeDate  切换月份和取消选择日期执行函数，主要用于动态获取假日和特殊日期，如果重置日期startDate值为当天日期。 { startDate: '2018-11-28', endDate: '2018-12-28', id: 'default' }
   *
   * 问题解决：
   * 1.chinese-calendar.js 样式报错。
   * 解决： build/webpack.base.conf.js   rule > eslint-loader > 添加 exclude: [resolve('src/plugs')]
   *
   * 2. 默认是px单位，可以修改 $rpx: 1rpx; 变量改为 rpx
   **/
  name: 'ComCalendar',
  props: {
    params: { type: Object, default: () => ({}) },
    activityData: { type: Object, default: () => ({}) },
    holidayData: { type: Object, default: () => ({}) },
    type: { type: String, default: 'default' }, // default, rangeDay
    disabled: { type: Boolean, default: true },
    followEndDate: { type: Boolean, default: true }
  },
  data: () => ({
    todayObj: {},
    chooseDayStart: '', // 选择的日期
    chooseDayEnd: '',
    chooseToday: '',
    year: '',
    month: '',
    day: '', // 今日
    week: ['一', '二', '三', '四', '五', '六', '日'],
    dayData: [],
    limitMinDate: null,
    limitMaxDate: null,
    showCalendar: true,
    flagArr: null,
    checkedMonthFlagArr: null,
    touchObj: {},
    touchLimit: 30, // px
    calendarResult: null,
    result: {},
    changeDateResult: {}
  }),
  computed: {
    chooseDayStartTimeStamp(val) {
      if (!this.chooseDayStart) return null
      return new Date(this.chooseDayStart.replace('-', '/')).getTime()
    },
    chooseDayEndTimeStamp(val) {
      if (!this.chooseDayEnd) return null
      return new Date(this.chooseDayEnd.replace('-', '/')).getTime()
    }
  },
  watch: {
    params: {
      handler(v) {
        this.onParamUpdated()
      },
      deep: true,
      immediate: true
    },
    activityData: {
      immediate: true,
      handler() {
        if (this.year && this.month) {
          this.constFlagArr()
        }
      }
    }
  },
  methods: {
    onParamUpdated() {
      this.calendarResult = new CalendarResult({ id: `c@${this.params.id}` })
      const {
        chooseDayTextStart,
        chooseDayTextEnd,
        minDate,
        maxDate
      } = this.params
      this.todayObj = this.getDateInf(new Date())
      this.chooseToday =
        this.todayObj.y + '-' + this.todayObj.m + '-' + this.todayObj.d

      if (minDate) {
        this.limitMinDate = this.getSplitDate(minDate)
      }

      if (maxDate) {
        this.limitMaxDate = this.getSplitDate(maxDate)
      }
      if (chooseDayTextStart) {
        this.setChooseDay({ start: chooseDayTextStart })
        const follow_date = this.followEndDate
          ? chooseDayTextEnd
          : chooseDayTextStart
        this.setGlobalDate(this.getSplitDate(follow_date))
      } else {
        this.setGlobalDate(this.todayObj)
      }

      if (chooseDayTextEnd) {
        this.setChooseDay({ end: chooseDayTextEnd })
      }
    },
    getSplitDate(target) {
      target = target || new Date()
      return this.getDateInf(new Date(target))
    },

    getDateInf(date) {
      return {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate()
      }
    },

    setGlobalDate(obj) {
      this.year = obj.y
      this.month = obj.m
      this.day = obj.d

      this.constFlagArr()
      this.constShowDayData()
    },

    constFlagArr() {
      // 判断是否有需要特殊显示的日期
      if (this.activityData) {
        const flagYear = this.activityData[parseInt(this.year)]
        if (flagYear && flagYear[parseInt(this.month)]) {
          this.flagArr = flagYear[parseInt(this.month)]
        }
      }
    },

    constShowDayData() {
      setCalendarGlobalParams({
        flagArr: this.flagArr,
        limitMaxDate: this.limitMaxDate,
        limitMinDate: this.limitMinDate,
        holidayData: this.holidayData
      })

      this.dayData = new ShowDayObject({
        year: this.year,
        month: this.month
      }).getVal()
    },

    preMonth() {
      this.setMonth(parseInt(this.month) - 1)
    },

    nextMonth() {
      this.setMonth(parseInt(this.month + 1))
    },

    setMonth(month) {
      const result = this.getDateInf(new Date(this.year, month - 1, this.day))
      this.flagArr = null
      this.setGlobalDate(result)
      this.$emit('changeDate', {
        startDate: result,
        id: this.params.id
      })
    },

    chooseDate(params) {
      if (params.disabled) {
        return
      }

      // 重置日历显示
      if (!this.calendarResult.resultVal.startDate) {
        this.resetChooseDay()
      }

      this.calendarResult.setForDate(params)
      this.setChooseDay({ start: this.calendarResult.resultVal.startDate })

      // 选择某一天时
      if (this.type === 'default') {
        this.doneChooseDate()
        return
      }

      // 选择时间范围
      this.setChooseDay({ end: this.calendarResult.resultVal.endDate })
      if (this.calendarResult.resultVal.endDate) {
        this.doneChooseDate()
      }
    },

    setChooseDay({ start, end }) {
      if (start !== undefined) {
        this.chooseDayStart = start
      }

      if (end !== undefined) {
        this.chooseDayEnd = end
      }
    },

    resetChooseDay() {
      this.setChooseDay({ start: null, end: null })
    },

    doneChooseDate() {
      this.$emit('chooseDate', this.calendarResult.resultVal)
      this.changeDateResult = this.calendarResult.resultVal
      this.hideCalendar()
    },

    resetCalendar() {
      this.changeDateResult = this.calendarResult.resetResult
      this.resetChooseDay()
      this.$emit('chooseDate', this.calendarResult.resetResult)
      this.hideCalendar()
      this.emitChangeDateParams()
    },

    hideCalendar(e) {
      this.showCalendar = false
      this.$emit('hideChooseDate')
    },

    cancelChooseDate() {
      this.changeDateResult = {
        id: this.params.id,
        startDate: this.params.chooseDayTextStart
          ? this.getSplitDate(this.params.chooseDayTextStart)
          : this.todayObj,
        endDate: this.params.chooseDayTextEnd
          ? this.getSplitDate(this.params.chooseDayTextEnd)
          : undefined
      }
      this.hideCalendar()
      this.emitChangeDateParams()
    },

    emitChangeDateParams() {
      this.$emit('changeDate', this.changeDateResult)
    },

    bindTouchStart(e) {
      this.setTouchObj({ e, type: 'start' })
    },

    bindTouchEnd(e) {
      this.setTouchObj({ e, type: 'end' })

      if (this.touchObj.end - this.touchObj.start > this.touchLimit) {
        this.preMonth()
      } else if (this.touchObj.end - this.touchObj.start < -this.touchLimit) {
        this.nextMonth()
      }
    },

    setTouchObj({ e, type }) {
      if (e.mp) {
        this.touchObj[type] = e.mp.changedTouches[0].clientX
      } else {
        this.touchObj[type] = e.changedTouches[0].clientX
      }
    }
  }
}
</script>
<style lang="scss" scoped>
$rpx: 0.5px;
$topic-color: #32da31;
$orange-color: #ffb62e;
$weekday-color: #fff3dd7f;

.calendar-container {
  transition: all ease 0.5s;
  width: 100%;
  // height: 100vh;
  overflow: hidden;
  z-index: 999;

  .calendar-body {
    width: 100%;
    padding: 30 * $rpx 0;
    background-color: #ffffff;

    .calendar-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-flow: row nowrap;
      margin: 0 5%;

      .calendar-title-confirm {
        cursor: pointer;
        color: $topic-color;
        flex-shrink: 0;
      }

      .calendar-title-cancle {
        cursor: pointer;
        color: #515151;
        flex-shrink: 0;
      }

      .calendar-title-choose {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: row nowrap;

        .calendar-title-icon {
          cursor: pointer;
          height: 40 * $rpx;
          width: 40 * $rpx;
          padding: 0 50 * $rpx;
          flex-shrink: 0;
        }

        .calendar-title-icon-left {
          background: url("./calendar_arrow_left.png") no-repeat 50% 50%;
          background-size: contain;
        }

        .calendar-title-icon-right {
          background: url("./calendar_arrow_right.png") no-repeat 50% 50%;
          background-size: contain;
        }

        .calendar-title-show {
          flex-shrink: 0;
          span {
            font-weight: bold;
            margin-right: 10 * $rpx;
          }
        }
      }
    }

    .calendar-week {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-flow: row nowrap;

      margin-top: 30 * $rpx;
      padding-top: 20 * $rpx;
      border-top: 1 * $rpx solid #dcdcdc;

      .calendar-week-item {
        text-align: center;
        flex-basis: calc(100% / 7);
        padding: 10 * $rpx 0;
        font-weight: bold;
      }

      .calendar-week-item-holiday {
        color: #9d9d9d;
      }
    }

    .calendar-day {
      .calendar-day-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-flow: row nowrap;

        .calendar-day-item {
          cursor: pointer;
          position: relative;
          text-align: center;
          flex-basis: calc(100% / 7);
          padding: 16 * $rpx 0;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-flow: column nowrap;

          .calendar-day-item-num {
            width: 48 * $rpx;
            height: 48 * $rpx;
            text-align: center;
            line-height: 48 * $rpx;
            border-radius: 100%;
            font-weight: bold;
          }

          .calendar-day-item-holiday {
            position: absolute;
            right: 8 * $rpx;
            top: 40%;
            transform: translateY(-40%);
            font-size: 10px;
            color: $orange-color;
          }

          .calendar-day-item-text {
            font-size: 10px;
            line-height: normal;
            height: 30 * $rpx;
          }

          .calendar-day-item-flag {
            width: 10 * $rpx;
            height: 10 * $rpx;
            border-radius: 100%;
          }

          .calendar-day-item-flag-checked {
            background-color: $orange-color;
          }
        }

        .week-7 {
          background-color: $weekday-color;
        }

        .calendar-choose-range {
          box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.1);
          background-color: #00003010;
        }

        .calendar-checked-default {
          background-color: $topic-color;
          color: #ffffff;
        }

        .calendar-checked-start {
          background-color: $orange-color;
          color: #ffffff;
        }

        .calendar-checked-end {
          background-color: $orange-color;
          color: #ffffff;
        }

        .calendar-disabled {
          opacity: 0.7;
        }
      }
    }
  }
}
</style>
