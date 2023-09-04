import { faceDeviceOptions } from '@/api/securityManage/face/face-record'

const state = {
  init: false,
  faceDeviceOptions: null,
  faceDeviceOptionsDict: null
}
const mutations = {}
const actions = {
  initDictionary({ commit, state }) {
    return new Promise((res, rej) => {
      if (state.init) return res(state)
      state.init = true
      Promise.all([faceDeviceOptions()])
        .then(datas => {
          const toHandleList = ['faceDeviceOptions']
          toHandleList.map((name, index) => {
            state[name] = datas[index] && datas[index].list
            const key = `${name}Dict`
            const dict = {}
            if (!state[name]) return
            state[name].map(i => {
              dict[i.value] = i
            })
            state[key] = dict
          })
          res(state)
        })
        .catch(e => rej(e))
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
