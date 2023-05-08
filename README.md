# Setting up the Starter Pack
## Introduction
This developer kit is built primarily for MERN / PERN applications. Using both Gulp and Webpack to minify files, or you can opt to use only Webpack to minify and compile everything.

Gulp is more streamlined & easier to work with, but Webpack is very powerful. However, Webpack is a bit complex and the documentation is a bit verbose (its not beginner friendly). Only Gulp is equipped to work for static site development.

STARTING-OFF: A New Project With Webpack 5 ONLY & its dev-server?

It is recommended to run the following command first.
```
npm run webpack-dev
```
Then run the dev server:
```
npm run serve-webpack
```

Potential Errors:
Webpack dev server may not work properly if running in more than one tab. So no duplicate tabs! Also, before launching a new dev server, ensure that no previous server tabs are open. (I'm still trying to work out the kinks in Webpack 5).

If you immediatly run the dev server and "Cannot GET /" appears on screen OR if the screen is solid white, a hard refresh may be required (CTRL + SHIFT + R) in order to view contents on screen, if not restart the dev server (refer to above commands). However if also using Gulp, this may only create JavaScript bundles thus it is RECOMMENDED to delete the dist folder and follow the proper command order as laid out above!

If links to images are added and if the image is in the src/img folder and webpack does not reload to include the image into the dist folder (and if the image does not appear) - run the command (dev-server can be run simultaneously):
```
npm run images
```

Image should now be picked up / view by the dev server. If not perform a hard reload.
--------------------
--------------------
USING GULP & WEBPACK
--------------------
--------------------
To get started with the default setup use: 
```bash
  npm intall
  npm run watch
```

The default setup is to use Gulp for minify / compile images, html, ejs (for static development) and scss. Meanwhile Webpack will minify and bundle JS files. This setup is compatible with react components. However there are a few thing to keep in mind:
  * Images must be referenced inline. Such as within an <img/> tag. This applies to react components as well. The image url links to the image from within the structure of dist/public folder as the code and images compile there. 
  * If using react components be sure that the root div (in the './dist/index.html' file) has a class and not classname. Otherwise CSS will not be compiled properly.
  * By default certain sections within the Webpack dev file will be commented out as they conflict with GulpJS compilations. If you decide to uncomment such sections, be sure to not use Gulp. Use Webpack (only) for the development process via the 'npm run serve-webpack' command.
  * The production build webpack file will be used for the final build. This can be changed to comment out certain parts, allowing for the use of Gulp instead. Webpack will simply compile the JavaScript instead of everything.
  * The Webpack and Gulp Live Server looks into the dist folder. So keep the structure of the dist folder in mind when refering to certain files. Like linking index.html to css and img tags to the img folder.

If switching over from Gulp and Webpack to just Webpack be sure to change the root div element class to className and if also implementing React components, be sure to import both SCSS and images from within the App.js component. Comment out any inline img tag urls (they conflict). Instead place imported image variables as props to img tags. 


This start-up pack can be setup to work with other frameworks such as Adonis and other templating engines (such as ejs) to build static websites.

NOTE: Webpack is recommended for working with React projects (its  much more faster). Gulp is recommended for working with projects that involve vanillaJS and especially template engines. Gulp can be used for React projects however reloading the live-server can be slower.

P.S. Gulp seems to render twice, using Webpack for the second render. Will seperate Gulp and Webpack live-servers in order to acheive faster compiling and rendering.

## Setup for AdonisJS Framework
Create a new adonis project folder, then import the following files from the dev-startpack into the root directory of the adonis project folder: gulpfile.js, .babelrc, webpack.dev.js, webpack.prod.js, and copy the devDependencies and dependencies from the startup pack into the package.json file of the adonis project.

Then import the index.js file used to implement react from the startup into the resources/assets/js directory of the adonis project folder. Then in the welcome.edge file in the resources folder, make a script tag that links to the index.js file in the public folder (as it will appear there when compiling code in dev mode).

Run:
```
npm install
```

Then run:
```
adonis serve --dev
```
Adonis should run live-server in localhost:3333/

Now run:
```
npm run proxy
```
A proxy server runs in localhost:3000

## Begin Setup - For ExpressJS Framework Mern
Begin with the installation of node.

Once downloaded and installed into your machine download or clone this folder from the repo.

Download and install vsCode or Atom.

## Make sure Node and NPM are installed:

```bash
Node -v
NPM -v
```

## Install Node Packages Using NPM
Run the Following NPM Commands in a bash terminal of your choice, do so while in the root directory of the project folder:

```bash
    npm install gulp-cli -g
    npm install
```
The installation process should be simple as the packages.json file already contains the necessary package setup.

## Make sure Gulp and Webpack are installed:
```bash
    gulp -v    
    webpack -v
```

# Now Run the Starter Pack Development Server
## Development Mode
Gulp provides the live server. Webpack compiles our javascript code. This setup is for MERN applications. Gulp and Webpack run in development mode.

### Start the dev server
```bash
  npm run watch
```
Run default development mode. Compiles SASS to CSS, compiles JS with Webpack and Gulp runs Live Server at localhost 3000. 

### Start proxy dev server
localhost can run alongside another live server, such as when using live server provided by adonisJS (adonis serve --dev), use this instead of utilizing staticDev for better performance. Live-reload is provided. Can also run React components inside your adonisJs applications. Another loccalhost server must be active on 3333 before running this script command.

Have the index.html / welcome.edge file point to the public directory of the index.js file to enable react. Must also have a <div id="app">.</div> By default there should be a compiled index.html or welcome.html file in the public folder for the live-server to connect properly.
```bash
  npm run proxy
```
### Start static development
Run this mode instead if using another type of framework such as AdonisJS. This way templating engines and their files (such as ejs or edge) are compiled to make static oriented websites. If you get an error regarding not reading style function, in the index/welcome file erase the {{style('style')}} and instead use a <link href='style.css'>; it seems that manual linking way need to be used as adonis syntax may not be parsed properly.
```bash
  npm run staticDev
```

### Compile images using gulp
```bash
   npm run images
```

## Build Mode
### Build files for production
```bash
  npm run build
```

### Run webpack in build mode to compile all javascript assets and all other assets (images, html and scss included). For static webpages.
```bash
  npm run staticBuild
```

## Webpack Only Commands
### Webpack Live Server in Development Mode
```bash
npm run start-dev
```
(Not used anymore)

### Run Webpack Live Server (config to dev mode)
```bash
npm run serve-webpack
```

### Run Webpack Development Mode and Compile JS Assets
```bash
npm run webpack-dev
```

### Run Webpack Build Mode and Compile all Project Assets into a Dist Folder
```bash
npm run webpack-build
```

## Nodemon Server
```bash
npm run server
```
Good for running backend with a database. Be sure to use a proxy built in with either Gulp or Webpack.