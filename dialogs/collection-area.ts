import { PostcodeService } from './../services/postcode-service';
import * as builder from 'botbuilder';

export class CollectionAreas {
    public dialog() : builder.IDialogWaterfallStep[] {
        return [
            (session, args, next) => {
                var intent = args.intent;
                var postcode = builder.EntityRecognizer.findEntity(args.entities, "Postcode");

                if (postcode) {
                    var collectionData = new PostcodeService().getSomething(postcode.entity);
                    if (collectionData) {
                        session.send("Yes! We collect from " + postcode.entity + " on " + collectionData.collectionDay);
                    } else {
                        session.send("Sorry, at the moment it doesnt look like we collect from that postcode :(");
                    }
                } else {
                    session.send("No postcode detected.");
                }
            }
        ]
    }
}