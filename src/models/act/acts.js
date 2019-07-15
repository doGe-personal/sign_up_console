import * as actsService from '../../services/act/acts'
import { routerRedux } from 'dva/router'
import dataUtils from '../../utils/dataUtils'
import { message } from 'antd'

export default {
  namespace: 'acts',
  state: {
    list: [],
    total: 0,
    currentItem: {},
    modalVisible: false,
    mode: 'create',
  },

  subscriptions: {},

  effects: {
    * query({ payload }, { call, put }) {
      const data = yield call(actsService.query, payload)
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

    * getSingle({ payload }, { put, call }) {
      yield put({
        type: 'actsForm/updateState',
        payload: {
          mode: payload.mode,
        },
      })
      if (payload.mode === 'create') {
        yield put(routerRedux.push(`/act/maintains/create`))
      } else {
        yield put(routerRedux.push(`/act/maintains/${payload.id}`))
      }
    },


    * delete({ payload }, { call, put }) {
      const data = yield call(actsService.remove, [...payload.ids])
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * view({ payload }, { put }) {
      yield put({ type: 'hideModal' })
    },
    * exchangStatus({ payload }, { call, put }) {
      payload.enableFlag = (~payload.enableFlag) + 2
      let data = {}
      if (payload.enableFlag) {
        data = yield call(actsService.enableEntity, payload.id)
      } else {
        data = yield call(actsService.disableEntity, payload.id)
      }
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
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
      const data = yield call(actsService.exportFile, payload)
      if (data.success) {
        dataUtils.downloadBase64(data.data, '供应商配额.xlsx')
      } else {
        throw data
      }
    },

    * handleUpload({ payload }, { call, put, select }) {
      const data = yield call(actsService.patchImport, payload)
      console.log(data)
      if (data.success) {
        if (data.data && Object.keys(data.data).length > 0) {
          const noExistOu = data.data.noExistOu
          const noExistPrt = data.data.noExistPrt
          let msg = noExistOu ? `组织基础数据不存在:[${noExistOu}]` : ''
          msg = noExistPrt ? `${msg} 奖品信息不存在:[${noExistPrt}]` : ''
          msg = `${msg},已忽略导入！`
          message.warning(msg, 5)
        } else {
          message.success('导入成功')
        }
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

    showModal(state, action) {
      return { ...state, ...action.payload, modalVisible: true }
    },
  },
}
