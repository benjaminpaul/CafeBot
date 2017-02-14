"use strict";
var thanks_1 = require("./dialogs/thanks");
var contact_details_1 = require("./dialogs/contact-details");
var buying_items_1 = require("./dialogs/buying-items");
var cancel_appointment_1 = require("./dialogs/cancel-appointment");
var greeting_1 = require("./dialogs/greeting");
var collection_area_1 = require("./dialogs/collection-area");
var prices_1 = require("./dialogs/prices");
var outlets_1 = require("./dialogs/outlets");
var createAppointments = require("./dialogs/create-appointment");
var postcode_service_1 = require("./services/postcode-service");
var restify = require("restify");
var builder = require("botbuilder");
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
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
intents.matches("None", [
    function (session, args, next) {
        session.send("Sorry, I don't understand what you mean by that.");
    }
]);
intents.matches("Greeting", new greeting_1.Greeting().dialog());
intents.matches("Prices", new prices_1.Prices().dialog());
intents.matches("OutletLocations", new outlets_1.Outlets().dialog());
intents.matches("CheckCollectionArea", new collection_area_1.CollectionAreas().dialog());
intents.matches("AppointmentCancel", new cancel_appointment_1.CancelAppointment().dialog());
intents.matches("BuyingItemsList", new buying_items_1.BuyingItems().dialog());
intents.matches("ContactDetails", new contact_details_1.ContactDetails().dialog());
intents.matches("Thank", new thanks_1.Thanks().dialog());
intents.matches("OrganiseCollection", createAppointments.dialog);
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
//# sourceMappingURL=app.js.map