export class SupportRequest {
    constructor(
        public _id: string,
        public title: string,
        public contactEmail: string,
        public contactPhoneNumber: string,
        public accountType: string,
        public registeredEmail: string,
        public description: boolean,
        public createdAt: Date) { }
}