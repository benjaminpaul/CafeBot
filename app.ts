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

var model = process.env.LUIS_MODEL || "";
var recognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog("/", intents);


intents.matches("Greeting", [
    (session, args, next) => {
        session.send("Hello, welcome to " + process.env.CAFE_NAME + ", How can I help?");
    }
]);

intents.matches("OpeningTimes", [
    (session, args, next) => {
        session.send("Let just grab our opening times for you...");
        var s = "";
        data.openingTimes.forEach((openingTime) => {
            s = s + openingTime.dayOfWeek + ": " + openingTime.openFrom + " - " + openingTime.openTo + "\n\n";
        });

        session.send(s);
    }
]);

intents.matches("TakeOrder", [
    (session, args, next) => {
        session.send("I can take your order...");
    }
])