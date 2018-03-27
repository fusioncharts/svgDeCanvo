import { version, source, build } from './package.json';
import uglify from 'rollup-plugin-uglify';

const BANNER = `/**!
 * SvgDeCanvo ${version} - JavaScript Vector Library
 * Copyright (c) 2015-2018 FusionCharts Technologies <http://www.fusioncharts.com>
 * Licensed under the MIT license.
 */`;
const { src: SOURCE_PATH, name: SOURCE_FILE_NAME } = source;
const { dist: BUILD_PATH, name: BUILD_FILE_NAME } = build;

export default [{
  input: `${SOURCE_PATH}/${SOURCE_FILE_NAME}.js`,
  output: {
    file: `${BUILD_PATH}/${BUILD_FILE_NAME}.js`,
    format: 'umd',
    name: 'SvgDeCanvo',
    banner: BANNER
  }
}, {
  input: `${SOURCE_PATH}/${SOURCE_FILE_NAME}.js`,
  output: {
    file: `${BUILD_PATH}/${BUILD_FILE_NAME}.js`,
    format: 'umd',
    name: 'SvgDeCanvo'
  },
  plugins: [
    uglify({
      output: {
        preamble: BANNER
      }
    })
  ]
}]
