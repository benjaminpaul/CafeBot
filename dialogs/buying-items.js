"use strict";
var BuyingItems = (function () {
    function BuyingItems() {
    }
    BuyingItems.prototype.dialog = function () {
        return [
            function (session, args, next) {
                session.send("**We accept good quality:**\n\nClean and tidy re-usable clothes, Perfumes, Paired shoes, Handbags, Belts, Cosmetics, Jewelry & Soft toys\n\n**Unfortunately, we don't accept:**\n\nBad quality, wet, ripped clothes, Duvets, Books, Pillows, Bric-a-brac, Bedding, Glass, Bad quality, ripped shoes, Heavy curtains, Carpets & Metal");
            }
        ];
    };
    return BuyingItems;
}());
exports.BuyingItems = BuyingItems;
//# sourceMappingURL=buying-items.js.map