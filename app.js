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
//# sourceMappingURL=app.js.map