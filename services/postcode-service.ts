import { ICollectionDay } from './../data';
import * as data from "../data";

export class PostcodeService {
    public getSomething(postcode: string) {
        var result : ICollectionDay;
        data.collectionDays.forEach(collectionDay => {
            collectionDay.postcodes.forEach(pc => {
                if (postcode.toUpperCase().substr(0, pc.length) === pc.toUpperCase()) {
                    result = collectionDay;
                    return;
                }
            })

            if (result) {
                return;
            }
        });

        return result;
    }
}