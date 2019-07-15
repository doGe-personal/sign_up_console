import React from 'react'
import { Icon } from 'antd'
import * as styles from './600.less'
import { config } from '../../../utils'

const { footerText } = config

const handleReload = () => {
  window.location.href = '/login'
}

const Error600 = () => {
  return (<div>
    <div className={styles.error}>
      <Icon type="wifi" />
      <h1>600 Network Error</h1>
      <br />
      <h2>网络错误，请检查服务端</h2>
      <br />
      <br />
      <br />
      <div className={styles.reload} onClick={handleReload}>
        <Icon type="reload"><p style={{ marginTop: 10, fontSize: 20 }}>刷新</p></Icon>
      </div>
    </div>
    <div className={styles.footer}>
      {footerText}
    </div>
  </div>)
}

export default Error600
