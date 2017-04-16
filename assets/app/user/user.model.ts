export class User {
    constructor(public firstName: string,
                public lastName: string,
                public username: string,
                public password: string,
                public confirmPassword: string,
                public email: string,
                public birthDate?: Date
                ) {}
}