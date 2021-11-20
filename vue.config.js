module.exports = {
  pwa: {
    name: "FR Checker"
  },
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath:process.env.NODE_ENV === 'production' ? '/fr/' : '/',
}



