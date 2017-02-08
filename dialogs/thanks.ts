import * as builder from "botbuilder";

export class Thanks {
    public dialog() : builder.IDialogWaterfallStep[] {
        return [
            (session, args, next) => {
                session.send(["No problem at all :)", "Anytime :)", "You are welcome"]);
            }
        ]
    }
}