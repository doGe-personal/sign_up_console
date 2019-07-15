/* global window */
/* global document */
/* global location */
/* eslint no-restricted-globals: ["error", "event"] */

import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { config, networkUtils } from '@utils/'
import { getPrincipal, logout, queryMenu } from '../services/app'

const { prefix } = config

export default {
  namespace: 'app',
  state: {
    user: {},
    menu: [],
    menuPopoverVisible: false,
    siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: true,
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    locationPathname: '',
    locationQuery: {},
  },
  subscriptions: {
    setupHistory({ dispatch, history }) {
      history.listen(location => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.hash.slice(1),
            locationQuery: location.query,
          },
        })
      })
    },

    setup({ dispatch }) {
      networkUtils
        .csrf()
        .then(() => {
          if (window.location.hash.slice(1) === '/forgetPW' || window.location.hash.slice(1) === '/login') {
            console.log('Dont enter app')
          } else {
            dispatch({ type: 'query' })
          }
        })
        .catch(error => {
          dispatch(routerRedux.push('/600'))
        })

      // if (window.location.pathname === '/forgetPW' || window.location.pathname === '/login') {
      //   console.log('Dont enter app')
      // } else {
      //   dispatch({ type: 'query' })
      // }

      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
        }, 300)
      }
    },
  },
  effects: {
    * query({ payload }, { call, put, select }) {
      const { success, data } = yield call(getPrincipal, parse(payload))
      const { locationPathname } = yield select(_ => _.app)
      if (success && data) {
        const menu = yield call(queryMenu, parse(payload))
        yield put({
          type: 'updateState',
          payload: { user: data, menu: menu.data },
        })
        if (location.pathname === '/login') {
          yield put(
            routerRedux.push({
              pathname: '/dashboard"',
            }),
          )
        }
      } else if (config.openPages && config.openPages.indexOf(locationPathname) < 0) {
        yield put(
          routerRedux.push({
            pathname: '/login',
          }),
        )
      }
    },

    * logout({ payload }, { call, put }) {
      const data = yield call(logout, payload)
      if (data.success) {
        yield put(
          routerRedux.push({
            pathname: '/login',
          }),
        )
        sessionStorage.clear()
      } else {
        throw data
      }
    },

    * changeNavbar(action, { put, select }) {
      const { app } = yield select(_ => _)
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
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

    switchSider(state) {
      window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme(state) {
      window.localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver(state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar(state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys(state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },
  },
}
