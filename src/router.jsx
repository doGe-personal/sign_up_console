import React from 'react'
import { Redirect, Route, routerRedux, Switch } from 'dva/router'
import dynamic from 'dva/dynamic'
import { LocaleProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'

import App from './routes/app.jsx'
//
// dynamic.setDefaultLoadingComponent(() => {
//   return <div>Loading</div>
// })

const { ConnectedRouter } = routerRedux

const Routers = ({ history, app }) => {
  const error = dynamic({
    app,
    component: () => import('./routes/common/error'),
  })

  const routes = [
    {
      path: '/login',
      models: () => [import('./models/common/login')],
      component: () => import('./routes/common/login/'),
    },
    {
      path: '/600',
      component: () => import('./routes/common/error/600'),
    },
    {
      path: '/profile',
      component: () => import('./routes/common/profile'),
    },
    {
      path: '/settings',
      component: () => import('./routes/common/settings'),
    },
    {
      path: '/changePW',
      models: () => [import('./models/common/changePW')],
      component: () => import('./routes/common/settings/changePW'),
    },
    {
      path: '/manual',
      component: () => import('./routes/common/manual'),
    },
    {
      path: '/dashboard',
      models: () => [import('./models/dashboard')],
      component: () => import('./routes/dashboard/'),
    },
    {
      path: '/sys/users',
      models: () => [import('./models/sys/users')],
      component: () => import('./routes/sys/users'),
    },
    {
      path: '/sys/roles',
      models: () => [import('./models/sys/roles')],
      component: () => import('./routes/sys/roles'),
    },
    {
      path: '/sys/udcs',
      models: () => [import('./models/sys/udcs'), import('./models/sys/udcItems')],
      component: () => import('./routes/sys/udcs'),
    }, {
      path: '/sys/reclogs',
      models: () => [import('./models/sys/reclogs')],
      component: () => import('./routes/sys/reclogs'),
    },
  ]

  return (
    <ConnectedRouter history={history}>
      <LocaleProvider locale={zh_CN}>
        <App>
          <Switch>
            <Route exact={true} path="/" render={() => <Redirect to="/reg/customers" />} />
            {routes.map(({ path, ...dynamics }, key) => (
              <Route
                key={key}
                exact={true}
                path={path}
                component={dynamic({
                  app,
                  ...dynamics,
                })}
              />
            ))}
            <Route component={error} />
          </Switch>
        </App>
      </LocaleProvider>
    </ConnectedRouter>
  )
}

export default Routers
