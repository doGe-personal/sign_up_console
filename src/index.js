import '@babel/polyfill'
import { message } from 'antd'
import dva from 'dva'
import createLoading from 'dva-loading'
import { createHashHistory } from 'history'
import appModal from './models/app'
import routers from './router'

message.config({
  top: 100,
  duration: 2,
})
// console.log(createLoading);
// console.log(createHistory);

// 1. Initialize
const app = dva({
  ...createLoading({
    // global: false,
    effects: true,
  }),
  history: createHashHistory(),
  onError(error) {
    message.error(error.data ? `${error.message} ${error.data.toString()}` : error.message, 5)
    console.error('[ERROR]', error)
  },
})

// 2. Plugins
// app.use({});
// 3. Model
app.model(appModal)

// 4. Router
app.router(routers)

// 5. Start
app.start('#root')
