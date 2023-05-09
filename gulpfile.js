// open shell terminal with gulp to access webpack
const { src, dest, series, parallel, watch } = require("gulp");
let exec = require("child_process").exec;
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const imagemin = require("gulp-imagemin");
const ejs = require('gulp-ejs');
const browserSync = require("browser-sync").create();
// const reload = browserSync.reload;
// rename template file types to html
const rename = require('gulp-rename');
const gulpEdge = require("gulp-edgejs");

const images = () => {
  return (src("./src/img/**/*.+(jpg|jpeg|svg|png|gif)")
    // return (src("./resources/assets/img/**/*.+(jpg|jpeg|svg|png|gif)")
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        // imagemin.jpegtran({ progressive: true })
        imagemin.mozjpeg({ quality: 70, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
        })
      ])
    )
    .pipe(dest("./dist/img"))
    .pipe(browserSync.stream())
  )
}

const styles = () => {
  return (
    src("./src/sass/styles.scss")
      // src("./resources/assets/sass/**/*.scss")
      // .pipe(wait(5000))
      // .pipe(sass().on("error", sass.logError))
      .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
      .pipe(
        autoprefixer({
          cascade: false
          // browsers: ['last 2 versions']
        })
      )
      .pipe(dest("./dist/css"))
      .pipe(browserSync.stream())
  );
}

const server = () => {
  browserSync.init({
    server: "./dist",
    notify: false,
    open: false //set to true to start server automatically in browser
    // injectChanges: false
  });
}

// run if running another localhost live-server
const serverProxy = () => {
  browserSync.init({
    proxy: {
      target: "http://localhost:3333/", // can be [virtual host, sub-directory, localhost w/port]
      ws: true, // enables websockets
    },
    // serveStatic: [".", "./dist"]
  });
};

// run webpack development mode - compile js only
// * if creating html emails or static sites then comment out the webpackDev section & use the alternative default method
let webpackDev = (cb) => {
  return exec("npm run webpack-dev", (err, stdout, stderr) => {
    console.log(`stdout: ${stdout}`);
    console.log(`Something Happened -- stderr: ${stderr}`);
    cb(`exec err: ${err}`);
  })
}

// run webpack production mode - compile build for final publication
const webpackProd = (cb) => {
  return exec("npm run webpack-build", (err, stdout, stderr) => {
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    cb(`exec err: ${err}`);
  })
}

// generate html from templating engines link ejs, handlebars, edge (adonisjs), not required to use with adonis when running watchProxy, thus ignore staticDev
const views = () => {
  return (
    // change file type to one you are working with
    // src([
      // './src/views/**/*.edge', // ---
      // './resources/views/**/*.edge',
      // '!src/views/{layouts,layouts/**}', // ---
      // '!src/views/{includes,includes/**}' // ---
    // ])
    // .pipe(gulpEdge()) // ---
    // .pipe(dest('./dist/')) // ---
    // convert ejs/pug/etc into html
    // src('./assets/views/**/*.html')
    src('./src/views/**/*.ejs')
    // src('./assets/views/**/*.ejs')
    .pipe(ejs({async: true}))
    .pipe(rename({extname: '.html'}))
    // .pipe(dest('./public/views'))
    .pipe(dest('./dist'))
  )
}
    
// this is the default gulp command
// const watchAll = async () => {
// reloads twice may need to apply series()
const watchAll = (cb) => {
  server() // --- use this
  watch("./src/sass/**/*.scss", styles); // --- use this
  watch("./src/sass/styles.scss", styles); // --- use this
  // watch("./src/sass/**/*.scss", series(styles, reload));
  // watch("./src/js/**/*.js", series(webpackDev, reload));
  watch("./src/js/**/*.js", webpackDev); // * --- use this, if creating html emails or static sites then comment out
  // watch("./resources/assets/js/**/*.js", webpackDev);
  watch([
    "./dist/*",
    "./dist/**/*",
    "./src/*",
    "./src/**/*",
    "./src/views/**/*",
    "./resources/**/*",
    "./resources/assets/**/*",
    "./resources/views/**/*"
    // waatch for any files that are not js or css
    // '!public/js/**/.#*js',
    // '!public/css/**/.#*css'
  ])
    .on("change", browserSync.reload);
    // .on("change", series(styles, webpackDev, reload));
  // done();
  cb();
}

