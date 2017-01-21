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
        var card = new builder.HeroCard(session)
        .title(process.env.CAFE_NAME)
        .subtitle("126 Church Road, Bristol.")
        .text("Hello there, thanks for getting in touch! - What can I help you with?")
        .buttons([
            builder.CardAction.postBack(session, "What are you open?", "Show Opening Times"),
            builder.CardAction.postBack(session, "I want to make an order?", "Make an order"),
            builder.CardAction.postBack(session, "What is your phone number?", "Call us"),
            builder.CardAction.postBack(session, "I want to send a message", "Send us a message")
        ]);

        var message = new builder.Message(session).addAttachment(card);
        session.send(message);
    }
]);

intents.matches("OpeningTimes", [
    (session, args, next) => {
        session.send("Here are our opening times for the week...");
        var s = "";
        data.openingTimes.forEach((openingTime) => {
            s = s + openingTime.dayOfWeek + ": " + openingTime.openFrom + " - " + openingTime.openTo + "\n\n";
        });

        session.send(s);
    }
]);

intents.matches("TakeOrder", [
    (session, args, next) => {
        builder.Prompts.text(session, "What would you like to order?");
    },
    (session, results, next) => {
        if (results.response)  {
            session.send("I heard: " + results.response);
        } else {
            next();
        }
    }
]);

intents.matches("PhoneNumber", [
    (session, args, next) => {
        session.send("Our phone number is: 07982 628 199");
    }
]);

intents.matches("SendMessage", [
    (session, args, next) => {
        builder.Prompts.text(session, "No problem, I can pass that on for you, what is it you wanted to say?");
    },
    (session, results, next) => {
        if (results.response) {
            session.send("Thanks, I have passed that information to our staff.");
        } else {
            next();
        }
    }
])