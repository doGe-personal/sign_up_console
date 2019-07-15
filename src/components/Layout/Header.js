import React from 'react'
import PropTypes from 'prop-types'
import { Avatar, Dropdown, Icon, Layout, Menu, Popover } from 'antd'
import classnames from 'classnames'
import crypto from 'crypto'
import Identicon from 'identicon.js'
import styles from './Header.less'
import Menus from './Menu'
import { routerRedux } from 'dva/router'

const Header = ({ dispatch, user, logout, switchSider, siderFold, isNavbar, menuPopoverVisible, location, switchMenuPopover, navOpenKeys, changeOpenKeys, menu }) => {
  let handleClickMenu = e => {
    switch (e.key) {
      case 'profile':
        dispatch(routerRedux.push('/profile'))
        break
      case 'changePW':
        dispatch(routerRedux.push('/changePW'))
        break
      case 'manual':
        dispatch(routerRedux.push('/manual'))
        break
      case 'logout':
        logout()
        break
      default:
        break
    }
  }

  const hash = crypto.createHash('md5')
  hash.update(user.id + '')
  const imgData = new Identicon(hash.digest('hex'), { format: 'svg' }).toString()
  const imgUrl = 'data:image/svg+xml;base64,' + imgData

  const menusProps = {
    menu,
    siderFold: false,
    darkTheme: false,
    isNavbar,
    handleClickNavMenu: switchMenuPopover,
    location,
    navOpenKeys,
    changeOpenKeys,
  }

  const dropDownMenu = (
    <Menu onClick={handleClickMenu} className={styles.dropDownMenu}>
      {/*<SubMenu*/}
      {/*style={{*/}
      {/*float: 'right',*/}
      {/*}}*/}
      {/*title={<span>*/}
      {/*<Avatar src="https://git.elitescloud.com/uploads/-/system/user/avatar/61/avatar.jpg?width=400" />*/}
      {/*<span style={{ marginLeft: 10 }}>{user.userName}</span>*/}
      {/*</span>}*/}
      {/*>*/}
      {/*<Menu.Item key="profile">*/}
      {/*<Icon type="user" />*/}
      {/*<span>个人中心</span>*/}
      {/*</Menu.Item>*/}
      <Menu.Item key="changePW">
        <Icon type="user" />
        <span>修改密码</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <Icon type="logout" />
        <span>退出登录</span>
      </Menu.Item>
    </Menu>
  )

  return (
    <Layout.Header className={styles.header}>
      {isNavbar
        ? <Popover
          placement="bottomLeft"
          onVisibleChange={switchMenuPopover}
          visible={menuPopoverVisible}
          overlayClassName={styles.popovermenu}
          trigger="click"
          content={<Menus {...menusProps} />}>
          <div className={styles.button}>
            <Icon type="bars" />
          </div>
        </Popover>
        : <div
          className={styles.button}
          onClick={switchSider}
        >
          <Icon type={classnames({ 'menu-unfold': siderFold, 'menu-fold': !siderFold })} />
        </div>}
      <div className={styles.rightWarpper}>

        {/*<div className={styles.button}>*/}
        {/*<Badge count={2}>*/}
        {/*<Icon type="mail" />*/}
        {/*</Badge>*/}
        {/*</div>*/}

        {/*<div className={styles.button}>*/}
        {/*<Icon type="bell" />*/}
        {/*</div>*/}

        <Dropdown overlay={dropDownMenu} placement="bottomRight">
          <a>
            <Avatar src={imgUrl} />
            <span style={{ marginLeft: 10, fontSize: 14 }}>{user.username}</span>
          </a>

        </Dropdown>
      </div>
    </Layout.Header>
  )
}

Header.propTypes = {
  menu: PropTypes.array,
  user: PropTypes.object,
  logout: PropTypes.func,
  switchSider: PropTypes.func,
  siderFold: PropTypes.bool,
  isNavbar: PropTypes.bool,
  menuPopoverVisible: PropTypes.bool,
  location: PropTypes.object,
  switchMenuPopover: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
}

export default Header
