"use strict";
var Thanks = (function () {
    function Thanks() {
    }
    Thanks.prototype.dialog = function () {
        return [
            function (session, args, next) {
                session.send(["No problem at all :)", "Anytime :)", "You are welcome"]);
            }
        ];
    };
    return Thanks;
}());
exports.Thanks = Thanks;
//# sourceMappingURL=thanks.js.map