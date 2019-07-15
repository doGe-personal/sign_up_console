import * as customerService from '../../services/base/custs'
import { message } from 'antd'
import dataUtils from '../../utils/dataUtils'

export default {
  namespace: 'custs',
  state: {
    list: [],
    total: 0,
    currentItem: {},
    modalVisible: false,
    mode: 'create',
    qualifyVlsible: false,
    qualifyModal: 'view',
    qualify: {},
    editQulVisble: true,
    viewModalVisble: false,
    filterData: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === 'reg/custs') {
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
      const data = yield call(customerService.query, payload)
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
      const data = yield call(customerService.getSingle, payload.id)
      if (data.success) {
        if (payload.mode === 'update' || payload.mode === 'view') {
          const currentItem = data.data
          if (currentItem.licenseId) {
            const data = yield call(customerService.fetchQualifyImg, currentItem.qualifyPath)
            if (data.success) {
              currentItem.licenseImgStr = `data:image/jpg;base64,${data.data}`
              yield put({
                type: 'showModal',
                payload: {
                  currentItem: currentItem,
                  mode: payload.mode,
                },
              })
            }
          } else {
            yield put({
              type: 'showModal',
              payload: {
                currentItem: data.data,
                mode: payload.mode,
              },
            })
          }
        }
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

    * delete({ payload }, { call, put }) {
      const data = yield call(customerService.remove, [...payload.ids])
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * create({ payload }, { call, put }) {
      const data = yield call(customerService.update, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        message.success('保存成功！')
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
    * update({ payload }, { call, put, select }) {
      const currentItem = yield select(({ custs }) => custs.currentItem)
      const newCurrItem = Object.assign({}, {
        qualifyPath: currentItem.qualifyPath,
        custCode: currentItem.custCode,
        id: currentItem.id,
      }, payload)
      const data = yield call(customerService.update, newCurrItem)
      if (data.success) {
        yield put({ type: 'hideModal' })
        message.success('保存成功！')
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
    * exchangStatus({ payload }, { call, put }) {
      payload.enableFlag = (~payload.enableFlag) + 2
      const data = yield call(customerService.exchangStatus, payload)
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * callQualifyModal({ payload }, { call, put, all }) {
      const { qualifyPath, licenseId } = payload
      if (qualifyPath && licenseId) {
        const [imgData, qualify] = yield all([
          call(customerService.fetchQualifyImg, payload.qualifyPath),
          call(customerService.fetchQualify, payload.licenseId),
        ])
        if (imgData.success && qualify.success) {
          const newQualify = Object.assign({}, { imageStr: imgData.data }, qualify.data)
          yield put({
            type: 'updateState',
            payload: {
              qualifyVlsible: true,
              qualify: newQualify,
            },
          })
        }

      } else {
        yield put({
          type: 'updateState',
          payload: {
            qualifyVlsible: true,
          },
        })
      }
    },
    * handleShowImg({ payload }, { put, select, call }) {
      const currentItem = yield select(({ custs }) => custs.currentItem)
      const newCurrItem = Object.assign({}, currentItem, { licenseImgStr: payload })
      yield put({
        type: 'updateState',
        payload: {
          currentItem: newCurrItem,
        },
      })
    },
    * uploadQualify({ payload }, { put, select, call }) {
      const data = yield call(customerService.uploadQualify, payload)
      const currentItem = yield select(({ custs }) => custs.currentItem)
      const newCurrItem = Object.assign({}, currentItem, { qualifyPath: data.data })
      yield put({
        type: 'updateState',
        payload: {
          currentItem: newCurrItem,
        },
      })
    },

    * onEdit({ payload }, { put, select, all }) {
      const editQulVisble = yield select(({ custs }) => custs.editQulVisble)
      yield put({
        type: 'updateState',
        payload: {
          editQulVisble: !editQulVisble,
        },
      })
    },

    * qualifyUpdate({ payload }, { put, select, call }) {
      const qualify = yield select(({ custs }) => custs.qualify)
      const newQualify = Object.assign({}, { id: qualify.id }, payload)
      const data = yield call(customerService.qualifyUpdate, newQualify)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            qualifyVlsible: false,
            qualify: {},
            editQulVisble: true,
          },
        })
        message.success('保存成功!')
        yield put({ type: 'query' })
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
          qualifyVlsible: false,
          currentItem: {},
        },
      })
    },

    * hideViewModal({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          viewModalVisble: false,
        },
      })
    },

    * exportFile({ payload }, { call, put, select }) {
      const filterData = yield select(({ custs }) => custs.filterData)
      const data = yield call(customerService.exportFile, filterData)
      if (data.success) {
        dataUtils.downloadBase64(data.data, '消费者信息.xlsx')
      } else {
        throw data
      }
    },
    * onFilterChange({ payload }, { select, put }) {
      const filterData = yield select(({ custs }) => custs.filterData)
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

    showViewModal(state, action) {
      return { ...state, ...action.payload, viewModalVisble: true }
    },
  },
}
