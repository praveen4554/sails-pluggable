var gulp = require('gulp');
var babel = require('gulp-babel');
var del = require('del');
var typescript = require('gulp-tsc');

gulp.task('clean',function(){
    return del(['node_modules/sails-hook-jwt-auth/api','node_modules/sails-hook-jwt-auth/config'])
});
gulp.task('defaultImplicit', function () {
  gulp.src([ 'lib/**' ])
    .pipe(babel())
    .pipe(gulp.dest('dist/lib'));

  gulp.src([ 'api/**' ])
    .pipe(babel())
    .pipe(gulp.dest('dist/api'));

  gulp.src([ 'config/**' ])
    .pipe(babel())
    .pipe(gulp.dest('dist/config'));
});

gulp.task('compileTypescript', function(){
  gulp.src(['api/controllers/*.ts', 'api/services/*.ts'], { base: "." })
    .pipe(typescript())
    .pipe(gulp.dest('./'))
});

gulp.task('default',['clean', 'compileTypescript']);
