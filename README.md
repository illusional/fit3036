# Road Surface Area Estimation
Produced for Monash University during FIT3036 (Computer Science Project) Semester 1, 2018.

Produced by: _Michael Franklin_ <br />
Supervised by: _Dr. Rasika Amarasiri_

With the ever-increasing size of cities and their infrastructure, this project develops a tool that sources data from OpenStreetMaps in order to estimate the surface area of roads within a given bounding rectangle.

![Image of user interface of application](resources/user-interface.png)

## Quick Start Guide

```bash
# 1. Clone the project
git clone https://github.com/illusional/fit3036.git && cd fit3036

# 2. Install dependencies
npm install

# 3. Start web server
npm start -s
```

Then open a web browser to [http://localhost:3000](http://localhost:3000).

### Prerequisites
1. Ensure [NodeJS](https://nodejs.org/en/) and NPM is installed.
2. Open up Terminal / Command Prompt and change into the project's directory
3. Install all of the NPM packages by: `npm install` (listed below)

## Introduction

This introduction and subsequent information is taken from the submitted and completely comprehensive report: [Final Report](resources/report.pdf)

### Calculation

> Source: [`calculation.js`](https://github.com/illusional/fit3036/blob/master/src/processing/calculation.js)

The major component of this project is the ability to estimate the road surface area within some confined coordinate bounds, this first requires acquiring the data from a web-mapping provider and then processing the result. We query this data from a mirror of OpenStreetMap called Overpass. Overpass allows us to use a query to gain a narrow set of information, saving bandwidth and reducing the processing required by our server.

Overpass returns additional information outside the bounding box to give us enough context to correctly draw the map, so we introduce 3 calculation modes to allow the user to decide how to handle this:
- **Include**: Include all information returned by Overpass in the calculation, do not perform any filtering.
- **Intersect**: Intersect the road at the bounds by calcluating an intemediary point at the border and disregarding all other points outside.
- **Truncate**: Truncate the road to the nearest intersection.

The visual representation of these calcluations can be found in the images below (of Monash University):

|Include|Intersect|Truncate|
|-|-|-|
|![Include visual representation](resources/monash_incl.png)|![Intersect visual representation](resources/monash_inter.png)|![Truncate visual representation](resources/monash_trunceps.png)|

> NB: The report discusses the algorithm used for calculating a ray's intersection within the bounding box. Later, I realised that I'd essentially rederived [Cohen-Sutherland Line
Clipping](https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm).

#### Lanes and lane width

Lanes is a supported attribute of the OpenStreetMap API. By default the following values are used:

```javascript
// AUSTROADS (2016) Guide to Road Design Part 3: Geometric Design (4.2.4 Traffic Lane Widths - p. 44)
const DEFAULT_LANES = 2;
const DEFAULT_LANE_WIDTH = 3.5; //metres
const DEFAULT_ROAD_PADDING = 0.9; // metres
const DEFAULT_ROAD_WIDTH = DEFAULT_LANES * DEFAULT_LANE_WIDTH + DEFAULT_ROAD_PADDING;
```



## Notes:
This project used [Cory House](https://www.pluralsight.com/authors/cory-house)'s [React template](https://github.com/coryhouse/pluralsight-redux-starter), offered by [PluralSight](https://www.pluralsight.com/courses/react-redux-react-router-es6) as as a base patterning for a React application. This template assists in the support for babel and babel-polyfill for writing ES5 / ES6 that is compiled into a single page application. 

Some of the dependencies are derived from the base template, and other (such as react-router-redux) have been ommitted from the list has they're dependencies of React.

### Dependencies
| **Dependency** | **Use** |
|----------|-------|
|axios| Used to make network requests |
|babel-polyfill| Compiles any higher-level JS to browser understandable code |
|material-ui| React UI component library |
|material-ui-icons| Apart of material-ui |
|leaflet| Map Container view |
|react-number-format| Appropriately displays large numbers |
|react-places-autocomplete| Search places by address |
|redux| State management in React |
|xml2js| Parse XML response from OpenStreetMap |

### Development Dependencies
| **Dependency** | **Use** |
|----------|-------|
|babel|Javascript compiler for ES5+|
|cheerio|Supports querying DOM with jQuery like syntax - Useful in testing and build process for HTML manipulation|
|compression|Add gzip support to Express|
|cross-env|Cross platform support for environment variables|
|css-loader|Add CSS support to Webpack|
|enzyme|Simplified JavaScript Testing utilities for React|
|eslint|Lints JavaScript |
|eslint-plugin-import|Advanced linting of ES6 imports|
|eslint-plugin-react|Adds additional React-related rules to ESLint|
|eslint-watch|Add watch functionality to ESLint |
|eventsource-polyfill|Polyfill to support hot reloading in IE|
|expect|Assertion library for use with Mocha|
|express|Serves development and production builds|
|extract-text-webpack-plugin| Extracts CSS into separate file for production build | 
|file-loader| Adds file loading support to Webpack |
|jsdom|In-memory DOM for testing|
|mocha| JavaScript testing library |
|npm-run-all| Display results of multiple commands on single command line |
|react-addons-test-utils| Adds React TestUtils |
|redux-immutable-state-invariant|Warn when Redux state is mutated|
|redux-mock-store|Mock Redux store for testing|
|remote-redux-devtools| Debugging state with Redux |
|rimraf|Delete files |
|style-loader| Add Style support to Webpack |
|url-loader| Add url loading support to Webpack |
|webpack| Bundler with plugin system and integrated development server |
|webpack-dev-middleware| Adds middleware support to webpack |
|webpack-hot-middleware| Adds hot reloading to webpack |
