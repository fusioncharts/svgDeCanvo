/* eslint one-var: "off" */
import path from 'path';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import uglify from 'rollup-plugin-uglify';
import livereload from 'rollup-plugin-livereload';
import { version, source, build, samples, directories } from './package.json';

const BANNER = `/**
 * SvgDeCanvo ${version} - JavaScript Vector Library
 * Copyright (c) 2015-2018 InfoSoft Global Pvt. Ltd. <http://www.fusioncharts.com>
 * Licensed under the MIT license.
 */`;
const { dist: BUILD_PATH, name: BUILD_FILE_NAME } = build;
const { root: SAMPLE_PATH } = samples;
const { test: SAMPLE_HTML_DIR } = directories;
const ENTRY = path.resolve(source.src, `${source.name}.js`);

function getOutput (args) {
  let output = {
    format: 'umd',
    name: 'SvgDeCanvo'
  };

  const filePath = (args.watch || args.configDevelopment) ? SAMPLE_PATH : BUILD_PATH;
  const fileName = (args.configMinify && args.configProduction)
    ? `${BUILD_FILE_NAME}-min.js`
    : `${BUILD_FILE_NAME}.js`;

  output.file = path.resolve(filePath, fileName);

  if (!args.configMinify) {
    output.banner = BANNER;
  }

  return output;
};
function getPlugins (args) {
  let plugins = [];

  if (args.watch) {
    plugins.push(copy({
      [`${SAMPLE_HTML_DIR}/index.html`]: `${SAMPLE_PATH}/index.html`,
      verbose: true
    }));

    if (args.configDevelopment) {
      plugins.push(serve({ contentBase: SAMPLE_PATH }));
      plugins.push(livereload({ watch: SAMPLE_PATH }));
    }
  }

  if (args.configMinify) {
    plugins.push(uglify({ output: { preamble: BANNER } }));
  }

  return plugins;
};

export default args => {
  return {
    input: ENTRY,
    output: getOutput(args),
    plugins: getPlugins(args)
  };
};
