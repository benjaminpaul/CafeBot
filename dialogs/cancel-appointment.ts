import * as builder from "botbuilder";

export class CancelAppointment {
    public dialog() : builder.IDialogWaterfallStep[] {
        return [
            (session, args, next) => {
                builder.Prompts.text(session, "That is a shame, what was the postcode we were due to collect from?");
            },
            (session, results, next) => {
                if (results.response) {
                    session.dialogData.cancellation.postcode = results.response;
                }

                builder.Prompts.number(session, "What was your contact number we have for you?");
            },
            (session, results, next) => {
                if (results.response) {
                    session.dialogData.cancellation.number = results.response;
                }

                session.send("Thank you.");
                session.send("Postcode: " + session.dialogData.cancellation.postcode);
                session.send("Number: " + session.dialogData.cancellation.number);
            }
        ]
    }
}