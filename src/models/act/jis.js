/* eslint-disable no-unused-vars */
import * as jisService from '../../services/act/jis'
import { message } from 'antd'

export default {
  namespace: 'jis',
  state: {
    list: [],
    total: 0,
    approvalOps: [],
    ouType: 1,
    currItem: {},
    viewModalVisble: false,
    confirmModalVisble: false,
    noPassList: [],
    expandedRowKeys: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/act/maintains') {
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
      const data = yield call(jisService.query, payload)
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

    * onCloseExpand({ payload }, { call, put,select }) {
      const expandedRowKeys = yield select(({ jis }) => jis.expandedRowKeys)
      const newKeys = expandedRowKeys.filter(item => item !== payload)
      yield put({
        type: 'updateState',
        payload: {
          expandedRowKeys: newKeys,
        },
      })
    },
    * onExpand({ payload }, { call, put,select }) {
      const expandedRowKeys = yield select(({ jis }) => jis.expandedRowKeys)
      if(!expandedRowKeys.includes(payload)) {
        expandedRowKeys.push(payload)
      }
      yield put({
        type: 'updateState',
        payload: {
          expandedRowKeys: expandedRowKeys,
        },
      })
      const data = yield call(jisService.getDetails, payload)
      if (data.success) {
        yield put({
          type: 'updateChildren',
          payload: { children: data.data, pid: payload },
        })
      } else {
        throw data
      }
    },

    * togglePop({ payload }, { select, put }) {
      const list = yield select(({ jis }) => jis.list)
      list.forEach(element => {
        if (element.id === payload.id) {
          element.confirmVisable = !element.confirmVisable
        }
      })
      yield put({
        type: 'updateState',
        payload: {
          list: list,
        },
      })
    },
    * togglePopByKey({ payload }, { select, put }) {
      const list = yield select(({ jis }) => jis.list)
      list.forEach(element => {
        if (element.id === payload) {
          element.confirmVisable = !element.confirmVisable
        }
      })
      yield put({
        type: 'updateState',
        payload: {
          list: list,
        },
      })
      yield put({
        type: 'onCloseExpand',
        payload: payload,
      })
    },

    * onInputChange({ payload }, { select, put }) {
      let newOps = []
      const approvalOps = yield select(({ jis }) => jis.approvalOps)
      if (approvalOps.length < 1) {
        approvalOps.push(payload)
        newOps = approvalOps
      } else {
        newOps = approvalOps.filter(e => e.key !== payload.key)
        newOps.push(payload)
      }
      yield put({
        type: 'updateState',
        payload: {
          approvalOps: newOps,
        },
      })
    },

    * onReject({ payload }, { select, put, call }) {
      const approvalOps = yield select(({ jis }) => jis.approvalOps)
      const approvals = approvalOps.filter(e => e.key === payload)
      let checkMsg
      if (approvals.length > 0) {
        checkMsg = approvals[0].value
      }
      if (!checkMsg) {
        message.warning('请输入审批意见！')
        return
      }
      const data = yield call(jisService.exchangeStatus, {
        id: payload,
        checkMsg: checkMsg,
        checkStatus: 3,
      })
      if (data.success) {
        yield put({
          type: 'query',
        })
        yield put({
          type: 'togglePopByKey',
          payload: payload,
        })
      } else {
        throw data
      }
    },
    * onPass({ payload }, { select, put, call }) {
      const approvalOps = yield select(({ jis }) => jis.approvalOps)
      const approvals = approvalOps.filter(e => e.key === payload)
      let checkMsg
      if (approvals.length > 0) {
        checkMsg = approvals[0].value
      }
      const data = yield call(jisService.exchangeStatus, {
        id: payload,
        checkMsg: checkMsg,
        checkStatus: 2,
      })
      if (data.success) {
        yield put({
          type: 'query',
        })
        yield put({
          type: 'togglePopByKey',
          payload: payload,
        })
        message.success('审批成功！')
      } else {
        throw data
      }
    },
    * hideViewModal({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          viewModalVisble: false,
          currItem: {},
        },
      })
    },

    * patchExamine({ payload }, { put, select, call }) {
      const data = yield call(jisService.patchExamine, payload)
      if (data.success) {
        const result = data.data
        if (Object.keys(result).length > 0) {
          const list = yield select(({ jis }) => jis.list)
          let noPassList = []
          for (let key of Object.keys(result)) {
            list.filter(i => i.id == key).forEach(item => {
              item.noPassReason = result[key]
              noPassList.push(item)
            })
          }
          yield put({
            type: 'updateState',
            payload: {
              confirmModalVisble: true,
              noPassList: noPassList,
            },
          })
        } else {
          message.success('审批成功!')
          yield put({
            type: 'query',
          })
        }
      } else {
        throw data
      }
    },
    * hideConfirmModal({ payload }, { put, select, call }) {
      yield put({
        type: 'updateState',
        payload: {
          confirmModalVisble: false,
          noPassList: [],
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

    updateChildren(state, { payload }) {
      const { children, pid } = payload

      const newList = state.list.slice()
      newList.forEach((item, index) => {
        if (item.id === pid) {
          newList[index] = Object.assign({}, { itemList: children }, item)
        }
      })

      return {
        ...state,
        list: newList,
      }
    },

    showViewModal(state, action) {
      return { ...state, currItem: action.payload, viewModalVisble: true }
    },
  },
}
