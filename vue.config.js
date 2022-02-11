module.exports = {
	publicPath: process.env.NODE_ENV === 'production'
	? '/moviDescGenerator/'
	: "",

	lintOnSave: false,
	configureWebpack: {
	  devtool: 'source-map'
	}
  }
  