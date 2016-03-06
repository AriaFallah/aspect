'use strict'

// Gulp task to move files
const gulp = require('gulp')
gulp.task('move', () =>
  gulp.src('static/*')
    .pipe(gulp.dest('dist')))

gulp.task('default', ['move'])
