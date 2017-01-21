export interface IOpeningTime {
    dayOfWeek: string;
    openFrom: string;
    openTo: string;
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