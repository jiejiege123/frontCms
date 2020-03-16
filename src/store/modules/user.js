/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-30 09:31:42
 * @LastEditTime: 2020-03-16 13:28:51
 * @LastEditors: Please set LastEditors
 */
import { login, logout, getInfo, getRouter } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userInfo: '',
  avatar: '',
  routers: [],
  finishtip: '',
  sysInfo: '',
  verifyFlag: false,
  loading: false
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, info) => {
    state.userInfo = info
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROUTERS: (state, routers) => {
    state.routers = routers
  },
  SET_FINISHTIP: (state, finishtip) => {
    state.finishtip = finishtip
  },
  SET_VERIFYFLAG: (state, verifyFlag) => {
    state.verifyFlag = verifyFlag
  },
  SET_LOADING: (state, loading) => {
    state.loading = loading
  },
  SET_SYSINFO: (state, data) => {
    state.sysInfo = data
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, passwordPut } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: passwordPut }).then(response => {
        // const { data } = response
        // console.log(response)
        commit('SET_TOKEN', response.Data.id)
        // commit('SET_USERINFO', response.Data)
        setToken(response.Data.id)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo({ id: state.token }).then(response => {
        const { Data } = response
        if (!Data) {
          reject('获取用户信息失败，请重新登录！')
        }
        commit('SET_USERINFO', Data)
        resolve(Data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      //   commit('SET_TOKEN', '')
      //   removeToken()
      //   resetRouter()
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
      commit('SET_TOKEN', '')
      commit('SET_USERINFO', '')
      removeToken()
      resetRouter()
      resolve()
    })
    // 清除cokie
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_USERINFO', '')
      removeToken()
      resolve()
    })
  },

  // 获取路由
  getRouters({ commit }) {
    return new Promise((resolve, reject) => {
      getRouter().then((res) => {
        commit('SET_ROUTERS', res.Data.authorizeMenu)
        resolve(res.Data.authorizeMenu)
      }).catch(error => {
        reject(error)
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

