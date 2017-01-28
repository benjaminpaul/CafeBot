"use strict";
var data = require("../data");
var PostcodeService = (function () {
    function PostcodeService() {
    }
    PostcodeService.prototype.getSomething = function (postcode) {
        var result;
        data.collectionDays.forEach(function (collectionDay) {
            collectionDay.postcodes.forEach(function (pc) {
                if (postcode.toUpperCase().substr(0, pc.length) === pc.toUpperCase()) {
                    result = collectionDay;
                    return;
                }
            });
            if (result) {
                return;
            }
        });
        return result;
    };
    return PostcodeService;
}());
exports.PostcodeService = PostcodeService;
//# sourceMappingURL=postcode-service.js.map