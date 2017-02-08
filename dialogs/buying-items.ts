import * as builder from "botbuilder";

export class BuyingItems {
    public dialog() : builder.IDialogWaterfallStep[] {
        return [
            (session, args, next) => {
                session.send("**We accept good quality:**\n\nClean and tidy re-usable clothes, Perfumes, Paired shoes, Handbags, Belts, Cosmetics, Jewelry & Soft toys\n\n**Unfortunately, we don't accept:**\n\nBad quality, wet, ripped clothes, Duvets, Books, Pillows, Bric-a-brac, Bedding, Glass, Bad quality, ripped shoes, Heavy curtains, Carpets & Metal");
            }
        ]
    }
}