export class SupportRequest{
    constructor(
        public title: string,
        public contactEmail: string,
        public accountType: string,
        public registeredEmail: string,
        public description: string,
        public contactPhoneNumber?: string
    ){ }
}