import { clone } from 'ramda'
import moment from 'moment'
import Base64 from 'base64-js'

// string -> date
const s2m = input => moment(input)
const s2d = input => moment(input).toDate()
const ymd = input => moment(input).format('YYYY-MM-DD')
const dtm = input => moment(input).format('YYYY-MM-DD HH:mm:ss')

/**
 * Get a random floating point number between `min` and `max`.
 *
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {float} a random floating point number
 */
const getRandom = (min, max) => {
  return Math.random() * (max - min) + min
}

/**
 * Get a random integer between `min` and `max`.
 *
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {int} a random integer
 */
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  const item = array.filter(_ => _[keyAlias] === key)
  if (item.length) {
    return item[0]
  }
  return null
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {

  let data = clone(array)
  let result = []
  let hash = {}
  data.forEach((item, index) => {
    hash[data[index][id]] = data[index]
  })

  data.forEach((item) => {
    let hashVP = hash[item[pid]]
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = [])
      hashVP[children].push(item)
    } else {
      result.push(item)
    }
  })
  return result
}

/**
 * Convert amount to RMB
 * @param   {float}    n
 * @return  {String}
 */
const moneyToRMB = (n) => {
  typeof n === 'string' && (n = parseFloat(n))
  if (n === 0 || n === undefined) {
    return '零圆'
  }
  const fraction = ['角', '分']
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const unit = [['圆', '万', '亿'], ['', '拾', '佰', '仟']]
  const head = n < 0 ? '欠' : ''
  n = Math.abs(n)
  let s = ''
  for (let i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
  }
  s = s || '整'
  n = Math.floor(n)
  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = ''
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p
      n = Math.floor(n / 10)
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
  }
  return head + s.replace(/(零.)*零圆/, '圆').replace(/(零.)+/g, '零').replace(/^整$/, '零圆整')
}

const toUppercaseDigit = (num) => {
  if (isNaN(num)) {
    return '无效数值！'
  }
  let strPrefix = ''
  if (num < 0) {
    strPrefix = '(欠)人民币'
  }
  num = Math.abs(num)
  if (num >= 1000000000000) {
    return '[超出最大数值]'
  }
  let strOutput = ''
  let strUnit = '仟佰拾亿仟佰拾万仟佰拾圆角分'
  let strCapDgt = '零壹贰叁肆伍陆柒捌玖'
  num += '00'
  let intPos = num.indexOf('.')
  if (intPos >= 0) {
    num = num.substring(0, intPos) + num.substr(intPos + 1, 2)
  }
  strUnit = strUnit.substr(strUnit.length - num.length)
  for (var i = 0; i < num.length; i++) {
    strOutput += strCapDgt.substr(num.substr(i, 1), 1) + strUnit.substr(i, 1)
  }
  return strPrefix + strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+圆/, '圆').replace(/亿零{0,3}万/, '亿').replace(/^圆/, '零圆')
}

/**
 * Convert queryString to object
 * @param   {String}    qs
 * @return  {Object}
 */
const queryStringToJSON = (qs) => {
  const pairs = qs.slice(1).split('&')

  let result = {}
  pairs.forEach((pair) => {
    pair = pair.split('=')
    result[pair[0]] = decodeURIComponent(pair[1] || '')
  })

  return JSON.parse(JSON.stringify(result))
}

const validAmtFormat = (n) => {
  let amt = 0

  if (n === null || n === undefined) {
    return false
  }

  if (typeof n === 'string') {
    if (!(/^-?\d*(\.\d+)?$/.test(n))) {  // check float
      return false
    } else {
      amt = parseFloat(n)
    }
  } else {
    amt = n
  }

  const patt = /^\s*-?\d+(\.\d{1,2})?\s*$/

  if (!patt.test(amt)) {  // check tow decimal
    return false
  }
  return true
}

const limitDecimals = value => {
  const reg = /^(-)*(d+).(dd).*$/
  if (typeof value === 'string') {
    return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
  } else if (typeof value === 'number') {
    return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
  } else {
    return ''
  }
}

const updateTree = (tree, keyToFind, valueToFind, keyToUpdate, valueToUpdate) => {
  // console.log(tree, keyToFind, valueToFind, keyToUpdate, valueToUpdate)
  // console.log(tree[keyToFind], valueToFind)
  tree.forEach((t) => {
    if (t[keyToFind] === valueToFind) {
      t[keyToUpdate] = valueToUpdate
    }
    if (t.children && t.children.length) {
      return updateTree(t.children, keyToFind, valueToFind, keyToUpdate, valueToUpdate)
    } else {
      return t
    }
  })
  return tree
}

const downloadBase64 = (data, filename) => {
  const blob = new Blob([Base64.toByteArray(data)])
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, filename)
  } else {
    const a = document.createElement('a')
    a.style.display = 'none'
    document.body.appendChild(a)
    const url = window.URL.createObjectURL(blob)
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }
}

export default {
  downloadBase64,
  s2m,
  s2d,
  ymd,
  dtm,
  updateTree,
  toUppercaseDigit,
  getRandom,
  getRandomInt,
  queryArray,
  arrayToTree,
  moneyToRMB,
  queryStringToJSON,
  validAmtFormat,
  limitDecimals,
}
