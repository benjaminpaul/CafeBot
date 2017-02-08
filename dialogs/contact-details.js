"use strict";
var ContactDetails = (function () {
    function ContactDetails() {
    }
    ContactDetails.prototype.dialog = function () {
        return [
            function (session, args, next) {
                session.send("**Our contact details are:**\n\nOutside of Bristol:\n\n" +
                    "**Call:** 01708 689 985\n\n" +
                    "**Text:** 07519 774 277\n\n" +
                    "Bristol Area:\n\n" +
                    "**Call:** 01708 689 984\n\n" +
                    "**Text:** 07514 030 630");
            }
        ];
    };
    return ContactDetails;
}());
exports.ContactDetails = ContactDetails;
//# sourceMappingURL=contact-details.js.map