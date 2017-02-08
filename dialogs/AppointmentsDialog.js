"use strict";
var AppointmentsDialog = (function () {
    function AppointmentsDialog() {
    }
    AppointmentsDialog.dialog = function () {
        return [
            function (session, args, next) {
                session.send("No problem at all.");
            }
        ];
    };
    return AppointmentsDialog;
}());
exports.AppointmentsDialog = AppointmentsDialog;
//# sourceMappingURL=AppointmentsDialog.js.map