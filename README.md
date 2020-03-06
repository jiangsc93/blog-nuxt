# Nuxt-ssr是一个文章增删改查的SSR项目

> Nuxt.js该项目是一个ssr结构完整的项目，适合新人练手使用，如果对您有帮助，请右上角给个star，鼓励一下，同时希望指正。也可以加 nuxt技术交流群，大家一起相互学习，相互成长。


## 用到的技术

> Vue.js v2.0.0

> Nuxt.js v1.0.0

> Node.js v9.8.0 (必须>=8.0)

> Express.js v4.x

> MongoDB v3.4.7

> element-ui v2.3.2


## 目录结构

```
├── assets                              资源目录 assets 用于组织未编译的静态资源如 LESS、SASS 或 JavaScript
├── build                               打包后的文件
├── components                          存放组件，用于组织应用的 Vue.js 组件
│   ├── Footer                          页面footer组件
│   ├── ....
├── layouts                             布局模板文件，默认default，通过为页面设置layout更改
│   ├── edit                            编辑/创建文章模板
│   ├── ....
├── middleware                          存放应用的中间件
│   ├── auth.js                         路由是否登录拦截
│   ├── ...
├── node_modules                        Node依赖文件
├── nuxt.config.js                      Nuxt主配置文件
├── pages                               存放页面的目录
│   ├── index.vue                       首页
│   ├── ....
├── plugins                             存放插件，用于组织那些需要在 根vue.js应用 实例化之前需要运行的 Javascript 插件
│   └── nuxt-quill-plugin.js            富文本编辑器插件
├── README.md                           README
├── server                              express后台目录
│   ├── api.js                          server端接口
│   ├── db.js                           连接MongoDB数据库文件
│   ├── listrouter.js                   server启动配置
│   ├── ....
├── static                              静态文件目录,此类文件不会被 Nuxt.js 调用 Webpack 进行构建编译处理。 服务器启动的时候，该目录下的文件会映射至应用的根路径 / 下
├── util                                存放一些工具文件（自己添加）
│   ├── net.js                          封装网络请求
│   ├── ui.js                           封装ui弹框配置
│   ├── ...
```


## 前端开发指南

> 首先需要安装 >=node8.0 因为nuxt1.0.0 必须在>=node8.0的环境下才可以安装成功

> 安装element-ui, 安装方法页面[这个页面](http://element.eleme.io/#/zh-CN/component/quickstart)下面有比较详细的demo,可参考

> 富文本编辑器nuxt-quill-plugin的安装与使用 [nuxt-quill-plugin](https://github.com/surmon-china/vue-quill-editor).

> （划重点，因为本地前后端检测同一个接口无法实现，所以与下面的后端端口不同）前端监控的是3389端口 ,执行命令 "npm run dev";



## 后端开发指南

> 下载安装MongoDB, 具体详情不在此赘述,给上链接 [MongoDB](https://www.mongodb.com/download-center?jmp=nav#atlas).

> 安装Express, 具体详情不在此赘述,给上链接 [Express](http://expressjs.com/zh-cn/4x/api.html) .

> 安装supervisor 实时监控，可以进行全局，也可只安装在本项目中。全局安装方法：sudo npm install -g supervisor.

> （划重点，因为本地前后端检测同一个接口无法实现，所以与上面的前端端口不同）后端监控的是3000端口, 需要,cd 到 server文件夹目录下,执行命令 "supervisor listrouter.js";


## 阿里云部署

> 具体部署步骤不在此详解，具体可看大神的教程[详细教程](https://itcnz.github.io/20180418/%E9%98%BF%E9%87%8C%E4%BA%91%E9%83%A8%E7%BD%B2nuxt%E9%A1%B9%E7%9B%AE.html)

上线配置：
nuxt.config.js 的proxy更改上线配置
uitls下的checkenv.js更改两个配置


## 构建与运行

``` bash
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).


**版本迭代：**
v1.0
blog-nuxt博客网站全新上线
前台：“文章”和“关于”，
后台管理系统：登录，文章编辑和查看，文章列表，
后端：相关接口。

v2.0
前台：增加 “归档”，“项目”，“历程”，“留言”模块
后台管理系统：更换UI，添加左侧导航栏，菜单有：文章（文章列表、创建新文章）、项目、历程、留言模块，增加用户注册模块
后台：细化各类接口，增加token验证（暂未完全完成）

上线bug：文章详情页的title显示undefiend，无后台管理系统登录入口。
其他优化：移动端显示