// const reload = () => {
//   browserSync.reload();
//   // done();
// }

// run this task when running another backend like PHP or another server (localhost) as with Adonisjs...
const watchProxy = () => {
  serverProxy()
  watch("./src/sass/**/*.scss", styles);
  // watch("./resources/assets/sass/**/*.scss", styles);
  watch("./src/js/**/*.js", webpackDev);
  // watch("./resources/assets/js/**/*.js", webpackDev);
  watch([
    "./dist/*",
    "./dist/**/*",
    "./src/*",
    "./src/**/*",
    "./src/views/**/*",
    "./resources/**/*",
    "./resources/assets/**/*",
    "./resources/views/**/*"
  ])
    .on("change", browserSync.reload);
  // done();
}
// for static builds (using templating engines such as ejs or pug) also has live server reload
const watchStaticDev = () => {
  server()
  // serverProxy()
  watch("./src/sass/**/*.scss", styles); // --- use this
  watch("./src/sass/styles.scss", styles);
  watch("./src/views/**/*", views);
  // watch("./assets/sass/**/*.scss", styles);
  // watch("./assets/js/**/*.js", webpackDev);
  watch("./src/js/**/*.js", webpackDev);
  // watch(["./public/**/*", "./public/*", "./resources/views/**/*"]).on("change", browserSync.reload);
  watch([
    "./dist/*",
    "./dist/**/*",
    "./src/*",
    "./src/**/*",
    "./src/views/**/*",
    // "./resources/**/*",
    // "./resources/assets/**/*",
    // "./resources/views/**/*"
  ])
    .on("change", browserSync.reload);
  // done();
}

// production built for application (best for webpack build to handle independently)
// const build = (cb) => {
// series(images, styles, webpackProd)
// webpackProd // webpack compiles everything
// cb();
// }

// generate site in developent mode, includes live-server
// const staticDev = (cb) => {
// parallel(series(views, webpackDev, styles, watchStaticDev), server);
// i get the forget async completion error
// series(views, webpackDev, styles, watchStaticDev);
// cb();
// }

// generate static site final build for publication
// const staticBuild = (cb) => {
// series(views, styles, webpackProd)
// series(parallel(views, styles), webpackProd);
// cb();
// }

exports.images = images;
exports.styles = styles;
exports.views = views;
// optional, comment out image and styles for webpack to handle independently or 'npm run webpack-build' command
// if using Gulp & Webpack, run this to compile prod build
exports.build = series(
  webpackProd, styles, images
);
exports.staticDev = series(
  views, webpackDev, styles, watchStaticDev
);
// exports.staticDevProxy = series(
  // views, webpackDev, styles, watchStaticDev
// );
exports.staticBuild = series(
  webpackProd, views, styles
);
exports.watchProxy = series(
  webpackDev, styles, watchProxy
);
// exports.watchStaticDev = watchStaticDev;
// exports.default = watchAll;
exports.default = series(
  webpackDev, styles, watchAll
);
// * use this default if creating static sites or html emails
// exports.default = series(
//   styles, watchAll
// );


		// function cleanUrl() {
		// 	return gulp
		// 		.src('temp/**/*.html')
		// 		.pipe(prettyUrl())
		// 		.pipe(gulp.dest('public'));
		// }
// 	)
// );
// Delete Your Temp Files
// gulp.task(
// 	'cleanTemp',
// 	gulp.series(() => {
// 		return del([
// 			'./temp'
// 			//   '!public/img/**/*'
// 		]);
// 	})
// );

// *** ORIGINAL - COPY OF MY PERSONAL SETUP
// // open shell terminal with gulp to access webpack
// const { src, dest, series, parallel, watch } = require("gulp");
// let exec = require("child_process").exec;
// const sass = require("gulp-sass");
// const autoprefixer = require("gulp-autoprefixer");
// const imagemin = require("gulp-imagemin");
// const ejs = require('gulp-ejs');
// const browserSync = require("browser-sync").create();
// // const reload = browserSync.reload;
// // rename template file types to html
// const rename = require('gulp-rename');
// const gulpEdge = require("gulp-edgejs");

