/*
 * String utility functions
 * */

// 连字符转驼峰
const hyphenToHump = () => {
  return this.replace(/-(\w)/g, (...args) => {
    return args[1].toUpperCase()
  })
}

// 驼峰转连字符
const humpToHyphen = () => {
  return this.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * @param   {String} name
 * @return  {String}
 */
const queryURL = (name) => {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r !== null) return decodeURI(r[2])
  return null
}

export default {
  hyphenToHump,
  humpToHyphen,
  queryURL,
}
