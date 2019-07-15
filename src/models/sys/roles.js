import * as rolesService from '../../services/sys/roles'

export default {
  namespace: 'roles',
  state: {
    list: [],
    total: 0,
    currentItem: {},
    modalVisible: false,
    mode: 'create',
    filterParams: {},
    perms: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/sys/roles') {
          dispatch({ type: 'clean' })
          dispatch({ type: 'queryPerms' })
        }
      })
    },
  },

  effects: {
    * query({ payload }, { call, put, select }) {
      const { filterParams } = yield select(({ roles }) => roles)
      const data = yield call(rolesService.query, { ...filterParams, ...payload })
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data.rows,
            total: data.data.total,
            filterParams: { ...filterParams, ...payload },
          },
        })
        yield put({ type: 'queryPerms', payload })
      } else {
        throw data
      }
    },

    * queryPerms({ payload }, { call, put }) {
      const data = yield call(rolesService.queryPerms)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            perms: data.data,
          },
        })
      } else {
        throw data
      }
    },

    * querySingle({ payload }, { call, put }) {
      const data = yield call(rolesService.getSingle, payload.id)
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

    * getSingle({ payload }, { put }) {
      if (payload.mode === 'create') {
        yield put({
          type: 'showModal',
          payload: {
            currentItem: { perms: [] },
            mode: payload.mode,
          },
        })
      } else {
        yield put({ type: 'querySingle', payload })
      }
    },

    * create({ payload }, { call, put, select }) {
      const { perms } = yield select(({ roles }) => roles.currentItem)
      const data = yield call(rolesService.create, { ...payload, perms })
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * update({ payload }, { select, call, put }) {
      const { id, perms } = yield select(({ roles }) => roles.currentItem)
      const newData = { ...payload, id, perms }
      const data = yield call(rolesService.update, newData)
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
          perms: [],
        },
      })
    },

    * updatePerms({ payload }, { select, call, put }) {
      const currentItem = yield select(({ roles }) => roles.currentItem)
      currentItem.perms = payload
      yield put({
        type: 'updateState',
        payload: {
          currentItem,
        },
      })
    },

    * disable({ payload }, { call, put }) {
      const data = yield call(rolesService.disable, payload.id)
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * enable({ payload }, { call, put }) {
      const data = yield call(rolesService.enable, payload.id)
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
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
