import Api from '~/utils/api'
import Cookie from 'js-cookie'
import Types from './types'

export const state = () => ({
  isLogin: false,
  isMobile: false,
  tagsList: []
})

export const getters = {
  getTagsList(state) {
    return state.tagsList;
  }
}
export const mutations = {
  SET_USER (state, flag) {
    state.isLogin = flag;
  },
  setDeviceType(state, val) {
    state.isMobile = val;
  },
  [Types.GET_TAGLIST](state, val) {
    state.tagsList = val;
  }
}

export const actions = {

  isLoginFn(state) {
    state.isLogin = true;
  },

  async login({ commit }, opts) {
    try {
      const { data } = await Api.login(opts)
      console.log(data.userInfo.userName, '55555555555555555555555555');
      Cookie.set('authUser', data.userInfo.userName)
    } catch (error) {
      console.log(error, 'error');
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },

  async logout({ commit }) {
    Cookie.remove('authUser')
  },
  [Types.GET_TAGLIST]: async ({ commit }, data) => {
    await Api.getTagList(data)
      .then(res => {
        if (res.status === 200 && res.data.data.list) {
          let tagsList = res.data.data.list;
          commit(Types.GET_TAGLIST, tagsList);
        }
      }, err => {
        console.log('报错啦', err)
      })
  }

}
