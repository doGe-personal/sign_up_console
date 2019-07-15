import * as ousService from '../../services/base/ous'
import { message } from 'antd'
import dataUtils from '../../utils/dataUtils'

export default {
  namespace: 'ous',
  state: {
    list: [],
    total: 0,
    currentItem: {},
    modalVisible: false,
    mode: 'create',
    filterData: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === 'base/ous') {
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
    * query({ payload }, { call, put, select }) {
      yield put({
        type: 'updateState',
        payload: { filterData: payload },
      })
      const data = yield call(ousService.query, payload)
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
      const data = yield call(ousService.getSingle, payload.id)
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

    * delete({ payload }, { select, call, put }) {
      const data = yield call(ousService.remove, [...payload.ids])
      if (data.success) {
        const filterData = yield select(({ ous }) => ous.filterData)
        yield put({
          type: 'query',
          payload: filterData,
        })
      } else {
        throw data
      }
    },
    * create({ payload }, { select, call, put }) {
      const data = yield call(ousService.update, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        const filterData = yield select(({ ous }) => ous.filterData)
        yield put({
          type: 'query',
          payload: filterData,
        })
      } else {
        throw data
      }
    },

    * update({ payload }, { select, call, put }) {
      const currentItem = yield select(({ ous }) => ous.currentItem)
      const newItem = Object.assign({}, { id: currentItem.id }, payload)
      const data = yield call(ousService.update, newItem)
      if (data.success) {
        yield put({ type: 'hideModal' })
        const filterData = yield select(({ ous }) => ous.filterData)
        yield put({
          type: 'query',
          payload: filterData,
        })
      } else {
        throw data
      }
    },
    * onChangeOu({ payload }, { select, call, put }) {
      const filterData = yield select(({ ous }) => ous.filterData)
      const newFilterData = Object.assign({}, filterData, payload)
      yield put({
        type: 'query',
        payload: newFilterData,
      })
    },
    * refreshPass({ payload }, { select, call, put }) {
      const data = yield call(ousService.refreshPass, payload.id)
      if (data.success) {
        message.success('重置成功！')
        const filterData = yield select(({ ous }) => ous.filterData)
        yield put({
          type: 'query',
          payload: filterData,
        })
      } else {
        throw data
      }
    },

    * exportFile({ payload }, { call, put, select }) {
      const filterData = yield select(({ ous }) => ous.filterData)
      const data = yield call(ousService.exportFile, filterData)
      if (data.success) {
        dataUtils.downloadBase64(data.data, '组织信息.xlsx')
      } else {
        throw data
      }
    },

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
