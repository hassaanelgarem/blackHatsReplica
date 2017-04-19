//Create a Class for the business created in the Component to be passed back to the backend
export class Business {
    constructor(public name: string,
        public password: string,
        public confirmPassword: string,
        public email: string,
        public description: string
    ) { }
}
