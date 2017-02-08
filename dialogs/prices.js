"use strict";
var Prices = (function () {
    function Prices() {
    }
    Prices.prototype.dialog = function () {
        return [
            function (session, args, next) {
                session.send("We pay 50p per KG, £5.00 per 10KG and £500 per tonne. There is no minimum weight or price.");
            }
        ];
    };
    return Prices;
}());
exports.Prices = Prices;
//# sourceMappingURL=prices.js.map