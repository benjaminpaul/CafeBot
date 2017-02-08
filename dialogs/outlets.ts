import * as builder from "botbuilder";

export class Outlets {
    public dialog() : builder.IDialogWaterfallStep[] {
        return [
            (session, args, next) => {
                session.send("We have a number of outlets, let me just grab their details for you.");
                var reply = new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.carousel)
                .attachments(Outlets.getOutletCards(session));
                session.send(reply);
            }
        ]
    }

    private static getOutletCards(session) : builder.ThumbnailCard[] {
        var logo = new builder.CardImage(session).url("https://static.wixstatic.com/media/b93b43_864e7ab4be334d6da31a6edbcb24a43b~mv2.jpg/v1/fill/w_560,h_246,al_c,q_80,usm_0.66_1.00_0.01/b93b43_864e7ab4be334d6da31a6edbcb24a43b~mv2.webp").alt("Cash 4 Clothes").toImage();
        return [
            new builder.ThumbnailCard(session)
            .images([logo])
            .title("Fishponds Road")
            .text("629 Fishponds Road, Fishponds, Bristol BS16 3BA"),
            new builder.ThumbnailCard(session)
            .images([logo])
            .title("Lockleaze Road")
            .text("Lockleaze Road, Bristol BS7 9RU"),
            new builder.ThumbnailCard(session)
            .images([logo])
            .title("Southmead Road")
            .text("331A Southmead Road, Westbury-on-Trym, Bristol, BS10 5LW"),
            new builder.ThumbnailCard(session)
            .images([logo])
            .title("Brislington")
            .text("Unit 1A, Carrick Business Centre, 4-5 Bonville Road, Brislington, Bristol BS4 5NZ"),
            new builder.ThumbnailCard(session)
            .images([logo])
            .title("Weston-Super-Mare")
            .text("64 Moorland Road, Weston-Super-Mare, North Somerset BS23 4HT")
        ];
    }
}