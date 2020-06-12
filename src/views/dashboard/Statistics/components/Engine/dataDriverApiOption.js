const dailyApiOption = [{
  key: 'applyMembersCount',
  name: '申请人数', // 图表展示项
  caculateRate: true // 是否新增一个比率系列
}, {
  key: 'completeVacationExpectDayCount',
  name: '应休天数',
  caculateRate: true
}, {
  key: 'completeVacationRealDayCount',
  name: '实休天数',
  caculateRate: true
}, {
  key: 'completeYearlyVacationCount',
  name: '休满假数',
  caculateRate: true
}, {
  key: 'membersCount',
  name: '总人数',
  isPrimary: true
}, {
  key: 'membersVacationDayLessThanP60',
  name: '休假低于60%数',
  caculateRate: true
}]
import {
  getAppliesNew,
  getAppliesComplete,
  getAppliesProcess,
  getAppliesDailyProcess
} from '@/api/statistics'
export const apiOption = {
  new: {
    name: '新增休假', // api名称
    api: getAppliesNew, // api方法
    props: [{ // 单个实体展示属性
      key: 'day',
      name: '天数'
    }, {
      key: 'value',
      name: '次数'
    }],
    accumulate: true, // 是否仅展示最后一条
    chartShow: [true, false, false] // 在哪些图表上展示
  },
  complete: {
    name: '完成休假',
    api: getAppliesComplete,
    props: [{
      key: 'day',
      name: '天数'
    }, {
      key: 'value',
      name: '次数'
    }],
    accumulate: true,
    chartShow: [true, false, false]
  },
  process: {
    name: '完成情况',
    api: getAppliesProcess,
    props: [{
      key: 'applyCount',
      name: '申请数'
    }, {
      key: 'applySumDayCount',
      name: '天数'
    }],
    accumulate: true,
    chartShow: [true, false, false]
  },
  daily: {
    name: '累积情况',
    api: getAppliesDailyProcess,
    props: dailyApiOption,
    accumulate: false,
    chartShow: [true, true, false]
  }
}
