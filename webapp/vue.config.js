const path = require('path');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  publicPath: isProduction ? '/public/' : '/',
  productionSourceMap: false,
  configureWebpack: () => {
    const myConfig = {
      devtool: 'source-map',
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'),
          '@utils': path.resolve(__dirname, 'src/utils'),
          '@views': path.resolve(__dirname, 'src/views'),
          '@components': path.resolve(__dirname, 'src/components'),
          '@scss': path.resolve(__dirname, 'src/scss'),
          '@assets': path.resolve(__dirname, 'src/assets'),
          '@services': path.resolve(__dirname, 'src/services')
        }
      },
      plugins: [
        new LodashModuleReplacementPlugin()
      ]
    };
    return myConfig;
  },
  parallel: require('os').cpus().length > 1
};
