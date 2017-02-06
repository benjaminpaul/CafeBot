"use strict";
var postcode_service_1 = require("./services/postcode-service");
var restify = require("restify");
var builder = require("botbuilder");
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
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
intents.matches("None", [
    function (session, args, next) {
        session.send("Sorry, I don't understand what you mean by that.");
        session.send("You can ask me things like...\n\nDo you collect from {PostCode}.");
    }
]);
intents.matches("Greeting", [
    function (session, args, next) {
        session.send("Hello there! Welcome to Cash 4 Clothes, I am a friendly chat bot who can help you find out about our services or even arrange a collection or delivery..\n\n");
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
intents.matches("OutletLocations", [
    function (session, args, next) {
        session.send("Locations carousel here");
    }
]);
intents.matches("CheckCollectionArea", [
    function (session, args, next) {
        var intent = args.intent;
        var postcode = builder.EntityRecognizer.findEntity(args.entities, "Postcode");
        if (postcode) {
            var collectionData = new postcode_service_1.PostcodeService().getSomething(postcode.entity);
            if (collectionData) {
                session.send("We collect on " + collectionData.collectionDay);
            }
            else {
                session.send("It does not look like we collect for that postcode");
            }
        }
        else {
            session.send("No postcode detected.");
        }
    }
]);
intents.matches("BuyingItemsList", [
    function (session, args, next) {
        session.send("We only buy good quality:");
        session.send("Clean and tidy re-usable clothes, Perfumes, Paired shoes, Handbags, Belts, Cosmetics, Jewelry & Soft toys");
        session.send("Unfortunately, we don't buy:");
        session.send("Bad quality, wet, ripped clothes, Duvets, Books, Pillows, Bric-a-brac, Bedding, Glass, Bad quality, ripped shoes, Heavy curtains, Carpets & Metal");
    }
]);
intents.matches("ContactDetails", [
    function (session, args, next) {
        session.send("Our contact details are:");
        session.send("Outside of Bristol:\n\nCall: 01708 689 985\n\nText: 07519 774 277");
        session.send("Bristol Area:\n\nCall: 01708 689 984\n\nText: 07514 030 630");
    }
]);
intents.matches("OrganiseCollection", [
    function (session, args, next) {
        var postcode = builder.EntityRecognizer.findEntity(args.entities, "Postcode");
        if (postcode) {
            session.userData.latestPostcode = postcode.entity;
        }
        session.send("No problem, lets get a little information from you...");
        session.beginDialog("/OrganiseCollection", session.dialogData.collection);
    },
    function (session, results) {
        session.send("You want a " + results.response.type);
        session.send("At the postcode: " + results.response.postcode);
    }
]);
bot.dialog("/OrganiseCollection", [
    function (session, args, next) {
        session.dialogData.collection = args || {};
        if (!session.dialogData.collection.postcode) {
            if (session.userData.latestPostcode) {
                next({ response: session.userData.latestPostcode });
            }
            else {
                builder.Prompts.text(session, "What is your postcode?");
            }
        }
        else {
            next();
        }
    },
    function (session, results, next) {
        if (results.response) {
            var deliveryDay = new postcode_service_1.PostcodeService().getSomething(results.response);
            if (deliveryDay) {
                session.send("We collect from " + results.response + " on " + deliveryDay.collectionDay);
            }
            else {
                session.send("We currently dont collect from that postcode, however you can always drop it to us at one of our outlets.");
            }
            session.dialogData.collection.postcode = results.response;
        }
        if (!session.dialogData.collection.type) {
            builder.Prompts.choice(session, "Would you like collection or delivery?", ["Collection", "Delivery"]);
        }
    },
    function (session, results, next) {
        if (results.response) {
            session.dialogData.collection.type = results.response.entity;
        }
        if (session.dialogData.collection.type === "Collection") {
            if (!session.dialogData.collection.address) {
                builder.Prompts.text(session, "No problem at all, what is the full address we should collect from?");
            }
        }
        else {
            session.endDialogWithResult({ response: session.dialogData.collection });
        }
    }
]);
//# sourceMappingURL=app.js.map