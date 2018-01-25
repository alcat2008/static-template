# static-template

Static template project for official website

静态模板项目，特别适用于官网类型，支持 SEO。

gulp + ejs 合并静态页模版，文件更新自动热重载。

## 开始

```bash
$ yarn install               # 安装依赖
$ yarn start                 # 启动一个自动热重载的服务器，默认端口 3000
```

## 构建打包

```bash
$ yarn build                   # 构建打包，另提供多种环境下的编译命令
$ yarn zip                     # 创建压缩包方便部署或分发
```

## 目录结构

```
.
├── dist                      # 编译生成的文件目录
├── src                       # 源码目录
│   │── js                    # js 目录
│   │    └── index.js         # js 入口文件
│   │── less                  # less 目录
│   │    └── index.less       # less 入口文件
│   │── images                # image 目录
│   └── templates             # 模版目录，模版以 `.ejs` 结尾，没有目录结构限制，按需引入或编写新的页面模块
│        │── global.json      # 全局数据文件
│        │── *.json           # 页面数据文件
│        └── *.html           # 页面入口文件
│
│
└── .stylelintrc             # 开发用 html 文件，打包时会生成 index.html 文件
```

## 其他

实际工作中肯定还会搭配其他任务一起运行，比如：css 和 js 相关任务。此 Demo 中省略，可根据各自项目情况自行更改。
