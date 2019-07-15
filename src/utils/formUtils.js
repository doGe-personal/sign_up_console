import Schema from 'async-validator'
import { message } from 'antd'
import moment from 'moment'

/**
 * Check if a field is empty in a table
 * @param  {Array} table
 * @param  {Array} columns
 * @return {Boolean}
 */
const checkEmptyField = (table, columns) => {

  return table.some((l) => {
    return columns.some((col, index, array) => {
      if (col.required === true) {
        // console.log(l[col.dataIndex])
        return (l[col.dataIndex] === '' || l[col.dataIndex] === null || l[col.dataIndex] === undefined)
      }
      return 0
    })
  })
  // return true
}

/**
 * Get the status of readonly for a panel
 * @param  {Array}  panels
 * @param  {int}  panelId
 * @return {Boolean}
 */
const getPanelReadonly = (panels, panelId) => {
  // console.log(panels, panelId)
  if (panels !== undefined) {
    const target = panels.filter(p => p.id === panelId)
    if (target.length) {
      // console.log(target[0].readonly);
      return !!target[0].readonly
    }
    return true
  }
  return true
}

/**
 * Check if a field is unique in a table
 * @param table
 * @param fieldName
 * @param fieldValue
 * @returns {boolean}
 */
const checkUniqueField = (table, fieldName, fieldValue) => {
  if (!table) {
    return false
  }
  const common = table.filter((row) => {
    // console.log(row[fieldName])
    return row[fieldName] === fieldValue
  })
  // console.log(common.length)
  return common.length > 1
}

/**
 * Convert print data
 * @param {object} formData
 * @returns {object}
 */
const standardisePrintData = (formData) => {
  if (formData === undefined) {
    return {}
  }
  if (Object.keys(formData).length === 0) {
    return {}
  }
  const newFormData = Object.assign({}, formData)

  const keys = Object.keys(newFormData)

  keys.forEach((key) => {
    if (newFormData[key] === true) {
      newFormData[key] = '是'
    } else if (newFormData[key] === false) {
      newFormData[key] = '否'
    } else if (newFormData[key] && moment.isMoment(newFormData[key])) {
      newFormData[key] = moment(newFormData[key]).format('YYYY-MM-DD HH:mm:ss')
    } else if (newFormData[key] && (key.substr(key.length - 4, 4) === 'Date' || key.substr(key.length - 4, 4) === 'Time')) {
      newFormData[key] = moment(newFormData[key]).format('YYYY-MM-DD HH:mm:ss')
    } else if (typeof newFormData[key] === 'string') {
      newFormData[key] = newFormData[key].replace(/^\s+|\s+$/g, '') // 去首尾空格
    } else {
      return 0
    }

  })
  return newFormData
}

/**
 * Convert form data
 * @param {object} formData
 * @returns {object}
 */
const standardiseFormData = (formData) => {
  if (formData === undefined) {
    return {}
  }
  if (Object.keys(formData).length === 0) {
    return {}
  }
  const newFormData = Object.assign({}, formData)

  const keys = Object.keys(newFormData)

  keys.forEach((key) => {
    if (newFormData[key] === true) {
      newFormData[key] = 1
    } else if (newFormData[key] === false) {
      newFormData[key] = 0
    } else if (newFormData[key] && moment.isMoment(newFormData[key])) {
      newFormData[key] = moment(newFormData[key]).format('YYYY-MM-DDTHH:mm:ss')
    } else if (newFormData[key] && (key.substr(key.length - 4, 4) === 'Date' || key.substr(key.length - 4, 4) === 'Time')) {
      newFormData[key] = moment(newFormData[key]).format('YYYY-MM-DDTHH:mm:ss')
    } else if (typeof newFormData[key] === 'string') {
      newFormData[key] = newFormData[key].replace(/^\s+|\s+$/g, '') // 去首尾空格
    } else {
      return 0
    }
  })
  return newFormData
}

/**
 * Validate form data
 * @param {array} items
 * @param {object} formData
 * @param {function} cb
 * @param {function} handleErrors
 * @returns {boolean}
 */

const validateForm = (items, formData, cb, handleErrors) => {
  let descriptor = {}
  items.forEach((item) => {
    if (item.options && item.options.rules) {
      descriptor[item.dataIndex] = item.options.rules
    }
  })
  // console.log(descriptor)

  const validator = new Schema(descriptor)
  validator.validate(formData, (errors, fields) => {
    if (errors) {
      // console.log(errors);
      // validation failed, errors is an array of all errors
      // fields is an object keyed by field name with an array of
      // errors per field
      return handleErrors ?
        handleErrors(errors, fields) :
        message.error((`${items.filter(t => t.dataIndex === errors[0].field)[0].title} ${errors[0].message}`))
      // return errors
    }
    // validation passed
    cb()
  })
}

export default {
  getPanelReadonly,
  checkEmptyField,
  checkUniqueField,
  standardisePrintData,
  standardiseFormData,
  validateForm,
}
