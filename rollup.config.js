// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';

// rollup src/index.js -o store.js --name store --output.format umd

export default {
  input: 'src/index.js',
  output: { file: 'store.js', format: 'umd' },
  name: 'store',
  plugins: [resolve()]
};
