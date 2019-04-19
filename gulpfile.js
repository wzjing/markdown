const gulp = require('gulp');
const connect = require('gulp-connect');
const del = require('del');
const gulpMarkdown = require('./components/gulp-markdown');
const webpack = require('webpack');
const config = require('./webpack.config');

function clean() {
    return del('./dist')
}

function compile() {
    return gulp.src('./data/**/*', { buffer: false, base: './data'})
        .pipe(gulpMarkdown())
        .pipe(gulp.dest('./dist/articles'));
}

function copyAssets() {
    return gulp.src('./data/assets**/*', { base: './data' })
        .pipe(gulp.dest('./dist'))
}

function copySource() {
    return gulp.src('./src/**/*', { base: './src' })
        .pipe(gulp.dest('./dist'));
}

function pack() {
    return new Promise((resolve, reject)=>{
        webpack(config, (err, status)=>{
            if(err) {
                reject()
            } else {
                resolve();
            }
        });
    })
}

function watch() {
    gulp.watch('./src/**/*', copySource);
    gulp.watch('./data/assets/**/*', copyAssets);
    gulp.watch('./data/**/*.md', compile);
}

function server() {
    connect.server({
        root: './dist',
        host: '0.0.0.0',
        port: 3000,
        livereload: true
    });
}

let start = gulp.series(gulp.parallel(compile, copyAssets, copySource), gulp.parallel(server, watch));

exports.compile = compile;
exports.pack = pack;
exports.default = start;