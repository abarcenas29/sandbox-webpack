# Sandbox Webpack Configuration

this is the webpack configuration for the `react-sandbox-v2` but it can also be used as webpack config for other projects aswell.

## Setup

You need to configure your `.env` file as it pulls the details for the folder structure of your project

* **SRC_FOLDER** - Normally either its `app` or `src`
* **WEBPACK_BUILD_FOLDER** - the folder name of the folder where the build files to be placed. It is either `static` or `build` and it is placed on the root directory of the project
* **WEBPACK_ENTRY_PATH** - the path of the file where the webpack will base its build. Normally it is `app.js` or `index.js`

