const gulp = require('gulp');
const concat = require('gulp-concat');
const gulpCopy = require('gulp-copy');
const strip = require('gulp-strip-comments');
const header = require('gulp-header');
const rename = require("gulp-rename");
const less = require('gulp-less');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-html-minifier');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const util = require('gulp-util');
const browserSync = require('browser-sync').create();
const pkg = require('./package.json');

const paths = {
    dev: {
        styles: {
            src: ['src/sass/style.scss'],
            dist: 'src/styles'
        }
    },
    html: {
        src: ['src/*.html'],
        dist: 'dist/'
    },
    images: {
        src: ['src/images/*'],
        dist: 'dist/images'
    },
    styles: {
        src: ['src/sass/style.scss'],
        src_min: ['dist/styles/style.css'],
        dist: 'dist/styles'
    },
    scripts: {
        src: [
            'src/scripts/app.js'
        ],
        file: 'app.js',
        dist: 'dist/scripts'
    },
    browserSync: {
        baseDir: 'dist',
        port: 4000
    }
};

var banner = ['/*!\n',
    ' *<%= pkg.title %> v<%= pkg.version %>\n',
    ' * Copyright 2016-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' */\n',
    ''
].join('');

gulp.task('html', function () {
    return gulp.src(paths.html.src)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(paths.html.dist));
});

gulp.task('images', function () {
    return gulp.src(paths.images.src)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.images.dist));
});

gulp.task('sass-dev', function () {
    return gulp.src(paths.dev.styles.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(paths.dev.styles.dist))
        .pipe(browserSync.reload({stream: true}))
});


gulp.task('sass', function () {
    return gulp.src(paths.styles.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest(paths.styles.dist))
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('css-minify', ['sass'], function () {
    return gulp.src(paths.styles.src_min)
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.styles.dist))
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('js-minify', function () {
    return gulp.src(paths.scripts.src)
        .pipe(concat(paths.scripts.file))
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.scripts.dist))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: paths.browserSync.baseDir

        },
        port: paths.browserSync.port
    })
});

// Dev
gulp.task('default', ['sass-dev']);

// Prod
gulp.task('build', ['html', 'images', 'css-minify', 'js-minify']);
