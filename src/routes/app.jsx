/* global window */
/* global document */
import React from 'react'
import NProgress from 'nprogress'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { ELLayout, Loader } from '@components'
import { BackTop, Layout } from 'antd'
import { classnames, config } from '@utils'
import { Helmet } from 'react-helmet'
import { withRouter } from 'dva/router'
import '../themes/index.less'
import './app.less'

const { Content, Footer, Sider } = Layout
const { Header, Bread, styles } = ELLayout
const { prefix, openPages } = config

let lastHref

const App = ({ children, dispatch, app, loading, location }) => {
  const { user, siderFold, darkTheme, isNavbar, menuPopoverVisible, navOpenKeys, menu } = app
  let { pathname } = location
  pathname = pathname.startsWith('/') ? pathname : `/${pathname}`
  const { iconFontJS, iconFontCSS, logo } = config
  const { href } = window.location
  console.log('user,menu',user,menu,(user.user && menu.length))
  if (lastHref !== href) {
    NProgress.start()
    if (!loading.global) {
      NProgress.done()
      lastHref = href
    }
  }

  const headerProps = {
    dispatch,
    menu,
    user,
    location,
    siderFold,
    isNavbar,
    menuPopoverVisible,
    navOpenKeys,
    switchMenuPopover() {
      dispatch({ type: 'app/switchMenuPopver' })
    },
    logout() {
      dispatch({ type: 'app/logout' })
    },
    switchSider() {
      dispatch({ type: 'app/switchSider' })
    },
    changeOpenKeys(openKeys) {
      dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
    },
  }

  const siderProps = {
    menu,
    location,
    siderFold,
    darkTheme,
    navOpenKeys,
    changeTheme() {
      dispatch({ type: 'app/switchTheme' })
    },
    changeOpenKeys(openKeys) {
      window.localStorage.setItem(`${prefix}navOpenKeys`, JSON.stringify(openKeys))
      dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
    },
  }

  const breadProps = {
    menu,
    location,
  }

  if (openPages && openPages.includes(pathname)) {
    return (<div>
      <Loader fullScreen spinning={loading.effects['app/query']} />
      {children}
    </div>)
  }

  return (
    <div>
      <Loader fullScreen spinning={loading.effects['app/query']} />
      <Helmet>
        <title>SignUp Program</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href={logo} type="image/x-icon" />
        {iconFontJS && <script src={iconFontJS} />}
        {iconFontCSS && <link rel="stylesheet" href={iconFontCSS} />}
      </Helmet>

      {user && menu.length &&
      <Layout className={classnames({ [styles.dark]: darkTheme, [styles.light]: !darkTheme })}>
        {!isNavbar && <Sider
          width={248}
          trigger={null}
          collapsible
          collapsed={siderFold}
        >
          {siderProps.menu.length === 0 ? null : <ELLayout.Sider {...siderProps} />}
        </Sider>}
        <Layout style={{ height: '100vh' }} id="centerContainer">
          <BackTop target={() => document.getElementById('centerContainer')} />
          <Header {...headerProps} />
          <Content>
            <Bread {...breadProps} />
            <div id="innerContainer">
              {children}
            </div>
          </Content>
          <Footer>
            {config.footerText}
          </Footer>
        </Layout>
      </Layout>}
    </div>
  )
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object,
}

export default withRouter(connect(({ app, loading }) => ({ app, loading }))(App))
