# sign-up-console

# 开发环境
- Node 8+、NPM或CNPM（https://npm.taobao.org/）
- Git
- 代码编辑器 如Visual Studio Code
- 命令行工具 如Git Bash for Windows或Terminal.app for macOS

# 调试工具
- 现代浏览器 如Google Chrome
- （可选）Chrome插件：React Developer Tools和Redux DevTools

# 命令行

```shell
yarn install   # 安装依赖包
npm run buildDll
npm run start  # 启动调试， 打开浏览器，访问：http://localhost:8000
npm run build  # 打包
```

# 项目结构

```bash
├── /dist/             # 项目输出目录
├── /src/              # 项目源码目录
│ ├── /components/     # UI组件及UI相关方法
│ ├── /routes/         # 路由组件 / 页面
│ │ └── app.js         # 路由入口
│ ├── /models/         # 数据模型
│ ├── /services/       # 数据接口
│ ├── /themes/         # 项目样式
│ ├── /mock/           # 数据mock
│ ├── /utils/          # 工具函数
│ │ ├── config.js      # 项目常规配置
│ │ ├── logger.js      # 日志工具
│ │ ├── networkUtils.js # 网络工具集 异步请求函数
│ │ ├── formUtils.js   # 表单工具集(可根据业务要求,统一设置表单前后处理)
│ │ ├── dataUtils.js   # 通用数据工具集
│ │ ├── stringUtils.js  # 表单工具集
│ │ ├── enums.js       # 枚举常量
│ │ └── theme.js       # 项目需要在js中使用到样式变量
│ ├── route.js         # 路由配置
│ ├── index.js         # 入口文件
├── package.json       # 项目信息
└── .roadhogrc.js      # roadhog配置
```
