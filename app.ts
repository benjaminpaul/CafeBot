import * as restify from "restify";
import * as builder from "botbuilder";
import * as data from "./data";
import * as sendgrid from "sendgrid";

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID || "58b65693-1080-40e6-8f3f-5a6de6b697a2",
    appPassword: process.env.MICROSOFT_APP_PASSWORD || "VBOGPxkH1tXpidO6CesnV5u"
});

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

var model = process.env.LUIS_MODEL || "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/d8e9d06f-a80c-4887-983d-fd83594a6711?subscription-key=cd56d7b3af9240a5a2fb21dac2ae2bc3&verbose=true";
var recognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog("/", intents);


// Greeting.
intents.matches("Greeting", [
    (session, args, next) => {
        session.send("Hello there! Welcome to Cash 4 Clothes, I am a friendly chat bot who can help you find out about our services or even arrange a collection or delivery..\n\n")
        var card = new builder.HeroCard(session)
        .title("How can I help?")
        .buttons([
            builder.CardAction.postBack(session, "Do you collect from my postcode?", "Do you collect from my area?"),
            builder.CardAction.postBack(session, "Nearest outlet", "Where is your nearest outlet?"),
            builder.CardAction.postBack(session, "What is your phone number?", "Call Us")
        ]);

        var message = new builder.Message(session).addAttachment(card);
        session.send(message);
    }
]);

// Outlet Locations
intents.matches("OutletLocations", [
    (session, args, next) => {
        session.send("Locations carousel here");
    }
]);

// Check collection area.
intents.matches("CheckCollectionArea", [
    (session, args, next) => {
        var intent = args.intent;
        var postcode = builder.EntityRecognizer.findEntity(args.entities, "Postcode");

        if (postcode) {
            session.send("Here is your postcode: " + postcode);
        } else {
            session.send("No postcode detected.");
        }
    }
])

// Contact Details.
intents.matches("ContactDetails", [
    (session, args, next) => {
        session.send("Our contact details are:");
        session.send("Outside of Bristol:\n\nCall: 01708 689 985\n\nText: 07519 774 277");
        session.send("Bristol Area:\n\nCall: 01708 689 984\n\nText: 07514 030 630");
    }
]);