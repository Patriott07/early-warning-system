export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        // target: '//erwas.my.id',
        // target: 'http://202.10.41.4:5000',
        changeOrigin: true,
      },
    },
  },
};