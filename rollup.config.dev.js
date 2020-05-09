import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import json from 'rollup-plugin-json'
import replace from 'rollup-plugin-replace'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

// 新增的postcss
import postcss from 'rollup-plugin-postcss'

// 新增 postcss plugins
import simplevars from 'postcss-simple-vars'
import nested from 'postcss-nested'
import cssnext from 'postcss-cssnext'
import cssnano from 'cssnano'

export default {
  input: 'src/main.js',
  output: {
    file: './dist/bundle.js',
    format: 'iife',
    name: 'rollupCli',
  },
  globals: {
    jquery: '$',
  },
  plugins: [
    // 新增的postcss
    postcss({
      extensions: ['.css'],
      plugins: [
        simplevars(),
        nested(),
        cssnext({ warnForDuplicates: false }),
        cssnano(),
      ],
    }),
    resolve({
      mainFields: ['module', 'main', 'browser', 'jsnext'],
    }),
    babel({
      exclude: 'node_modules/**', // 只编译我们的源代码
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            targets: {
              browsers: '> 1%, IE 11, not op_mini all, not dead',
              node: 'current',
            },
            corejs: '2',
            useBuiltIns: 'usage',
          },
        ],
      ],
    }),
    commonjs(),
    json(),
    replace({
      ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    process.env.NODE_ENV === 'production' && uglify(),
    serve({
      // open: true, // 是否打开浏览器
      contentBase: './test', // 入口html的文件位置
      historyApiFallback: true, // Set to true to return index.html instead of 404
      host: 'localhost',
      port: 10001,
    }),
    livereload(),
  ],
}
