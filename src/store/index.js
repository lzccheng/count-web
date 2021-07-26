import Vue from 'vue'
import Vuex from 'vuex'
import { setLs } from '../tool/storage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {}
  },
  mutations: {
    setUser(state, val) {
      state.user = val
    }
  },
  actions: {
    LOGIN({ commit }, val) {
      setLs('token', val.token)
      setLs('user', val)
      commit('setUser', val)
    }
  },
  modules: {
  }
})
