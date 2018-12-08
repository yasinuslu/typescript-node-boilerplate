/* eslint-disable no-param-reassign */
module.exports = {
  webpack: (config, options, webpack) => {
    config.devtool = 'eval-source-map';
    
    config.entry.main = ['./src/index.ts'];

    config.resolve = {
      extensions: ['.ts', '.js', '.json'],
    };

    const babelRule = config.module.rules[0];
    babelRule.test = /\.(js|jsx|ts|tsx)$/;

    return config;
  },
};
