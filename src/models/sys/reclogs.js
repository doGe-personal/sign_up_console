import * as reclogsService from '../../services/sys/reclogs'

export default {
  namespace: 'reclogs',
  state: {
    list: [],
    total: 0,
  },

  effects: {
    * query({ payload }, { call, put, select }) {
      const data = yield call(reclogsService.query, { ...payload })
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
  },
}
