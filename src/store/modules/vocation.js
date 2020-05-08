import { getAllStatus } from '@/api/apply'
const state = {
  vacationDetail: {}, // 当前选中的休假详情
  statusDic: [], // 休假申请状态的描述
  actionDic: {} // 状态操作对应
}

const mutations = {
  SET_StatusDic: (state, statusDic) => {
    state.statusDic = statusDic
  },
  SET_ActionDic: (state, val) => {
    state.actionDic = val
  }
}

const actions = {
  initDic({ commit, state }) {
    return new Promise((resolve, reject) => {
      getAllStatus().then(data => {
        commit('SET_StatusDic', data.list)
        commit('SET_ActionDic', data.actions)
        return resolve()
      }).catch(() => {
        return reject()
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
