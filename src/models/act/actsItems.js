import * as itemsService from '../../services/base/items'
import * as actsService from '../../services/act/acts'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'

export default {
  namespace: 'actsItems',
  state: {
    list: [],
    total: 0,
    itemModalVisable: false,
    icodeModalVisable: false,
    selectedRows: [],
    selectedRowKeys: [],
    actItems: [],
    actSelectKeys: [],
    iCodeInput: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const match = pathToRegexp('/act/maintains/:id').exec(location.pathname)
        if (match) {
          if (match[1] === 'create') {
            dispatch({
              type: 'updateState',
              payload: {
                list: [],
                total: 0,
                itemModalVisable: false,
                icodeModalVisable: false,
                selectedRows: [],
                selectedRowKeys: [],
                actItems: [],
                actSelectKeys: [],
                iCodeInput: '',
              },
            })
            return 0
          } else {
            dispatch({
              type: 'queryByActId',
              payload: match[1],
            })
          }
        }
      })
    },
  },

  effects: {
    * query({ payload }, { call, put, select }) {
      const data = yield call(itemsService.query, { ...payload })
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data.rows,
            total: data.data.total,
            actItems: data.data.rows,
            actSelectKeys: data.data.rows.map(e => e.id),
          },
        })
      } else {
        throw data
      }
    },
    * queryByActId({ payload }, { call, put, select }) {
      const data = yield call(actsService.queryByActId, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            actItems: data.data,
          },
        })
      } else {
        throw data
      }
    },
    * hideModal({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          icodeModalVisable: false,
        },
      })
    },

    * handleConfirm({ payload }, { select, put }) {
      const { selectedRows, actItems, selectedRowKeys, actSelectKeys } = yield select(({ actsItems }) => actsItems)
      let finalArr = []
      let finalSelectKeys = actSelectKeys
      if (selectedRows.length > 0) {
        let result = {}
        const newActItems = actItems.concat(selectedRows)
        // 对象键key唯一特性
        for (let i = 0; i < newActItems.length; i++) {
          result[newActItems[i].itemCode] = newActItems[i]
        }
        for (let index in result) {
          finalArr.push(result[index])
        }
        finalSelectKeys = Array.from(new Set(actSelectKeys.concat(selectedRowKeys)))
      }
      yield put({
        type: 'updateState',
        payload: {
          actItems: finalArr,
          itemModalVisable: false,
          actSelectKeys: finalSelectKeys,
        },
      })
    },
    * handleIcodeConfirm({ payload }, { select, put, call }) {
      const pattern = /^([\u0391-\uFFE5\d\w,])*([\u0391-\uFFE5\d\w]+)$/
      // const { iCodeInput, actSelectKeys, actItems } = yield select(({ actsItems }) => actsItems)
      const { iCodeInput } = yield select(({ actsItems }) => actsItems)
      if (pattern.test(iCodeInput)) {
        const data = yield call(itemsService.getItemByCode, iCodeInput.split(','))
        if (data.success) {
          // let finalArr = []
          let finalSelectKeys = []
          // if (data.data.length > 0) {
          // let result = {}
          // const newActItems = actItems.concat(data.data)
          // 对象键key唯一特性
          // for (let i = 0; i < newActItems.length; i++) {
          //   result[newActItems[i].itemCode] = newActItems[i]
          // }
          // for (let index in result) {
          //   finalArr.push(result[index])
          // }
          const selectedRowKeys = data.data.map((e) => e.id)
          // finalSelectKeys = Array.from(new Set(actSelectKeys.concat(selectedRowKeys)))
          finalSelectKeys = Array.from(new Set(selectedRowKeys))
          yield put({
            type: 'updateState',
            payload: {
              // actItems: finalArr,
              actItems: data.data,
              actSelectKeys: finalSelectKeys,
            },
          })
          // }
          yield put({
            type: 'hideModal',
          })
        } else {
          throw data
        }
      } else {
        message.warning('编码录入格式错误！请勿包含中文逗号或其他非法字符', 3)
      }
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    querySuccess(state, action) {
      const { list, total } = action.payload
      return {
        ...state,
        list,
        total,
      }
    },
    showModal(state, action) {
      return { ...state, ...action.payload, icodeModalVisable: true }
    },

    deleteRow(state, { payload }) {
      let { actItems } = state
      const newList = actItems.slice().filter(item => item.id !== payload)
      return {
        ...state,
        actItems: newList,
      }
    },
    handleInputNu(state, { payload }) {
      return {
        ...state,
        iCodeInput: payload,
      }
    },
  },
}
