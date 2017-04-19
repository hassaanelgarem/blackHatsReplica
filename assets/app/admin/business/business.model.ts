export class Business {
    constructor(
        public _id: string,
        public name: string,
        public email: string,
        public location: { "address": string, "city": string, "coordinates": number[] },
        public totalRatings: number,
        public createdAt: Date) { }
}