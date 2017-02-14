import { Thanks } from './dialogs/thanks';
import { ContactDetails } from './dialogs/contact-details';
import { BuyingItems } from './dialogs/buying-items';
import { CancelAppointment } from './dialogs/cancel-appointment';
import { Greeting } from './dialogs/greeting';
import { CollectionAreas } from './dialogs/collection-area';
import { Prices } from './dialogs/prices';
import { Outlets } from './dialogs/outlets';
import * as createAppointments from "./dialogs/create-appointment";
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
intents.matches("OrganiseCollection", createAppointments.dialog);