// const images = () => {
//   return (src("./src/img/**/*.+(jpg|jpeg|svg|png|gif)")
//   // return (src("./resources/assets/img/**/*.+(jpg|jpeg|svg|png|gif)")
//   .pipe(
//     imagemin([
//       imagemin.gifsicle({ interlaced: true }),
//       imagemin.mozjpeg({ quality: 70, progressive: true }),
//       imagemin.optipng({ optimizationLevel: 5 }),
//       imagemin.svgo({
//         plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
//       })
//     ])
//   )
//   .pipe(dest("./dist/img"))
//   .pipe(browserSync.stream())
// )
// }

// const styles = () => {
// return (
//   src("./src/sass/styles.scss")
//     // src("./resources/assets/sass/**/*.scss")
//     // .pipe(wait(5000))
//     // .pipe(sass().on("error", sass.logError))
//     .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
//     .pipe(
//       autoprefixer({
//         cascade: false
//         // browsers: ['last 2 versions']
//       })
//     )
//     .pipe(dest("./dist/css"))
//     .pipe(browserSync.stream())
// );
// }

// const server = () => {
// browserSync.init({
//   server: "./dist",
//   notify: false,
//   open: false //set to true to start server automatically in browser
//   // injectChanges: false
// });
// }

// // run if running another localhost live-server
// const serverProxy = () => {
// browserSync.init({
//   proxy: {
//     target: "http://localhost:3333/", // can be [virtual host, sub-directory, localhost w/port]
//     ws: true, // enables websockets
//   },
//   // serveStatic: [".", "./dist"]
// });
// };

// // run webpack development mode - compile js only
// let webpackDev = (cb) => {
// return exec("npm run webpack-dev", (err, stdout, stderr) => {
//   console.log(`stdout: ${stdout}`);
//   console.log(`Something Happened -- stderr: ${stderr}`);
//   cb(`exec err: ${err}`);
// })
// }

// // run webpack production mode - compile build for final publication
// const webpackProd = (cb) => {
// return exec("npm run webpack-build", (err, stdout, stderr) => {
//   console.log(`stdout: ${stdout}`);
//   console.log(`stderr: ${stderr}`);
//   cb(`exec err: ${err}`);
// })
// }

// // generate html from templating engines link ejs, handlebars, edge (adonisjs), not required to use with adonis when running watchProxy, thus ignore staticDev
// const views = () => {
// return (
//   // change file type to one you are working with
//   // src([
//     // './src/views/**/*.edge', // ---
//     // './resources/views/**/*.edge',
//     // '!src/views/{layouts,layouts/**}', // ---
//     // '!src/views/{includes,includes/**}' // ---
//   // ])
//   // .pipe(gulpEdge()) // ---
//   // .pipe(dest('./dist/')) // ---
//   // convert ejs/pug/etc into html
//   // src('./assets/views/**/*.html')
//   src('./src/views/**/*.ejs')
//   // src('./assets/views/**/*.ejs')
//   .pipe(ejs({async: true}))
//   .pipe(rename({extname: '.html'}))
//   // .pipe(dest('./public/views'))
//   .pipe(dest('./dist'))
// )
// }
  
// // this is the default gulp command
// // const watchAll = async () => {
// // reloads twice may need to apply series()
// const watchAll = (cb) => {
// server() // --- use this
// watch("./src/sass/**/*.scss", styles); // --- use this
// watch("./src/sass/styles.scss", styles); // --- use this
// // watch("./src/sass/**/*.scss", series(styles, reload));
// // watch("./resources/assets/sass/**/*.scss", styles); // --- usse this
// // watch("./src/js/**/*.js", series(webpackDev, reload));
// watch("./src/js/**/*.js", webpackDev);
// // watch("./resources/assets/js/**/*.js", webpackDev);
// watch([
//   "./dist/*",
//   "./dist/**/*",
//   "./src/*",
//   "./src/**/*",
//   "./src/views/**/*",
//   "./resources/**/*",
//   "./resources/assets/**/*",
//   "./resources/views/**/*"
//   // waatch for any files that are not js or css
//   // '!public/js/**/.#*js',
//   // '!public/css/**/.#*css'
// ])
//   .on("change", browserSync.reload);
//   // .on("change", series(styles, webpackDev, reload));
// // done();
// cb();
// }

