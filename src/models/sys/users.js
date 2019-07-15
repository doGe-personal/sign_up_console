import * as usersService from '../../services/sys/users'
import { message } from 'antd'

export default {
  namespace: 'users',
  state: {
    list: [],
    total: 0,
    currentItem: {},
    modalVisible: false,
    mode: 'create',
    filterParams: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/sys/users') {
          //dispatch({ type: 'clean' });
          //dispatch({ type: 'query' });
        }
      })
    },
  },

  effects: {
    * query({ payload }, { call, put, select }) {
      const { filterParams } = yield select(({ users }) => users)
      const data = yield call(usersService.query, { ...filterParams, ...payload })
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
      const data = yield call(usersService.getSingle, payload.id)
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
            mode: payload.mode,
          },
        })
      } else {
        yield put({ type: 'querySingle', payload: payload })
      }
    },

    * create({ payload }, { call, put, select }) {
      const { roles } = payload
      if (roles) {
        payload.roles = Array.from(roles)
      }
      const data = yield call(usersService.create, { ...payload })
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * update({ payload }, { select, call, put }) {
      const id = yield select(({ users }) => users.currentItem.id)
      const newData = { ...payload, id }
      const data = yield call(usersService.update, newData)
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
        },
      })
    },

    * disable({ payload }, { call, put }) {
      const data = yield call(usersService.disable, payload.id)
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * enable({ payload }, { call, put }) {
      const data = yield call(usersService.enable, payload.id)
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * resetPW({ payload }, { put, call }) {
      const data = yield call(usersService.reSetPW, payload.id)
      if (data.success) {
        message.success('操作成功')
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
