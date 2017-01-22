"use strict";
var restify = require("restify");
var builder = require("botbuilder");
var data = require("./data");
var sendgrid = require("sendgrid");
function sendEmail(toAddress, text) {
    var to = new sendgrid.mail.Email(toAddress);
    var from = new sendgrid.mail.Email("emails@onebadandroid.ai");
    var subject = "New order from " + process.env.CAFE_NAME;
    var content = new sendgrid.mail.Content('text/plain', 'Hello, Email!');
    var mail = new sendgrid.mail.Mail(from, subject, to, content);
    var sg = sendgrid("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");
    var r = sg.emptyRequest();
    r.method = "POST";
    r.path = "v3/mail/send";
    r.body = mail.toJSON();
    sg.API(r, function (response) {
    });
}
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
var model = process.env.LUIS_MODEL || "";
var recognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog("/", intents);
intents.matches("Greeting", [
    function (session, args, next) {
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
    function (session, args, next) {
        session.send("Here are our opening times for the week...");
        var s = "";
        data.openingTimes.forEach(function (openingTime) {
            s = s + openingTime.dayOfWeek + ": " + openingTime.openFrom + " - " + openingTime.openTo + "\n\n";
        });
        session.send(s);
    }
]);
intents.matches("IsOpen", [
    function (session, args, next) {
        var date = new Date();
        var day = date.getDay();
        var hours = date.getHours();
        var openingTime = data.openingTimes[day];
        if (openingTime) {
            session.send("Here are our opening times for today...");
            session.send(openingTime.dayOfWeek + ": " + openingTime.openFrom + " - " + openingTime.openTo);
        }
    }
]);
intents.matches("TakeOrder", [
    function (session, args, next) {
        builder.Prompts.text(session, "What would you like to order?");
    },
    function (session, results, next) {
        if (results.response) {
            session.send("I heard: " + results.response);
            sendEmail("benjaminpaul1984@googlemail.com", results.resonse);
        }
        else {
            next();
        }
    }
]);
intents.matches("PhoneNumber", [
    function (session, args, next) {
        session.send("Our phone number is: 07982 628 199");
    }
]);
intents.matches("SendMessage", [
    function (session, args, next) {
        builder.Prompts.text(session, "No problem, I can pass that on for you, what is it you wanted to say?");
    },
    function (session, results, next) {
        if (results.response) {
            session.send("Thanks, I have passed that information to our staff.");
        }
        else {
            next();
        }
    }
])
    .onDefault(builder.DialogAction.send("Sorry, I didn't understand what you said, please try again."));
//# sourceMappingURL=app.js.map