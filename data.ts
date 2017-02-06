export interface IOpeningTime {
    dayOfWeek: string;
    openFrom: string;
    openTo: string;
}

export interface ICollectionDay {
    postcodes: string[];
    collectionDay: string;
    times: string;
}

export const openingTimes:Array<IOpeningTime> = [
    { dayOfWeek: "Monday", openFrom: "9:00", openTo: "17:00" },
    { dayOfWeek: "Tuesday", openFrom: "9:00", openTo: "17:00" },
    { dayOfWeek: "Wednesday", openFrom: "9:00", openTo: "17:00" },
    { dayOfWeek: "Thursday", openFrom: "9:00", openTo: "17:00" },
    { dayOfWeek: "Friday", openFrom: "9:00", openTo: "17:00" },
    { dayOfWeek: "Saturday", openFrom: "9:00", openTo: "17:00" },
    { dayOfWeek: "Sunday", openFrom: "9:00", openTo: "17:00" },
];

export const collectionDays:Array<ICollectionDay> = [
    { 
        collectionDay: "Monday",
        postcodes: ["BS20", "BS21", "BS22", "BS23", "BS24", "BS25", "BS26", "BS27", "BS28", "BS29", "BS40", "BS41", "BS48", "BS49", "TA1", "TA2", "TA3", "TA4", "TA5", "TA6", "TA7", "TA8", "TA9"],
        times: "2:00pm - 6:00pm"
    },
    {
        collectionDay: "Tuesday",
        postcodes: ["BS35", "BS36", "BS37", "GL5", "GL6", "GL8", "GL9", "GL10", "GL11", "GL12", "GL13"],
        times: "2:00pm - 6:00pm"
    },
    {
        collectionDay: "Wednesday",
        postcodes: ["BS39", "BA1", "BA2", "BA3", "BA4", "BA5", "BA6", "BA7", "BA8", "BA9", "BA10", "BA16"],
        times: "2:00pm - 6:00pm"
    },
    {
        collectionDay: "Thursday",
        postcodes: ["BA11", "BA12", "BA13", "BA14", "BA15"],
        times: "2:00pm - 6:00pm"
    },
    {
        collectionDay: "Friday",
        postcodes: ["SN10", "SN11", "SN12", "SN13", "SN14", "SN15"],
        times: "2:00pm - 6:00pm"
    },
    {
        collectionDay: "Monday to Friday",
        postcodes: ["BS1", "BS2", "BS3", "BS4", "BS5", "BS6", "BS7", "BS8", "BS9", "BS10", "BS11", "BS13", "BS14", "BS15", "BS16", "BS30", "BS31", "BS32", "BS34"],
        times: "9am - 1pm"
    }
]
