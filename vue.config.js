module.exports = {
  "pwa": {
    "name": "FR Checker"
  },

  "transpileDependencies": [
    "vuetify"
  ],

  publicPath: '/fr/',

  pwa: {
    name: 'FR Checker'
  },
  configureWebpack: {
    module: {
        rules: [
            {
                test: /.csv$/,
                loader: 'csv-loader'
            }
        ]
    }
}
}



