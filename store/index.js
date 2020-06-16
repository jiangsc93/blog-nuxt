import Api from '~/utils/api';
import Cookie from 'js-cookie';
import cookie from 'cookie';
import Types from './types';
import Checkenv from "../utils/checkenv";
export const state = function() {
  return {
    isLogin: false,
    isMobile: false,
    handleFlag: 'login',
    visible: false,
    token: '',
    tagsList: [],
    configList: [],
    userName: '',
    userId: '',
    email: '',
    avatar: '',
    isUserself: false,
    imgurlhttp:  Checkenv.imgurlhttp || 'http://www.jscwwd.com:3000',
    apiHttpUpload: Checkenv.httpUrl || 'http://www.jscwwd.com:3000',
    httpDomain: Checkenv.httpDomain || 'http://www.jscwwd.com',
    showHeader: true,
  }
}

export const getters = {
  getTagsList(state) {
    return state.tagsList;
  },
  getConfigList(state) {
    return state.configList;
  },
  getVisible(state) {
    return state.visible;
  },
  getUserInfo(state) {
    return {
      userName: state.userName || localStorage.getItem('userName'),
      avatar: state.avatar || localStorage.getItem('avatar')
    };
  }
}
export const mutations = {
  init(state, initData) {
    let { userName, avatar, userId, isLogin, token } = initData;
    if (isLogin) {
      initData.isUserself = true;
    }
    Object.assign(state, initData);
    Cookie.set('isLogin', true);
    Cookie.set('userName', userName);
    Cookie.set('avatar', avatar);
    Cookie.set('userId', userId);
    Cookie.set('token', token);
  },
  setHeaderIsShow(state, flag) {
    state.showHeader = flag;
  },
  SET_USER_STATUS (state, flag) {
    state.isLogin = flag;
  },
  setDeviceType(state, val) {
    state.isMobile = val;
  },
  setHandleFlag(state, val) {
    state.handleFlag = val;
  },
  setUserName(state, val) {
    state.userName = val;
  },
  setVisible(state, val) {
    state.visible = val;
  },
  [Types.GET_CONFIGLIST](state, val) {
    state.configList = val;
  },
  [Types.GET_TAGLIST](state, val) {
    state.tagsList = val;
  },
}

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    let cookies = req.headers.cookie && cookie.parse(req.headers.cookie);
    if (!cookies) {
      return;
    }
    let avatar = '';
    avatar = cookies.avatar || '';
    let userId = cookies.userId;
    let userName = cookies.userName;
    let isLogin = false;
    if (cookies.isLogin && cookies.isLogin === 'true') {
      isLogin = true;
    } else {
      isLogin = false;
    }

    commit('init', {
      isLogin,
      userId,
      avatar,
      userName,
    });
  },
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
        if (res.list) {
          let tagsList = res.list;
          commit(Types.GET_TAGLIST, tagsList);
        }
      }, err => {
        console.log('报错啦', err)
      })
  },

}
