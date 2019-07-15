import * as actsService from '../../services/act/acts'
import pathToRegexp from 'path-to-regexp'

export default {
  namespace: 'actsDetail',

  state: {
    list: [],
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
              },
            })
            return 0
          } else {
            dispatch({
              type: 'query',
              payload: match[1],
            })
          }
        }
      })
    },
  },

  effects: {
    * query({ payload }, { call, put }) {
      const data = yield call(actsService.queryItems, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            list: data.data,
          },
        })
      } else {
        throw data
      }
    },
    * uploadImg({ payload }, { call, put }) {
      const { fileData, row } = payload
      const data = yield call(actsService.uploadImg, fileData)
      if (data.success) {
        const newRow = Object.assign({}, row, { value: data.data })
        yield put({
          type: 'updateCell',
          payload: newRow,
        })
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
