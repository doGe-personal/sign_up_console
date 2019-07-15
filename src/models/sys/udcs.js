import { message } from 'antd'
import * as udcsService from '../../services/sys/udcs'

export default {
  namespace: 'udcs',
  state: {
    list: [],
    total: 0,
    currentItem: {},
    modalVisible: false,
    mode: 'create',
    filterParams: {},
    editable: false,
  },

  subscriptions: {},

  effects: {
    * query({ payload }, { call, put, select }) {
      const { filterParams } = yield select(({ udcs }) => udcs)
      const data = yield call(udcsService.query, { ...filterParams, ...payload })
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data.rows,
            total: data.data.total,
            filterParams: { ...filterParams, ...payload },
          },
        })
      } else {
        throw data
      }
    },

    * querySingle({ payload }, { call, put }) {
      const data = yield call(udcsService.getSingle, payload.id)
      if (data.success) {
        yield put({
          type: 'udcItems/query',
          payload: payload.id,
        })
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
        yield put({ type: 'querySingle', payload })
      }
    },

    * clearCache({ payload }, { call }) {
      const data = yield call(udcsService.clearCache)
      if (data.success) {
        message.success('操作成功')
      } else {
        throw data
      }
    },

    * create({ payload }, { select, call, put }) {
      const id = yield select(({ udcs }) => udcs.currentItem.id)
      const items = yield select(({ udcItems }) => udcItems.list)

      const newData = { ...payload, id, items }
      const data = yield call(udcsService.update, newData)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * update({ payload }, { select, call, put }) {
      const id = yield select(({ udcs }) => udcs.currentItem.id)
      const items = yield select(({ udcItems }) => udcItems.list)

      const newData = { ...payload, id, items }
      const data = yield call(udcsService.update, newData)
      if (data.success) {
        yield put({ type: 'hideModal' })
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
        type: 'udcItems/updateState',
        payload: {
          list: [],
        },
      })
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: false,
          currentItem: {},
        },
      })
    },

    * clean({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          list: [],
          total: 0,
          currentItem: {},
          modalVisible: false,
          mode: 'create',
          filterParams: {},
        },
      })
    },

    * editable({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          editable: payload.showEdit,
        },
      })
    },
  },

  reducers: {
    querySuccess(state, action) {
      const { list, total, filterParams } = action.payload
      return {
        ...state,
        list,
        total,
        filterParams,
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

    hideModal(state, action) {
      return {
        ...state,
        ...action.payload,
        modalVisible: false,
        currentItem: {},
      }
    },
  },
}
