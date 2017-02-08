"use strict";
var postcode_service_1 = require("./../services/postcode-service");
var builder = require("botbuilder");
var CollectionAreas = (function () {
    function CollectionAreas() {
    }
    CollectionAreas.prototype.dialog = function () {
        return [
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
        ];
    };
    return CollectionAreas;
}());
exports.CollectionAreas = CollectionAreas;
//# sourceMappingURL=collection-area.js.map