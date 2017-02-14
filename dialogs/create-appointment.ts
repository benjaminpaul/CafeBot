import { PostcodeService } from './../services/postcode-service';
import { CancelAppointment } from './cancel-appointment';
import { Outlets } from './outlets';
import * as builder from "botbuilder";

export const dialog : builder.IDialogWaterfallStep[] = [
    (session, args, next) => {
        session.dialogData.appointment = args || {};

        if (!session.dialogData.appointment.type) {
            builder.Prompts.choice(session, "Would you like to drop it off or have us collect from you?", ["Drop Off", "Collect"]);
        }
    },
    (session, results, next) => {
        if (results.response) {
            session.send(results.response.entity);
            session.dialogData.appointment.type = results.response.entity;
            if (results.response.entity === "Drop Off") {
                session.send("No problem at all, we have a number of outlets you can visit, let me just get them for you.");
                var reply = new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments(Outlets.getOutletCards(session));
                session.send(reply);
                session.endDialogWithResult({ response: session.dialogData.appointment });
            } else {
                new builder.Prompts.text(session, "What is your postcode?");
            }
        }
    },
    (session, results, next) => {
        if (results.response) {
            var postcode = results.response;
            if (postcode.length < 6) {
                next({ resumed: builder.ResumeReason.back });
            } else {
                var delivery = new PostcodeService().getSomething(postcode);
                if (!delivery) {
                    session.send("Sorry, but it does not look like we collect from that postcode however you can always drop it off to one of our outlets.");
                    session.endDialogWithResult({ response: session.dialogData.appointment });
                } else {
                    session.dialogData.appointment.postcode = postcode;
                    new builder.Prompts.choice(session, "What day would you like us to collect it?", delivery.collectionDays);
                }
            }
        }
    },
    (session, results, next) => {
        if (results.response) {
            var collectionDay = results.response.entity;
            session.dialogData.appointment.collectionDay = collectionDay;
            var delivery = new PostcodeService().getSomething(session.dialogData.appointment.postcode);
            new builder.Prompts.confirm(session, "We collect that day between the hours of " + delivery.times + ", is that ok?");
        }
    },
    (session, results, next) => {
        if (results.response) {
            new builder.Prompts.text(session, "What is the address you want us to collect from?");
        } else {
            session.send("No problem, please remember you can always drop your items into one of our outlets, thanks for using Cash 4 Clothes.");
        }
    },
    (session, results, next) => {
        if (results.response) {
            var address = results.response;
            if (address.length < 10) {
                session.send("Please give me a valid address");
                next({ resumed: builder.ResumeReason.back });
            } else {
                new builder.Prompts.text(session, "What is your contact telephone number?");
            }
        }
    },
    (session, results, next) => {
        if (results.response) {
            var contactNumber = results.response;
            if (contactNumber.length < 9) {
                session.send("That does not look like a valid telephone number!");
                next({ resumed: builder.ResumeReason.back });   
            } else {
                session.dialogData.appointment.contactNumber = contactNumber;
                new builder.Prompts.confirm(session, "Would you like to donate the funds to Funds4Schools?");
            }
        }
    },
    (session, results, next) => {
        session.dialogData.appointment.funds4schools = results.response;
        if (results.response) {
            session.send("Thank you for your generosity :)");
        } else {
            session.send("Thank you.")
        }

        var message = "Here are the details of your collection:\n\n**Collect On:** " + session.dialogData.appointment.collectionDay + "\n\n";
        message = message + "**From Address:** " + session.dialogData.appointment.address + "\n\n";
        message = message + "**Contact Number:** " + session.dialogData.appointment.contactNumber + "\n\n";
        message = message + "**Funds 4 Schools:** " + session.dialogData.appointment.funds4schools ? "Yes" : "No"; 
        message = message + "\n\nIs this ok?";
        new builder.Prompts.confirm(session, message);
    },
    (session, results, next) => {
        session.send("Great! Thank you.");
    }
]