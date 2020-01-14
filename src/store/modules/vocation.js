import { getAllStatus } from '@/api/apply'
const state = {
  vacationDetail: {}, // 当前选中的休假详情
  statusDic: [] // 休假申请状态的描述
}

const mutations = {
  SET_StatusDic: (state, statusDic) => {
    state.statusDic = statusDic
  }
}

const actions = {
  initDic({ commit, state }) {
    return new Promise((resolve, reject) => {
      getAllStatus().then(data => {
        console.log(data.list)
        commit('SET_StatusDic', data.list)
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
