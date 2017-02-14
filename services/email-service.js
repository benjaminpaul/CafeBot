"use strict";
var sendgrid = require("sendgrid");
var EmailService = (function () {
    function EmailService() {
    }
    EmailService.prototype.sendAppointmentEmail = function (appointment) {
        var sg = sendgrid(process.env.SENDGRID);
        var to = new sendgrid.mail.Email("ben.paul@just-eat.com");
        var from = new sendgrid.mail.Email("benjaminpaul1984@googlemail.com");
        var subject = "Scheduled Appointment from Bot";
        var content = new sendgrid.mail.Content('text/plain', 'Hello, Email!');
        var mail = new sendgrid.mail.Mail(from, subject, to, content);
        var r = sg.emptyRequest();
        r.method = "POST";
        r.path = "/v3/mail/send";
        r.body = mail.toJSON();
        sg.API(r, function (response) { });
    };
    return EmailService;
}());
exports.EmailService = EmailService;
//# sourceMappingURL=email-service.js.map