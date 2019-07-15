import * as udcsService from '../../services/sys/udcs'

export default {
  namespace: 'udcItems',

  state: {
    list: [],
  },

  subscriptions: {},

  effects: {
    * query({ payload }, { call, put }) {
      const data = yield call(udcsService.queryItems, payload)
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
