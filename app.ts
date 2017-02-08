import { Thanks } from './dialogs/thanks';
import { ContactDetails } from './dialogs/contact-details';
import { BuyingItems } from './dialogs/buying-items';
import { CancelAppointment } from './dialogs/cancel-appointment';
import { Greeting } from './dialogs/greeting';
import { CollectionAreas } from './dialogs/collection-area';
import { Prices } from './dialogs/prices';
import { Outlets } from './dialogs/outlets';
import { PostcodeService } from './services/postcode-service';
import * as restify from "restify";
import * as builder from "botbuilder";
import * as data from "./data";

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

var model = process.env.LUIS_MODEL;
var recognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog("/", intents);

//////////////////////////////////////////////
// Intents
//////////////////////////////////////////////
intents.matches("None", [
    (session, args, next) => {
        session.send("Sorry, I don't understand what you mean by that.");
    }
])

intents.matches("Greeting", new Greeting().dialog());
intents.matches("Prices", new Prices().dialog());
intents.matches("OutletLocations", new Outlets().dialog());
intents.matches("CheckCollectionArea", new CollectionAreas().dialog());
intents.matches("AppointmentCancel", new CancelAppointment().dialog());
intents.matches("BuyingItemsList", new BuyingItems().dialog());
intents.matches("ContactDetails", new ContactDetails().dialog());
intents.matches("Thank", new Thanks().dialog());

//////////////////////////////////////////////
// Organise a collection
//////////////////////////////////////////////
intents.matches("OrganiseCollection", [
    (session, args, next) => {
        var postcode = builder.EntityRecognizer.findEntity(args.entities, "Postcode");
        if (postcode) {
            session.userData.latestPostcode = postcode.entity;
        }
        session.send("No problem, lets get a little information from you...");
        session.beginDialog("/OrganiseCollection", session.dialogData.collection);
    },
    (session, results) => {
        session.send("Thank you, we have your details and will see you soon.")
    }
]);

//////////////////////////////////////////////
// Collection dialog.
//////////////////////////////////////////////
bot.dialog("/OrganiseCollection", [
    (session, args, next) => {
        session.dialogData.collection = args || {};

        if (!session.dialogData.collection.postcode) {
            // Yep! Good news!
            if (session.userData.latestPostcode) {
                next({ response: session.userData.latestPostcode });
            } else {
                // Nope... ask for it.
                builder.Prompts.text(session, "What is your postcode?");
            }
        } else {
            next();
        }
    },
    (session, results, next) => {
        if (results.response) {
            var deliveryDay = new PostcodeService().getSomething(results.response);
            if (deliveryDay) {
                session.send("We collect from " + results.response + " on " + deliveryDay.collectionDay);
            } else {
                session.send("We currently dont collect from that postcode, however you can always drop it to us at one of our outlets.");
            }
            session.dialogData.collection.postcode = results.response;
        }

        if (!session.dialogData.collection.type) {
            builder.Prompts.choice(session, "Would you like us to collect it? (Collection) or are you happy to drop it into one of our outlets? (Delivery)", ["Collection", "Delivery"]);
        }
    },
    (session, results, next) => {
        if (results.response) {
            session.dialogData.collection.type = results.response.entity;
        }

        if (session.dialogData.collection.type === "Collection") {
            if (!session.dialogData.collection.address) {
                builder.Prompts.text(session, "No problem at all, what is the full address we should collect from?");
            }
        }
    },
    (session, results, next) => {

        if (results.response) {
            session.dialogData.collection.address = results.response;
        }

        if (!session.dialogData.collection.phone) {
            builder.Prompts.number(session, "What contact telephone number can we use to contact you?");
        }
    },
    (session, results, next) => {
        
        if (results.response) {
            session.dialogData.collection.phone = results.response;
        }

        if (!session.dialogData.fundsforschools) {
            builder.Prompts.choice(session, "Would you like to donate the proceeds to Funds4Schools?", ["Yes", "No"]);
        }
    },
    (session, results, next) => {
        if (results.response) {
            session.dialogData.fundsforschools = results.response;
        }

        session.endDialogWithResult({ response: session.dialogData.collection });
    }
]);

