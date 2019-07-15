import { routerRedux } from 'dva/router'
import { getCaptcha, login } from '../../services/app'
import { networkUtils } from '@utils/'

export default {
  namespace: 'login',
  state: {
    loginLoading: false,
    captcha: '',
  },
  effects: {
    * initCaptcha(action, { put, call }) {
      const csrfToken = yield call(networkUtils.csrf)
      if (csrfToken) {
        yield put({
          type: 'getCaptcha',
        })
      }
    },

    * getCaptcha(action, { put, call }) {
      const data = yield call(getCaptcha)
      yield put({
        type: 'updateCaptcha',
        payload: { captcha: `data:image/jpeg;base64,${data.data}` },
      })
    },

    * login({ payload }, { put, call }) {
      yield put({ type: 'showLoginLoading' })
      const data = yield call(login, payload)
      yield put({ type: 'hideLoginLoading' })
      if (data.success) {
        // login成功，开始让app拉用户信息和菜单
        yield put({ type: 'app/query' })
        yield put(routerRedux.push('/reg/customers'))
      } else {
        // 失败则刷新验证码
        yield put({
          type: 'getCaptcha',
          payload: {},
        })
        throw data.message
      }
    },
  },
  reducers: {
    updateCaptcha(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    showLoginLoading(state) {
      return {
        ...state,
        loginLoading: true,
      }
    },
    hideLoginLoading(state) {
      return {
        ...state,
        loginLoading: false,
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/login') {
          dispatch({
            type: 'initCaptcha',
          })
        }
      })
    },
  },
}
