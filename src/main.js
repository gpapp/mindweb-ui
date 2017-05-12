"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
const environment_1 = require("./app/environment");
const hmr_1 = require("@angularclass/hmr");
const app_1 = require("./app/app");
/*
 * Bootstrap our Angular app with a top level NgModule
 */
function main() {
    return platform_browser_dynamic_1.platformBrowserDynamic()
        .bootstrapModule(app_1.AppModule)
        .then(environment_1.decorateModuleRef)
        .catch((err) => console.error(err));
}
exports.main = main;
// needed for hmr
// in prod this is replace for document ready
hmr_1.bootloader(main);
//# sourceMappingURL=main.js.map