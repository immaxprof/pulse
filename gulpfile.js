const { src, dest, parallel, series, watch } = require("gulp");
const preprocessor = "scss";
// const gulp = require("gulp");
const browserSync = require("browser-sync");
const sass = require("gulp-sass")(require("sass"));
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");

// Static server

function serverOn() {
  browserSync.init({
    server: {
      baseDir: "src",
    },
  });
}

// gulp.task("server", function () {
//   browserSync.init({
//     server: {
//       baseDir: "src",
//     },
//   });
// });

function styles() {
  return src(`src/${preprocessor}/*.${preprocessor}`)
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(
      rename({
        prefix: "",
        suffix: ".min",
      })
    )
    .pipe(autoprefixer())
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(dest("src/css"))
    .pipe(browserSync.stream());
}

function stylesExt() {
  return src(`src/${preprocessor}/*.${preprocessor}`)
    .pipe(sass().on("error", sass.logError))
    .pipe(
      rename({
        suffix: "-ext",
      })
    )
    .pipe(autoprefixer())
    .pipe(dest("src/css"));
}

// gulp.task("styles", function () {
//   return gulp
//     .src("src/sass/*.+(scss|sass)")
//     .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
//     .pipe(
//       rename({
//         prefix: "",
//         suffix: ".min",
//       })
//     )
//     .pipe(autoprefixer())
//     .pipe(cleanCSS({ compatibility: "ie8" }))
//     .pipe(gulp.dest("src/css"))
//     .pipe(browserSync.stream());
// });

function startWatch() {
  watch(`src/${preprocessor}/*.${preprocessor}`, styles);
  watch(`src/${preprocessor}/*.${preprocessor}`, stylesExt);
  watch("src/*.html").on("change", browserSync.reload);
}

// gulp.task("watch", function () {
//   gulp.watch("src/sass/*.+(scss|sass)", gulp.parallel("styles"));
//   gulp.watch("src/*.html").on("change", browserSync.reload);
// });

// gulp.task("default", gulp.parallel("watch", "server", "styles"));
exports.default = parallel(styles, stylesExt, serverOn, startWatch);