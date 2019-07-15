export default {
  namespace: 'dashboard',

  state: {},

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      dispatch({ type: 'query' })
    },
  },

  effects: {
    *query({ payload }, { call, put }) {  // eslint-disable-line

    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload }
    },
  },

}
