import 'core-js/es6';
import 'core-js/es7/reflect';
require('zone.js/dist/zone');
require("font-awesome-webpack");

if (process.env.ENV === 'production') {
    //production
} else {
    //developement
    Error['stackTraceLimit'] = Infinity;
    require('zone.js/dist/long-stack-trace-zone');
}
