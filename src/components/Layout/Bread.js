/* eslint no-restricted-globals: ["error", "event"] */

import React from 'react'
import PropTypes from 'prop-types'
import { Breadcrumb, Icon } from 'antd'
import { Link } from 'dva/router'
import pathToRegexp from 'path-to-regexp'
import { dataUtils, stringUtils } from '@utils'
import styles from './Layout.less'

const Bread = ({ menu }) => {
  // 匹配当前路由
  let pathArray = []
  let current
  for (let index in menu) {
    if (
      menu[index].menuType !== 'F' &&
      menu[index].menuUrl &&
      pathToRegexp(menu[index].menuUrl).exec(location.hash.replace('#', ''))
    ) {
      current = menu[index]
      break
    }
  }

  const getPathArray = item => {
    pathArray.unshift(item)
    if (item.upperId) {
      getPathArray(dataUtils.queryArray(menu, item.upperId, 'menuId'))
    }
  }

  if (!current) {
    pathArray.push(menu[0])
    pathArray.push({
      id: 404,
      name: 'Not Found',
    })
  } else {
    getPathArray(current)
  }

  // console.log(pathArray);
  // 递归查找父级
  const breads = pathArray.map((item, key) => {
    // console.log(item)
    if (item) {
      const content = extraInfo => (
        <span>
          {item.menuIcon ? <Icon type={item.menuIcon} style={{ marginRight: 4 }} /> : ''}
          {item.menuName} {extraInfo}
        </span>
      )

      let extraInfo = ''
      // console.log(stringUtils.queryURL('breadCode'))
      if (stringUtils.queryURL('breadCode')) {
        extraInfo += `(${stringUtils.queryURL('breadCode')}`
      }

      if (stringUtils.queryURL('breadOuName')) {
        extraInfo += ` - ${stringUtils.queryURL('breadOuName')})`
      }

      return (
        <Breadcrumb.Item key={key}>
          {pathArray.length - 1 !== key ? (
            item.menuUrl ? (
              <Link to={item.menuUrl}>{content('')}</Link>
            ) : (
              content('')
            )
          ) : (
            content(extraInfo)
          )}
        </Breadcrumb.Item>
      )
    }

    return 0
  })

  return (
    <div className={styles.bread}>
      <Breadcrumb>{breads}</Breadcrumb>
    </div>
  )
}

Bread.propTypes = {
  menu: PropTypes.array,
  location: PropTypes.object,
}

export default Bread
