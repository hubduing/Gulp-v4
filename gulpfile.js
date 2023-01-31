const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
// npm i --save-dev gulp-uglify-es
const uglify = require('gulp-uglify-es').default;

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

function startWatch(){
  watch([ './app/**/*.js', '!app/**/*.min.js' ], scripts) 
  // выбрать все файлы js, в том числе в подпапках
}

// сделали экспорт функции в ТАСК
exports.BrowserSync = fBrowserSync;
exports.scripts = scripts;
exports.default = parallel(scripts, fBrowserSync, startWatch)
// запуск сборщика. пишем в консоли: gulp