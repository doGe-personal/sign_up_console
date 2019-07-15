import { message } from 'antd'
import * as agentsService from '../../services/base/agents'
import dataUtils from '../../utils/dataUtils'

export default {
  namespace: 'agents',
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
        if (location.pathname === 'reg/clerks') {
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
      const data = yield call(agentsService.query, payload)
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
      const data = yield call(agentsService.getSingle, payload.id)
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
    * exchangStatus({ payload }, { call, put }) {
      payload.enableFlag = (~payload.enableFlag) + 2
      let data = {}
      if (payload.enableFlag) {
        data = yield call(agentsService.enableEntity, payload.id)
      } else {
        data = yield call(agentsService.disableEntity, payload.id)
      }
      if (data.success) {
        yield put({ type: 'query' })
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
    * create({ payload }, { call, put }) {
      const data = yield call(agentsService.update, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        message.success('保存成功！')
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * update({ payload }, { call, put, select }) {
      const currentItem = yield select(({ agents }) => agents.currentItem)
      const newCurrItem = Object.assign({}, { id: currentItem.id }, payload)
      const data = yield call(agentsService.update, newCurrItem)
      if (data.success) {
        yield put({ type: 'hideModal' })
        message.success('保存成功！')
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * delete({ payload }, { call, put }) {
      const data = yield call(agentsService.remove, [...payload.ids])
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * onConfirm({ payload }, { call, put }) {
      const data = yield call(agentsService.onConfirm, payload)
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
    * exportFile({ payload }, { call, put, select }) {
      const filterData = yield select(({ agents }) => agents.filterData)
      const data = yield call(agentsService.exportFile, filterData)
      if (data.success) {
        dataUtils.downloadBase64(data.data, '店员信息.xlsx')
      } else {
        throw data
      }
    },

    * onFilterChange({ payload }, { select, put }) {
      const filterData = yield select(({ agents }) => agents.filterData)
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

    showModal(state, action) {
      return { ...state, ...action.payload, modalVisible: true }
    },
  },
}
