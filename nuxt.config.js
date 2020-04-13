module.exports = {
  model: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: '益码凭川',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
      { hid: 'description', name: 'description', content: '蒋少川的个人博客, 一个前端工程师的日常学习日志和经验总结。' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      // 添加iconfont图标 如果需要添加图标  需更新此地址
      { rel: 'stylesheet', type: 'text/css', href: 'https://at.alicdn.com/t/font_1620619_qn3qqx1m7t.css' },
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    vendor: ['axios', 'element-ui'],
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    styleResources: {
      scss: './assets/css/base.scss' 
    },
    // 新加
    postcss: {
      plugins: [
        require("autoprefixer")()
      ]
    },
    loaders: {
      vue: {
        compilerOptions: {
          preserveWhitespace: false
        }
      }
    },
    //webpack配置
    configureWebpack: {
      //关闭 webpack 的性能提示
      // performance: {
      //   hints:false
      // },
      //或者
      //警告 webpack 的性能提示
      performance: {
        hints:'warning',
        //入口起点的最大体积
        maxEntrypointSize: 50000000,
        //生成文件的最大体积
        maxAssetSize: 30000000,
        //只给出 js 文件的性能提示
        assetFilter: function(assetFilename) {
          return assetFilename.endsWith('.js');
        }
      }
    },
    analyze: false,
    maxChunkSize: 300000,
    babel: {
      plugins: [
        [
          'component',
          {
            libraryName: 'element-ui',
            styleLibraryName: 'theme-chalk'
          }
        ]
      ],
      comments: true
    },
  },
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  proxy: [ // 设置代理
    ['/api', { target: 'https://39.96.10.130:3000' }] // 已经添加https
    // ['/api', { target: 'http://localhost:3000' }]
  ],
  plugins: [
    { src: '~plugins/nuxt-mavon-plugin.js', ssr: false },
    { src: '~plugins/element-ui', ssr: true },
    { src: '~plugins/util.js', ssr: false },
    // { src: '~plugins/components.js', ssr: true },
    { src: '~plugins/filter.js', ssr: false },
    { src: '~plugins/lazy-load.js', ssr: false },
    { src: '~plugins/prototype.js', ssr: false },
  ],

  css: [
    '~/assets/css/base.scss',
    // 'element-ui/lib/theme-chalk/reset.css',
    'element-ui/lib/theme-chalk/index.css',
    'mavon-editor/dist/css/index.css'
  ],
}
