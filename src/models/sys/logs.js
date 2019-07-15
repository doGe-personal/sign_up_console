import * as logsService from '../../services/sys/logs'

export default {
  namespace: 'logs',
  state: {
    list: [],
    total: 0,
    currentItem: {},
    modalVisible: false,
    mode: 'create',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/sys/logs') {
          // dispatch({
          //   type: 'query',
          //   payload: {
          //     offset: 0,
          //     limit: 10,
          //   },
          // })
        }
      })
    },
  },

  effects: {
    * query({ payload }, { call, put }) {
      const data = yield call(logsService.query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data.rows,
            total: data.data.total,
          },
        })
      } else {
        throw data
      }
    },

    * querySingle({ payload }, { call, put }) {
      const data = yield call(logsService.getSingle, payload.id)
      if (data.success) {
        yield put({
          type: 'showModal',
          payload: {
            currentItem: data.data,
            mode: payload.mode,
          },
        })
      } else {
        throw data
      }
    },

    * getSingle({ payload }, { put }) {
      if (payload.mode === 'create') {
        yield put({
          type: 'showModal',
          payload: {
            mode: payload.mode,
          },
        })
      } else {
        yield put({ type: 'querySingle', payload: payload })
      }
    },

    // * delete({ payload }, { call, put }) {
    //   const data = yield call(logsService.remove, [...payload.ids])
    //   if (data.success) {
    //     yield put({ type: 'query' })
    //   } else {
    //     throw data
    //   }
    // },

    * view({ payload }, { put }) {
      yield put({ type: 'hideModal' })
    },

    * hideModal({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: false,
          currentItem: {},
        },
      })
    },
  },

  reducers: {
    querySuccess(state, action) {
      const { list, total } = action.payload
      return {
        ...state,
        list,
        total,
      }
    },

    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    showModal(state, action) {
      return { ...state, ...action.payload, modalVisible: true }
    },
  },
}
