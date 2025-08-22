module.exports = {
  presets: ['@babel/preset-env'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@/config': './src/config',
          '@/services': './src/services',
          '@/controllers': './src/controllers',
          '@/middleware': './src/middleware',
          '@/utils': './src/utils',
          '@/routes': './src/routes'
        }
      }
    ]
  ]
};
