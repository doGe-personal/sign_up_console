export default {
  apiPrefix: '/api',
  basic: {
    // 基本接口
    csrf: '/sec/xsrf', // CSRF检查
    socket: '/ws',
    userLogin: '/sec/login', // 登录
    userLogout: '/sec/logout', // 退出
    captcha: '/sec/captcha', // 验证码
    principal: '/sec/principal', // 登录用户上下文
    changePW: '/edp/pwd/change', // 修改自己密码
    resetPW: '/password/reset', // 重置密码
    changeInfo: '/api/ui/employee', // 修改个人信息
    register: '/register/supplier',
    queryUDC: '/register/{udc}/items', // 查询某项UDC
  },
  app: {
    // app全局接口
    menus: '/api/menus', //'/api/ui/menus'
    items: '/api/items', // GET
  },
  common: {
    udc: {
      query: '/edp/udcs/{udc}/items', // 查询某项UDC
    },
    suggest: {
      roles: '/edp/iam/user/roles',
      ous: '/edp/iam/ous',
      orgs: '/base/api/ous/suggest',
      presents: '/base/api/prts/suggest',
    },
    qualify: '/api/common/qualify',
  },
  reg: {
    clerks: 'api/reg/clerks',
    stores: 'api/reg/stores',
  },
  base: {
    ous: 'base/api/ous',
    custs: 'base/api/custs',
    agents: 'base/api/agents',
    addrqs: '/base/api/addrqs',
    prts: '/base/api/prts',
    jdcards: '/base/api/jdcs',
    items: '/base/api/items',
  },
  act: {
    acts: '/cp/api/acts',
    actdets: '/cp/api/ads/actId',
    ais: '/cp/api/ais',
    ars: '/cp/api/ars',
    als: '/cp/api/als',
    jis: '/cp/api/jis',
    jids: '/cp/api/jids',
  },
  rep: {
    actparts: '/cp/api/actparts',
  },
  ei: {
    uploadSingle: 'ei/api/fm/repos/{repoId}/store', // 单个文件上传
    qualifyDownLoad: 'ei/api/fm/repos/files/qualify', // 证照下载
    download: 'ei/api/fm/repos/{repoId}/bytes/{file}',
    streamDownload: 'ei/api/fm/repos/files/{file}',
    imgDownload: 'ei/api/fm/repos/stream/{file}',
  },
  mdata: {},
  fm: {
    upload: '/edp/fm/repos/{repoId}/nstore', // 文件上传（多个）
    uploadSingle: '/api/fm/repos/{repoId}/store', // 单个文件上传
    list: '/edp/fm/repos/{repoId}/files', // 上传文件名展示
    download: '/edp/fm/repos/{repoId}/bytes/{file}', // 删除文件
    delete: '/edp/fm/repos/{repoId}/files/{file}/erase', // 删除文件
    pkg: '/api/fm/repos/{repoId}/zip/create', // 批量下载
  },
  sys: {
    users: '/edp/iam/users', // 用户管理
    resetPW: '/edp/pwd/reset', // 重置密码
    roles: '/edp/iam/roles', // 授权角色管理
    perms: '/edp/iam/perms', // 角色权限集合
    udcs: '/edp/mgmt/udcs', // UDC维护
    udcItems: '/edp/mgmt/udcs/{id}/items', // UDC明细
    udcsClear: '/edp/mgmt/udcs/evict', // 清空UDC缓存
    reclogs: '/ei/api/ocrlogs',
  },
}
