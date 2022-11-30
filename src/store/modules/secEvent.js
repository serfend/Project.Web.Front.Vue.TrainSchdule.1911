import { dictionary as securityEventType } from '@/api/securityManage/security-event/event'

const state = {
  securityEventTypes: null,
  securityEventTypesDict: null
}
const mutations = {
}

const actions = {
  initDictionary({
    commit,
    state
  }) {
    return new Promise((res, rej) => {
      if (state.securityEventTypes) return res(state)
      state.securityEventTypes = {}

      const toHandleList = ['securityEventTypes']
      Promise.all([securityEventType()]).then(datas => {
        toHandleList.map((name, index) => {
          state[name] = datas[index] && datas[index].list
          const key = `${name}Dict`
          const dict = {}
          if (!state[name]) return
          state[name].map(i => {
            dict[i.id] = i
          })
          state[key] = dict
        })
        res(state)
      }).catch(e => rej(e))
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
