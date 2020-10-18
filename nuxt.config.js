module.exports = {
  model: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: '知否 - 一个开发者分享的平台',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
      { hid: 'description', name: 'description', content: '是一个开发者集聚地，分享技术带给我们的收获和快乐' },
      // { 'http-equiv': 'Content-Security-Policy', content: 'upgrade-insecure-requests' } // 把图片的http转为https
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/static/favicon.ico' },
      // 添加iconfont图标 如果需要添加图标  需更新此地址
      { rel: 'stylesheet', type: 'text/css', href: 'http://at.alicdn.com/t/font_1620619_r77fweaie2q.css' },
    ],
    script: [
      //  { src: 'gt.js', type: 'text/javascript' } // 本地静态资源可用次,线上无法读取改地址,建议换成下面
      { src: 'http://static.geetest.com/static/tools/gt.js', type: 'text/javascript' }
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
        maxAssetSize: 40000000,
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
    '@nuxtjs/style-resources',
    '@nuxtjs/proxy',
  ],
  proxy: [ // 设置代理
    // ['/api', {
    //   target: 'http://39.96.10.130:3000',
    //   changeOrigin: true,
    //   secure: false,
    //   pathRewrite: {
    //     '^/api': ''
    //   }
    // }]
    ['/api', {
      target: 'http://localhost:3000',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }]
    // ['/api', { -+
    //   target: 'https://www.jscwwd.com:3000',
    //   changeOrigin: true,
      // pathRewrite: {
      //   '^/api': ''
      // }
    // }]
  ],
  plugins: [
    { src: '~plugins/nuxt-mavon-plugin.js', ssr: false},
    { src: '~plugins/directive.js', ssr: false},
    { src: '~plugins/element-ui' },
    { src: '~plugins/Util.js', ssr: false },
    // { src: '~plugins/components.js', ssr: true },
    { src: '~plugins/filter.js'},
    { src: '~plugins/lazy-load.js'},
    { src: '~plugins/prototype.js'},
  ],
  css: [
    '~/assets/css/base.scss',
    'element-ui/lib/theme-chalk/index.css',
    'element-ui/lib/theme-chalk/reset.css',
    'mavon-editor/dist/css/index.css'
  ],
}
