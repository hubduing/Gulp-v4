const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
// npm i --save-dev gulp-uglify-es
const uglify = require('gulp-uglify-es').default;
// npm i --save-dev gulp-sass
const sass = require('gulp-sass')(require('sass'));
// npm i --save-dev gulp-autoprefixer
const autoprefixer = require('gulp-autoprefixer');
// npm i --save-dev gulp-clean-css
const cleanCSS = require('gulp-clean-css');

function fBrowserSync() {
  browserSync.init({
    // прописываем путь до папки из которой сервер будет брать необходимые файлы
    server: {baseDir: 'app/'},
    // отключаеим надоедливое сообщение
    notify: false,
    // работаем локально
    online: false,
  })
}
// npm i --save-dev jquery
function scripts() {
  return src([
    './node_modules/jquery/dist/jquery.min.js',
    './app/scripts/app.js'
  ])
  .pipe(concat('app.min.js'))
  .pipe(uglify())
  // npm i --save-dev gulp-concat
  // dest - путь куда выгружаем сконкатенированный файл
  .pipe(dest('app/scripts')) 
  .pipe(browserSync.stream()) // следим за изменением файлов
}

function styleFunc() {
  return src([
    './app/sass/main.sass'
  ])
  .pipe(sass())
  .pipe(concat('app.min.css'))
  .pipe(autoprefixer({
    overrideBrowserslist: ['last 10 versions'],
    grid: true
  }))
//   .pipe(cleanCSS({level: { 1: { specialComments: 0 } },compatibility: 'ie8'}))
  .pipe(cleanCSS())
  .pipe(dest('./app/css/'))
}

function startWatch(){
  watch([ './app/**/*.js', '!app/**/*.min.js' ], scripts) 
  // выбрать все файлы js, в том числе в подпапках
}

// сделали экспорт функции в ТАСК
exports.BrowserSync = fBrowserSync;
exports.scripts = scripts;
exports.styles = styleFunc;
exports.default = parallel(scripts, fBrowserSync, styleFunc, startWatch)
// запуск сборщика. пишем в консоли: gulp