var path = require('path');
var useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');
var tsconfig = require('./tsconfig.json');

useDefaultConfig.dev.resolve.alias = {
  '@lib': path.resolve('./src/lib/'),
  '@pages': path.resolve('./src/pages/'),
  '@modals': path.resolve('./src/modals/'),
  '@directives': path.resolve('./src/directives/'),
  '@stores': path.resolve('./src/stores/'),
  '@components': path.resolve('./src/components/')
};

useDefaultConfig.prod.resolve.alias = {
  '@lib': path.resolve('./src/lib/'),
  '@pages': path.resolve('./src/pages/'),
  '@modals': path.resolve('./src/modals/'),
  '@directives': path.resolve('./src/directives/'),
  '@stores': path.resolve('./src/stores/'),
  '@components': path.resolve('./src/components/')
};

module.exports = function() {
  return useDefaultConfig;
};
