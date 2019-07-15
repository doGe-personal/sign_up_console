import * as prtsService from '../../services/base/prts'
import { message } from 'antd'

export default {
  namespace: 'prts',
  state: {
    list: [],
    total: 0,
    currentItem: {},
    modalVisible: false,
    mode: 'create',
  },

  effects: {
    * query({ payload }, { call, put, select }) {
      const data = yield call(prtsService.query, { ...payload })
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
      const data = yield call(prtsService.getSingle, payload.id)
      if (data.success) {
        yield put({
          type: 'showModal',
          payload: {
            currentItem: data.data,
            mode: payload.mode,
          },
        })
        yield put({
          type: 'jdcards/query',
          payload: data.data.id,
        })
      } else {
        throw data
      }
    },

    * getSingle({ payload }, { put }) {
      if (payload.mode === 'create') {
        yield put({
          type: 'jdcards/updateState',
          payload: {
            list: [],
          },
        })
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
    * create({ payload }, { call, put, select }) {
      const jdcards = yield select(({ jdcards }) => jdcards.list)
      payload.jdcards = jdcards
      const data = yield call(prtsService.update, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        message.success('保存成功！')
        yield put({ type: 'query' })
      }
    },
    * update({ payload }, { call, put, select }) {
      const currentItem = yield select(({ prts }) => prts.currentItem)
      const jdcards = yield select(({ jdcards }) => jdcards.list)
      payload.jdcards = jdcards
      const newCurrItem = Object.assign({}, { id: currentItem.id }, payload)
      const data = yield call(prtsService.update, newCurrItem)
      if (data.success) {
        yield put({ type: 'hideModal' })
        message.success('保存成功！')
        yield put({ type: 'query' })
      }
    },

    * delete({ payload }, { call, put }) {
      const data = yield call(prtsService.remove, [...payload.ids])
      if (data.success) {
        yield put({ type: 'query' })
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
