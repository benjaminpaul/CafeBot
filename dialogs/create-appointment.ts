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
            }
        }

        new builder.Prompts.text(session, "What is your postcode?");
    },
    (session, results, next) => {
        if (results.response) {
            var postcode = results.response;
            if (postcode.length < 6) {
                next({ resumed: builder.ResumeReason.back });
            } else {
                session.send("Looks good.");
                session.dialogData.appointment.postcode = postcode;
                session.endDialogWithResult({ response: session.dialogData.appointment });
            }
        }
    }
]