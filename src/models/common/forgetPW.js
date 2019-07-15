import { routerRedux } from 'dva/router'
import { resetPW } from '../../services/common/password'
import { getCaptcha } from '../../services/app'
import { message } from 'antd'

export default {
  namespace: 'forgetPW',
  state: {
    captcha: '',
  },
  effects: {
    * getCaptcha({ payload }, { put, call, select }) {
      const data = yield call(getCaptcha)
      yield put({
        type: 'updateCaptcha',
        payload: { captcha: `data:image/jpeg;base64,${data.data}` },
      })
    },

    * resetPW({ payload }, { put, call }) {
      const data = yield call(resetPW, payload)
      if (data.success) {
        yield put(routerRedux.push('/login'))
        message.success('操作成功')
      } else { // 失败则刷新验证码
        yield put({
          type: 'getCaptcha', payload: {},
        })
        throw data.message
      }
    },

    * return({ payload }, { put }) {
      yield put(routerRedux.push('/login'))
    },

  },
  reducers: {
    updateCaptcha(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({
        type: 'getCaptcha',
      })
    },
  },
}
