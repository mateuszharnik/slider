const gulp = require('gulp');
const browserSync = require('browser-sync');
const scss = require('gulp-sass');
const htmlmin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const del = require('del');
const rename = require('gulp-rename');
const sequence = require('run-sequence');

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

gulp.task('reload', () => {
  browserSync.reload();
});

gulp.task('serve', ['scss', 'babel'], () => {
  browserSync({
    server: 'src'
  });

  gulp.watch('src/*.html', ['reload']);
  gulp.watch('src/js/bundle.js', ['reload']);
  gulp.watch('src/scss/**/*.scss', ['scss']);
  gulp.watch('src/js/main.js', ['babel']);
});

gulp.task('scss', () => {
  return gulp
    .src('src/scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(scss().on('error', scss.logError))
    .pipe(
      autoprefixer({
        browsers: ['last 3 versions']
      })
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
});

gulp.task('babel', () => {
  return gulp
    .src('src/js/main.js')
    .pipe(sourcemaps.init())
    .pipe(babel().on('error', handleError))
    .pipe(sourcemaps.write())
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('src/js'));
});

gulp.task('js', () => {
  return gulp.src('src/js/bundle.js').pipe(gulp.dest('dist/js'));
});

gulp.task('css', () => {
  return gulp.src('src/css/*.css').pipe(gulp.dest('dist/css'));
});

gulp.task('html', () => {
  return gulp
    .src('src/*.html')
    .pipe(
      htmlmin({
        sortAttributes: true,
        sortClassName: true
      })
    )
    .pipe(gulp.dest('dist/'));
});

gulp.task('del', () => {
  return del(['dist']);
});

gulp.task('build', () => {
  sequence('del', ['html', 'css', 'js']);
});

gulp.task('default', ['serve']);
