import { changePW } from '../../services/common/password'

export default {
  namespace: 'changePW',
  state: {},
  effects: {
    * changePW({ payload }, { put, call }) {
      const data = yield call(changePW, payload)
      if (data.success) {
        // message.success('操作成功');

        yield put({ type: 'app/logout' })

      } else {
        throw data.message
      }
    },
  },
  reducers: {
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
  },
  subscriptions: {},
}
