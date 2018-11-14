import resolve from 'rollup-plugin-node-resolve';

export default {
  name: 'brownies',
  input: 'brownies.js',
  output: {
    format: 'umd'
  },
  plugins: [
    resolve()
  ]
};
