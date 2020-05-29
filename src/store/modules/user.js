import {
  getUserSummary,
  getUserAvatar,
  getUsersVacationLimit
} from '@/api/user/userinfo'
import {
  login,
  logout
} from '@/api/account'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import router, {
  resetRouter
} from '@/router'
import defaultAvatar from '@/assets/plain/defaultAvatar.js'
const state = {
  isUserLogout: false,
  data: {},
  token: getToken(),
  name: '',
  companyid: '',
  dutiesType: '',
  userid: '',
  vacation: {}, // 当前休假状态
  avatar: defaultAvatar,
  introduction: '',
  roles: [],
  isToRegister: true
}

const mutations = {
  SET_ISUSERLOGOUT: (state, val) => {
    state.isUserLogout = val
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_USERID: (state, userid) => {
    state.userid = userid
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_CMPID: (state, name) => {
    state.companyid = name
  },
  SET_DUTYTYPE: (state, type) => {
    state.dutiesType = type
  },
  SET_DATA: (state, data) => {
    state.data = data
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_VACA: (state, vacation) => {
    state.vacation = vacation
  }
}

const actions = {
  // user login
  login({
    commit
  }, userInfo) {
    const {
      username,
      password,
      verify,
      RememberMe
    } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: password,
        RememberMe: RememberMe,
        verify: {
          code: verify
        }
      }).then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  initBase({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getUserSummary(null, true).then(data => {
        commit('SET_NAME', data.realName)
        commit('SET_USERID', data.id)
        commit('SET_CMPID', data.companyCode)
        commit('SET_DUTYTYPE', data.dutiesRawType)
        commit('SET_INTRODUCTION', data.about)
        commit('SET_DATA', data)
        return resolve()
      }).catch(() => {
        return reject()
      })
    })
  },
  initAvatar({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getUserAvatar(null, null, true).then(data => {
        commit('SET_AVATAR', data.url)
        return resolve()
      }).catch(() => {
        commit('SET_AVATAR', defaultAvatar)
        return reject()
      })
    })
  },
  initVacation({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getUsersVacationLimit(null, null, true).then(data => {
        commit('SET_VACA', {
          yearlyLength: 0,
          nowTimes: 0,
          leftLength: 0,
          onTripTimes: 0,
          maxTripTimes: 0,
          ...data
        })
        return resolve()
      }).catch(() => {
        return reject()
      })
    })
  },
  // user logout
  logout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_NAME', '')
        commit('SET_USERID', '')
        commit('SET_AVATAR', defaultAvatar)
        commit('SET_INTRODUCTION', '')
        commit('SET_ISUSERLOGOUT', true)
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // Dynamically modify permissions
  changeRoles({
    commit,
    dispatch
  }, role) {
    return new Promise(resolve => {
      const token = role + '-token'
      commit('SET_TOKEN', token)
      setToken(token)
      const {
        roles
      } = dispatch('getInfo')
      resetRouter()
      // generate accessible routes map based on roles
      const accessRoutes = dispatch('permission/generateRoutes', roles, {
        root: true
      })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
