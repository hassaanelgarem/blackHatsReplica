"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("@angular/router");
const dummy_component_1 = require("./dummy/dummy.component");
const business_component_1 = require("./business/business.component");
const APP_ROUTES = [
    { path: 'business', component: business_component_1.BusinessComponent },
    { path: 'dummy', component: dummy_component_1.DummyComponent }
];
exports.routing = router_1.RouterModule.forRoot(APP_ROUTES);
