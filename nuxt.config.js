module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: '益码凭川',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      // 添加iconfont图标 如果需要添加图标  需更新此地址
      { rel: 'stylesheet', type: 'text/css', href: 'https://at.alicdn.com/t/font_1620619_sm99vzqy6wk.css' },
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
    }
  },
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  proxy: [ // 设置代理
    ['/api', { target: 'http://39.96.10.130:3000' }]
    // ['/api', { target: 'http://localhost:3000' }]
  ],
  plugins: [
    { src: '~plugins/nuxt-quill-plugin.js', ssr: false },
    { src: '~plugins/element-ui.js', ssr: true },
    { src: '~plugins/util.js', ssr: false }
  ],

  css: [
    '~/assets/css/base.scss',
    'element-ui/lib/theme-chalk/reset.css',
    'element-ui/lib/theme-chalk/index.css',
  ],
  // router: {
  //   middleware: 'chekRouter'
  // }

}
