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
    }
]);
intents.matches("Greeting", [
    function (session, args, next) {
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
]);
intents.matches("Prices", [
    function (session, args, next) {
        session.send("We pay 50p per KG, £5.00 per 10KG and £500 per tonne. There is no minimum weight or price.");
    }
]);
intents.matches("OutletLocations", [
    function (session, args, next) {
        var logo = new builder.CardImage(session).url("https://static.wixstatic.com/media/b93b43_864e7ab4be334d6da31a6edbcb24a43b~mv2.jpg/v1/fill/w_560,h_246,al_c,q_80,usm_0.66_1.00_0.01/b93b43_864e7ab4be334d6da31a6edbcb24a43b~mv2.webp").alt("Cash 4 Clothes").toImage();
        var cards = [
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
        session.send("We have a number of outlets, let me just grab their details for you.");
        var reply = new builder.Message(session)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments(cards);
        session.send(reply);
    }
]);
intents.matches("CheckCollectionArea", [
    function (session, args, next) {
        var intent = args.intent;
        var postcode = builder.EntityRecognizer.findEntity(args.entities, "Postcode");
        if (postcode) {
            var collectionData = new postcode_service_1.PostcodeService().getSomething(postcode.entity);
            if (collectionData) {
                session.send("Yes! We collect from " + postcode.entity + " on " + collectionData.collectionDay);
            }
            else {
                session.send("Sorry, at the moment it doesnt look like we collect from that postcode :(");
            }
        }
        else {
            session.send("No postcode detected.");
        }
    }
]);
intents.matches("AppointmentCancel", [
    function (session, args, next) {
        builder.Prompts.text(session, "That is a shame, what was the postcode we were due to collect from?");
    },
    function (session, results, next) {
        if (results.response) {
            session.dialogData.cancellation.postcode = results.response;
        }
        builder.Prompts.number(session, "What was your contact number we have for you?");
    },
    function (session, results, next) {
        if (results.response) {
            session.dialogData.cancellation.number = results.response;
        }
        session.send("Thank you.");
        session.send("Postcode: " + session.dialogData.cancellation.postcode);
        session.send("Number: " + session.dialogData.cancellation.number);
    }
]);
intents.matches("BuyingItemsList", [
    function (session, args, next) {
        session.send("**We accept good quality:**\n\nClean and tidy re-usable clothes, Perfumes, Paired shoes, Handbags, Belts, Cosmetics, Jewelry & Soft toys\n\n**Unfortunately, we don't accept:**\n\nBad quality, wet, ripped clothes, Duvets, Books, Pillows, Bric-a-brac, Bedding, Glass, Bad quality, ripped shoes, Heavy curtains, Carpets & Metal");
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
        session.send("Thank you, we have your details and will see you soon.");
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
            builder.Prompts.choice(session, "Would you like us to collect it? (Collection) or are you happy to drop it into one of our outlets? (Delivery)", ["Collection", "Delivery"]);
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
    },
    function (session, results, next) {
        if (results.response) {
            session.dialogData.collection.address = results.response;
        }
        if (!session.dialogData.collection.phone) {
            builder.Prompts.number(session, "What contact telephone number can we use to contact you?");
        }
    },
    function (session, results, next) {
        if (results.response) {
            session.dialogData.collection.phone = results.response;
        }
        if (!session.dialogData.fundsforschools) {
            builder.Prompts.choice(session, "Would you like to donate the proceeds to Funds4Schools?", ["Yes", "No"]);
        }
    },
    function (session, results, next) {
        if (results.response) {
            session.dialogData.fundsforschools = results.response;
        }
        session.endDialogWithResult({ response: session.dialogData.collection });
    }
]);
intents.matches("Thank", [
    function (session, args, next) {
        session.send(["No proble at all :)", "Anytime :)", "You are welcome"]);
    }
]);
//# sourceMappingURL=app.js.map