// // const reload = () => {
// //   browserSync.reload();
// //   // done();
// // }

// // run this task when running another backend like PHP or another server (localhost) as with Adonisjs...
// const watchProxy = () => {
// serverProxy()
// watch("./src/sass/**/*.scss", styles);
// // watch("./resources/assets/sass/**/*.scss", styles);
// watch("./src/js/**/*.js", webpackDev);
// // watch("./resources/assets/js/**/*.js", webpackDev);
// watch([
//   "./dist/*",
//   "./dist/**/*",
//   "./src/*",
//   "./src/**/*",
//   "./src/views/**/*",
//   "./resources/**/*",
//   "./resources/assets/**/*",
//   "./resources/views/**/*"
// ])
//   .on("change", browserSync.reload);
// // done();
// }
// // for static builds (using templating engines such as ejs or pug) also has live server reload
// const watchStaticDev = () => {
// server()
// // serverProxy()
// watch("./src/sass/**/*.scss", styles); // --- use this
// watch("./src/sass/styles.scss", styles);
// watch("./src/views/**/*", views);
// // watch("./assets/sass/**/*.scss", styles);
// // watch("./assets/js/**/*.js", webpackDev);
// watch("./src/js/**/*.js", webpackDev);
// // watch(["./public/**/*", "./public/*", "./resources/views/**/*"]).on("change", browserSync.reload);
// watch([
//   "./dist/*",
//   "./dist/**/*",
//   "./src/*",
//   "./src/**/*",
//   "./src/views/**/*",
//   // "./resources/**/*",
//   // "./resources/assets/**/*",
//   // "./resources/views/**/*"
// ])
//   .on("change", browserSync.reload);
// // done();
// }

// // production built for application (best for webpack build to handle independently)
// // const build = (cb) => {
// // series(images, styles, webpackProd)
// // webpackProd // webpack compiles everything
// // cb();
// // }

// // generate site in developent mode, includes live-server
// // const staticDev = (cb) => {
// // parallel(series(views, webpackDev, styles, watchStaticDev), server);
// // i get the forget async completion error
// // series(views, webpackDev, styles, watchStaticDev);
// // cb();
// // }

// // generate static site final build for publication
// // const staticBuild = (cb) => {
// // series(views, styles, webpackProd)
// // series(parallel(views, styles), webpackProd);
// // cb();
// // }

// exports.images = images;
// exports.styles = styles;
// exports.views = views;
// // optional, comment out image and styles for webpack to handle independently or 'npm run webpack-build' command
// // if using Gulp & Webpack, run this to compile prod build
// exports.build = series(
// webpackProd, styles, images
// );
// exports.staticDev = series(
// views, webpackDev, styles, watchStaticDev
// );
// // exports.staticDevProxy = series(
// // views, webpackDev, styles, watchStaticDev
// // );
// exports.staticBuild = series(
// webpackProd, views, styles
// );
// exports.watchProxy = series(
// webpackDev, styles, watchProxy
// );
// // exports.watchStaticDev = watchStaticDev;
// // exports.default = watchAll;
// exports.default = series(
// webpackDev, styles, watchAll
// );


//   // function cleanUrl() {
//   // 	return gulp
//   // 		.src('temp/**/*.html')
//   // 		.pipe(prettyUrl())
//   // 		.pipe(gulp.dest('public'));
//   // }
// // 	)
// // );
// // Delete Your Temp Files
// // gulp.task(
// // 	'cleanTemp',
// // 	gulp.series(() => {
// // 		return del([
// // 			'./temp'
// // 			//   '!public/img/**/*'
// // 		]);
// // 	})
// // );