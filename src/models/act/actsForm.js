import moment from 'moment'
import * as actsService from '../../services/act/acts'
import { routerRedux } from 'dva/router'
import pathToRegexp from 'path-to-regexp'
import { Modal } from 'antd'

const confirm = Modal.confirm

export default {
  namespace: 'actsForm',
  state: {
    formData: {},
    mode: 'create',
    coverImgUploading: false,
    iconImgUploading: false,
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
                formData: {},
                mode: match[1],
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

    * query({ payload }, { select, put, call }) {
      const data = yield call(actsService.getSingle, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            formData: data.data,
          },
        })
      } else {
        throw data
      }
    },

    * handleChangeField({ payload }, { select, put }) {
      const formData = yield select(({ actsForm }) => actsForm.formData)
      const newData = Object.assign({}, formData, payload)
      if (newData && newData.actTime) {
        newData.beginTime = moment(newData.actTime[0]).format('YYYY-MM-DD')
        newData.endTime = moment(newData.actTime[1]).format('YYYY-MM-DD')
      }
      yield put({
        type: 'updateState',
        payload: { formData: newData },
      })
    },
    * uploadCoverImg({ payload }, { select, put, call }) {
      yield put({
        type: 'updateState',
        payload: { coverImgUploading: true },
      })
      const data = yield call(actsService.uploadImg, payload)
      if (data.success) {
        console.log(data.data)
        const formData = yield select(({ actsForm }) => actsForm.formData)
        const newData = Object.assign({}, formData, { coverImg: data.data })
        yield put({
          type: 'updateState',
          payload: { formData: newData, coverImgUploading: false },
        })
      } else {
        throw data
      }
    },
    * uploadIconImg({ payload }, { select, put, call }) {
      yield put({
        type: 'updateState',
        payload: { iconImgUploading: true },
      })
      const data = yield call(actsService.uploadImg, payload)
      if (data.success) {
        console.log(data.data)
        const formData = yield select(({ actsForm }) => actsForm.formData)
        const newData = Object.assign({}, formData, { iconImg: data.data })
        yield put({
          type: 'updateState',
          payload: { formData: newData, iconImgUploading: false },
        })
      } else {
        throw data
      }
    },
    * handleGoBack({ payload }, { select, put, call }) {
      yield put(routerRedux.push(`/act/maintains`))
      yield put({
        type: 'updateState',
        payload: {
          formData: {},
          coverImgUploading: false,
          iconImgUploading: false,
        },
      })
    },
    * save({ payload }, { call, put, select }) {
      const formData = yield select(({ actsForm }) => actsForm.formData)
      const actDetails = yield select(({ actsDetail }) => actsDetail.list)
      const actItems = yield select(({ actsItems }) => actsItems.actItems)
      const actRules = yield select(({ actsRules }) => actsRules.list)
      const actLimits = yield select(({ actsLimits }) => actsLimits.list)
      formData.actDetails = actDetails
      formData.actItemEntities = actItems
      formData.actRuleEntities = actRules
      formData.actLimitEntities = actLimits
      const data = yield call(actsService.update, formData)
      const dispatch = payload
      if (data.success) {
        formData.id = data.data
        yield put({
          type: 'updateState',
          payload: {
            formData: formData,
          },
        })
        confirm({
          title: '温馨提示',
          content: `保存成功,是否返回列表?`,
          onOk() {
            dispatch({
              type: 'actsForm/handleGoBack',
            })
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

  },
}
