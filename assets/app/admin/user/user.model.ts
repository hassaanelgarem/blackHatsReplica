export class User {
    constructor(
        public _id: string,
        public firstName: string,
        public lastName: string,
        public email: string,
        public username: string,
        public birthDate: Date,
        public admin: boolean,
        public createdAt: Date,
        public verified: boolean) { }
}