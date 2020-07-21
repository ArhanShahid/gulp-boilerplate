const gulp = require('gulp');
const concat = require('gulp-concat');
const header = require('gulp-header');
const rename = require("gulp-rename");
const sass = require('gulp-sass');
const htmlmin = require('gulp-html-minifier');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const replace = require('gulp-replace');
const browserSync = require('browser-sync').create();
const pkg = require('./package.json');

const paths = {
    dev: {
        styles: {
            src: ['src/sass/style.scss'],
            dist: 'src/styles'
        }
    },
    prod: {
        html: {
            src: ['src/*.html'],
            dist: 'dist/'
        },
        images: {
            src: ['src/images/*', 'src/images/*/*'],
            dist: 'dist/images'
        },
        fonts: {
            src: ['src/fonts/*.*'],
            dist: 'dist/fonts'
        },
        php: {
            src: ['src/php/*.*'],
            dist: 'dist/php'
        },
        styles: {
            src: ['src/sass/style.scss'],
            dist: 'dist/styles'
        },
        scripts: {
            src: ['src/scripts/app.js'],
            file: 'app.js',
            dist: 'dist/scripts'
        },
        sync: {
            baseDir: 'dist',
            port: 4000
        }
    }
};

var banner = ['/*!\n',
    ' *<%= pkg.title %> v<%= pkg.version %>\n',
    ' * Copyright 2016-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' */\n',
    ''
].join('');

gulp.task('html', function () {
    return gulp.src(paths.prod.html.src)
        .pipe(replace('styles/style.css', 'styles/style.min.css'))
        .pipe(replace('scripts/app.js', 'scripts/app.min.js'))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(paths.prod.html.dist));
});

gulp.task('images', function () {
    return gulp.src(paths.prod.images.src)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.prod.images.dist));
});

gulp.task('fonts', function () {
    return gulp.src(paths.prod.fonts.src)
        .pipe(gulp.dest(paths.prod.fonts.dist));
});

gulp.task('php', function () {
    return gulp.src(paths.prod.php.src)
        .pipe(gulp.dest(paths.prod.php.dist));
});

gulp.task('sass-dev', () => {
    return gulp.src(paths.dev.styles.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(paths.dev.styles.dist))
    // .pipe(browserSync.reload({
    //     stream: true
    // }))
    // done();
});


gulp.task('sass', function () {
    return gulp.src(paths.prod.styles.src)
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(header(banner, {
            pkg: pkg
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.prod.styles.dist))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('js-minify', function () {
    return gulp.src(paths.prod.scripts.src)
        .pipe(concat(paths.prod.scripts.file))
        .pipe(uglify())
        .pipe(header(banner, {
            pkg: pkg
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.prod.scripts.dist))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: paths.sync.baseDir
        },
        port: paths.sync.port
    })
});

// Dev
gulp.task('default', gulp.series('sass-dev'));

// Prod
gulp.task('build', gulp.series('html', 'fonts', 'php', 'sass', 'images', 'js-minify'));