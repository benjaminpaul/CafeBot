import * as builder from "botbuilder";

export class Prices {
    public dialog() : builder.IDialogWaterfallStep[] {
        return [
            (session, args, next) => {
                session.send("We pay 50p per KG, £5.00 per 10KG and £500 per tonne. There is no minimum weight or price.")
            }
        ]
    }   
}