const color = {
  green: '#64ea91',
  blue: '#8fc9fb',
  purple: '#d897eb',
  red: '#f69899',
  yellow: '#f8c82e',
  peach: '#f797d6',
  borderBase: '#e5e5e5',
  borderSplit: '#f4f4f4',
  grass: '#d6fbb5',
  sky: '#c1e0fc',
}

/*
 * Logging utility functions
 * */
const not_test_mode = process.env.NODE_ENV !== 'test'

const normal = [`background: ${color.blue}`, 'color: black', 'display: block', 'text-align: center'].join(';')

const ok = [`background: ${color.green}`, 'color: black', 'display: block', 'text-align: center'].join(';')

const warning = [`background: ${color.yellow}`, 'color: black', 'display: block', 'text-align: center'].join(';')

const failure = [`background: ${color.red}`, 'color: black', 'display: block', 'text-align: center'].join(';')

const ajax = [`background: ${color.purple}`, 'color: black', 'display: block', 'text-align: center'].join(';')

const info = (msg, msg2) => {
  // tslint:disable-next-line:no-console
  not_test_mode && console.log(`%c${msg} ${msg2 ? '%O' : ''}`, normal, msg2 || '')
}

const success = (msg, msg2) => {
  // tslint:disable-next-line:no-console
  not_test_mode && console.log(`%c${msg} ${msg2 ? '%O' : ''}`, ok, msg2 || '')
}

const warn = (msg, msg2) => {
  // tslint:disable-next-line:no-console
  not_test_mode && console.log(`%c${msg} ${msg2 ? '%O' : ''}`, warning, msg2 || '')
}

const error = (msg, msg2) => {
  // tslint:disable-next-line:no-console
  not_test_mode && console.log(`%c${msg} ${msg2 ? '%O' : ''}`, failure, msg2 || '')
}

const network = (msg, msg2) => {
  // tslint:disable-next-line:no-console
  not_test_mode && console.log(`%c${msg} ${msg2 ? '%O' : ''}`, ajax, msg2 || '')
}

export default {
  info,
  success,
  warn,
  error,
  network,
}
