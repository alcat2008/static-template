'use strict'

const fs = require('fs')
const path = require('path')
const gulp = require('gulp')
const gutil = require('gulp-util')

const browserSync = require('browser-sync')

const clean = require('gulp-clean')

const data = require('gulp-data')
const ejs = require('gulp-ejs')
const htmlmin = require('gulp-htmlmin')

const rollup = require('rollup-stream')
const source = require('vinyl-source-stream')
const replace = require('rollup-plugin-replace')
const babel = require('rollup-plugin-babel')
const buffer = require('gulp-buffer')
const rev = require('gulp-rev')
const sourcemaps = require('gulp-sourcemaps')

const less = require('gulp-less')
const stylelint = require('gulp-stylelint')
const autoprefixer = require('autoprefixer')
const postcss = require('gulp-postcss')
const rename = require("gulp-rename")

const config = {
  dist: './dist',           // 生成目录
  rev: {
    js: 'rev-manifest-js.json',
    css: 'rev-manifest-css.json',
  },
  template: './templates',  // 模版目录
  js: './js',               // js 目录
  less: './less'            // less 目录
}

const isDev = gutil.env.type !== 'production'
const BuildEnv = process.env.BUILD_ENV || 'dev'

gulp.task('clean', function () {
	return gulp.src(config.dist, { read: false })
		.pipe(clean());
});

// html 模版合并
gulp.task('compile:html', function() {
  return gulp.src(config.template + '/**/*.html')
    .pipe(data(function (file) {
      const filePath = file.path

      // global.json 全局数据，页面中直接通过属性名调用
      const globalProfile = JSON.parse(fs.readFileSync(config.template + '/global.json'))
      const localProfile = JSON.parse(fs.readFileSync( path.join(path.dirname(filePath), path.basename(filePath, '.html') + '.json')))
      const finalProfile = Object.assign(globalProfile, {
        styles: globalProfile.styles.concat(isDev ? './styles.css' : ''),
        scripts: globalProfile.scripts.concat(isDev ? './main.bundle.js' : ''),
      }, {
        // local: 每个页面对应的数据，页面中通过 local.属性 调用
        local: Object.assign(localProfile, {})
      })
      console.log('****** Profile Start ******')
      console.log(finalProfile)
      console.log('****** Profile End ******')
      return finalProfile
    }))
    .pipe(ejs().on('error', function(err) {
      gutil.log(err)
      this.emit('end')
    }))
    .pipe(isDev ? gutil.noop() : htmlmin({ // Options Quick Reference: https://github.com/kangax/html-minifier
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true,
    }))
    .pipe(gulp.dest(config.dist))
})

// 编译 js 文件
gulp.task('compile:js', function() {
  return rollup({
    input: config.js + '/index.js',
    sourcemap: !isDev,
    format: 'umd',
    plugins: [
      // inject({
      //   env: path.resolve( `build/env.${buildEnv}.js` ),
      // }),
      replace({
        'process.env.NODE_ENV': JSON.stringify( 'production' ),
        'process.env.BUILD_ENV': JSON.stringify( BuildEnv )
      }),
      babel({
        presets: [
          [
            "es2015", {
              "modules": false
            }
          ]
        ],
        babelrc: false,
        exclude: 'node_modules/**' // 只编译我们的源代码
      }),
      // resolve({
      //   jsnext: true,
      //   main: true,
      //   browser: true,
      // }),
      // commonjs({
      //   include: 'node_modules/**'
      // }),
    ],
    globals: {
      jquery: '$'
    }
  })
  .pipe(source('main.bundle.js'))
  .pipe(buffer())
  .pipe(isDev ? gutil.noop() : sourcemaps.init({ loadMaps: true }))
  .pipe(isDev ? gutil.noop() : sourcemaps.write('.'))
  .pipe(isDev ? gutil.noop() : gulp.dest(config.dist))
  .pipe(isDev ? gutil.noop() : rev())
  .pipe(isDev ? gutil.noop() : gulp.dest(config.dist))
  .pipe(isDev ? gutil.noop() : rev.manifest(config.rev.js))
  .pipe(gulp.dest(config.dist))
})

// 编译 css 文件
gulp.task('compile:css', function() {
  return gulp.src(config.less + '/index.less')
    .pipe(stylelint({
      reporters: [
        { formatter: 'verbose', console: true }
      ],
      failAfterError: false
    }))
    .pipe(less())
    .pipe(postcss([
      autoprefixer({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
        ]
      }),
    ]))
    // .pipe(source('styles.css'))
    .pipe(rename({ basename: 'styles' }))
    .pipe(isDev ? gutil.noop() : sourcemaps.init({ loadMaps: true }))
    .pipe(isDev ? gutil.noop() : sourcemaps.write('.'))
    .pipe(isDev ? gutil.noop() : gulp.dest(config.dist))
    .pipe(isDev ? gutil.noop() : rev())
    .pipe(isDev ? gutil.noop() : gulp.dest(config.dist))
    .pipe(isDev ? gutil.noop() : rev.manifest(config.rev.css))
    .pipe(gulp.dest(config.dist))
})


gulp.task('compile', ['compile:js', 'compile:css'], function () {
  return gulp.start('compile:html')
})
gulp.task('compile-sync', ['compile'], browserSync.reload)

// 开发服务
gulp.task('dev', function() {
  gulp.start('compile-sync')

  browserSync.init({
    server: {
      baseDir: config.dist
    },
    reloadDebounce: 0
  })

  // 无论是数据文件更改还是模版更改都会触发页面自动重载
  gulp.watch(config.template + '/**/*.*', ['compile-sync'])
})

// 打包
gulp.task('build', ['clean'], function () {
  return gulp.start('compile')
})
