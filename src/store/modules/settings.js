import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'
import {
  getUpdateRecord
} from '@/api/common/version'
import { timeZone } from '@/api/common/static'
import { getTimeDelta } from '@/utils'
const {
  showSettings,
  tagsView,
  fixedHeader,
  sidebarLogo,
  title
} = defaultSettings

const state = {
  title: title,
  version: '无版本信息',
  description: '暂无信息',
  notice: '暂无信息',
  create: new Date(),
  theme: variables.theme,
  variables: variables,
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  currentTime_left: 0,
  currentTime_right: 0,
  currentTimeDelta_left: 0,
  currentTimeDelta_right: 0
}
let time_token = null
export function syn_time() {
  if (time_token) clearInterval(time_token)
  // TODO 同步服务器时间
  // 每秒更新一次时间，若误差超过0.5秒，则立即重新同步
  time_token = setInterval(() => {
    const now = new Date()
    const delta = getTimeDelta(new Date(state.currentTime_left - state.currentTimeDelta_left), now, 1)
    // console.log('sync time check delta', delta)
    if (Math.abs(delta) > 1500 || Math.abs(delta) < 500) {
      re_syn_time()
      return
    }
    state.currentTime_left = new Date(now - 0 + state.currentTimeDelta_left)
    state.currentTime_right = new Date(now - 0 + state.currentTimeDelta_right)
  }, 1000)
}
export function re_syn_time() {
  // console.info('resync server time begin')
  state.currentTime_left = '同步中...'
  state.currentTime_right = state.currentTime_left
  timeZone().then(data => {
    const { left, right } = data
    const now = new Date()
    state.currentTime_left = new Date(left.value)
    state.currentTime_right = new Date(right.value)
    state.currentTimeDelta_left = state.currentTime_left - now
    state.currentTimeDelta_right = state.currentTime_right - now
    syn_time()
  })
}
const mutations = {
  CHANGE_SETTING: (state, {
    key,
    value
  }) => {
    if (Object.prototype.hasOwnProperty.call(state, key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({
    commit
  }, data) {
    commit('CHANGE_SETTING', data)
  },
  initProject({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getUpdateRecord(0, 1).then(data => {
        if (data.list && data.list.length > 0) {
          const version = data.list[0]
          state.version = version.version
          state.description = version.description
          state.noice = data.notice || '暂无信息'
          state.create = version.create
        }
        resolve()
      }).catch(e => reject())
    })
  },
  sync_time({ commit, state }) {
    return new Promise((res, rej) => {
      re_syn_time()
      res()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
