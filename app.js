"use strict";
var restify = require("restify");
var builder = require("botbuilder");
var data = require("./data");
var sendgrid = require("sendgrid");
function sendEmail(toAddress, text) {
    var to = new sendgrid.mail.Email(toAddress);
    var from = new sendgrid.mail.Email("orders@onebadandroid.ai");
    var subject = "NEW ORDER: " + process.env.CAFE_NAME;
    var content = new sendgrid.mail.Content('text/plain', text);
    var mail = new sendgrid.mail.Mail(from, subject, to, content);
    var sg = sendgrid("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");
    var r = sg.emptyRequest();
    r.method = "POST";
    r.path = "/v3/mail/send";
    r.body = mail.toJSON();
    sg.API(r)
        .then(function (response) {
        console.log(response);
    });
}
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID || "2623b525-124a-43c0-9c94-d426ea297c48",
    appPassword: process.env.MICROSOFT_APP_PASSWORD || "5oVSGsTJr7Awot9V6sRPkU2"
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());
var model = process.env.LUIS_MODEL || "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/be63655b-3463-453c-8c86-2ff01f190a59?subscription-key=cd56d7b3af9240a5a2fb21dac2ae2bc3&verbose=true";
var recognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog("/", intents);
intents.matches("Greeting", [
    function (session, args, next) {
        session.send("Hello there! Welcome to " + process.env.CAFE_NAME + ", I am a friendly chat bot who can help you get information or make orders.\n\n");
        var card = new builder.HeroCard(session)
            .title("How can I help?")
            .buttons([
            builder.CardAction.postBack(session, "What are your opening times?", "Show Opening Times"),
            builder.CardAction.postBack(session, "I would like to make an order please?", "Order Food"),
            builder.CardAction.postBack(session, "What is your phone number?", "Call Us")
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
            session.send("Thanks, I have sent that order to our staff and it will be ready for you in around 30 minutes.");
            sendEmail("benjaminpaul1984@googlemail.com", results.response);
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