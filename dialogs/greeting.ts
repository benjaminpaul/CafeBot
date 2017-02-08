import * as builder from "botbuilder";

export class Greeting {
    public dialog() : builder.IDialogWaterfallStep[] {
        return [
            (session, args, next) => {
                session.userData = null;     
                session.send("Hello :) Welcome to Cash 4 Clothes, I am a chat bot who is here to help you.\n\nIf you get stuck, just ask for help at any time :)");
                var card = new builder.HeroCard(session)
                .title("How can I help?")
                .buttons([
                    builder.CardAction.postBack(session, "I want you to collect some clothes", "I have clothes for you"),
                    builder.CardAction.postBack(session, "Nearest outlet", "Where are your shops?"),
                    builder.CardAction.postBack(session, "What do you accept?", "What do you accept")
                ]);

                var message = new builder.Message(session).addAttachment(card);
                session.send(message);
            }
        ]
    }
}