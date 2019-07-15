import * as actpartsService from '../../services/rep/actparts'
import dataUtils from '../../utils/dataUtils'

export default {
  namespace: 'actparts',
  state: {
    list: [],
    total: 0,
    filterData: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/rep/actparts') {
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
      const data = yield call(actpartsService.query, payload)
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
    * exportFile({ payload }, { call, put, select }) {
      const filterData = yield select(({ actparts }) => actparts.filterData)
      const data = yield call(actpartsService.exportFile, filterData)
      if (data.success) {
        dataUtils.downloadBase64(data.data, '活动参与情况.xlsx')
      } else {
        throw data
      }
    },
    * onfilterData({ payload }, { select, put }) {
      const filterData = yield select(({ actparts }) => actparts.filterData)
      const newFilterData = Object.assign({}, filterData, payload)
      yield put({
        type: 'updateState',
        payload: {
          filterData: newFilterData,
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
  },
}
