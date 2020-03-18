import Api from '~/utils/api'
import Cookie from 'js-cookie'
import Types from './types'
import Checkenv from "../utils/checkenv";
export const state = function() {
  return {
    isLogin: false,
    isMobile: false,
    tagsList: [],
    configList: [],
    customerName: '',
    avatorSrc: '',
    imgurlhttp:  Checkenv.imgurlhttp || 'http://www.jscwwd.com:3000',
    apiHttp: Checkenv.httpUrl || 'https://www.jscwwd.com',
  }
}

export const getters = {
  getTagsList(state) {
    return state.tagsList;
  },
  getConfigList(state) {
    return state.configList;
  },
  getCustomerInfo(state) {
    return {customerName: state.customerName || Cookie.get('customerName'), avatorSrc: state.avatorSrc || Cookie.get('avatorSrc')};
  }
}
export const mutations = {
  SET_USER (state, flag) {
    state.isLogin = flag;
  },
  setDeviceType(state, val) {
    state.isMobile = val;
  },
  setCustomer(state, val) {
    state.customerName = val.customerName || Cookie.get('customerName');
    state.avatorSrc = val.avatorSrc || Cookie.get('avatorSrc');
  },
  [Types.GET_CONFIGLIST](state, val) {
    state.configList = val;
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
      Cookie.set('authUser', data.userInfo.userName)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },

  async logout({ commit }) {
    Cookie.remove('authUser');
    sessionStorage.clear();
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
  },
  [Types.GET_CONFIGLIST]: async ({ commit }, data) => {
    await Api.getConfigList(data)
      .then(res => {
        if (res.status === 200 && res.data.data.list) {
          let configList = res.data.data.list;
          commit(Types.GET_CONFIGLIST, configList);
        }
      }, err => {
        console.log('报错啦', err)
      })
  },

}
