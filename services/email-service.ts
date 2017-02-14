import * as sendgrid from "sendgrid";

export class EmailService {
    public sendAppointmentEmail(appointment) {
        var sg = sendgrid(process.env.SENDGRID);
        
        var message = "Collect On: " + appointment.collectionDay + "\n\n"
            + "From Address: " + appointment.address + "\n\n"
            + "Contact Number: " + appointment.contactNumber + "\n\n"
            + "Funds 4 Schools: " + appointment.funds4schools

        var to = new sendgrid.mail.Email("ben.paul@just-eat.com");
        var from = new sendgrid.mail.Email("benjaminpaul1984@googlemail.com");
        var subject = "Scheduled Appointment from Bot"
        var content = new sendgrid.mail.Content('text/plain', message);
        var mail = new sendgrid.mail.Mail(from, subject, to, content);

        var r = sg.emptyRequest();
        r.method = "POST";
        r.path = "/v3/mail/send";
        r.body = mail.toJSON(); 
        sg.API(r, (response) => {});       
    }
}