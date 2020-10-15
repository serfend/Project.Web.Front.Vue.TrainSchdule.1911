import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'
import {
  getUpdateRecord
} from '@/api/common/version'

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
  sidebarLogo: sidebarLogo
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
