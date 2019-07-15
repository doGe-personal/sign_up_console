import * as jdcardsService from '../../services/base/jdcards'
import { Modal } from 'antd'

const warning = Modal.warning
const info = Modal.info

export default {
  namespace: 'jdcards',
  state: {
    list: [],
  },

  effects: {
    * query({ payload }, { call, put, select }) {
      const data = yield call(jdcardsService.query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
          },
        })
      } else {
        throw data
      }
    },
    * handleUpload({ payload }, { call, put, select }) {
      const data = yield call(jdcardsService.patchImport, payload)
      if (data.success) {
        const saveNum = data.data.saveNum
        const failureArr = data.data.failureArr
        let errCode = ''
        if (failureArr && failureArr.length > 0) {
          errCode = failureArr.map((jdcard) => {
            return jdcard.jdcCode
          })
        }
        if (errCode) {
          errCode = `已过滤重复的京东卡的卡号: ${errCode.join(', ')}`
        }
        info({
          title: '温馨提示',
          content: `成功保存${saveNum}条京东购物卡! ${errCode}`,
          onOk() {
          },
        })
        yield put({
          type: 'prts/query',
        })
      } else {
        // throw data
        warning({
          title: '温馨提示',
          content: data.data,
          destroyOnClose: true,
        })
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

    addRow(state, { payload }) {
      const { list } = state
      const newList = list.slice()
      newList.push(payload)
      return {
        ...state,
        list: newList,
      }
    },

    updateCell(state, { payload }) {
      const { list } = state
      const newList = list.slice()
      const { key, index, value } = payload
      newList[index][key] = value
      return {
        ...state,
        list: newList,
      }
    },

    deleteRow(state, { payload }) {
      let { list } = state
      const newList = list.slice().filter(item => item.id !== payload)
      return {
        ...state,
        list: newList,
      }
    },
  },
}
