export class Business {
    constructor(public name: string,
                public email: string,
                public phoneNumbers: string[],
                public workingDays: string[],
                public workingHours :{ "from" :string,"to" :string},
                public address : string,
                public location:{"address":string,"city":string,"coordinates":number[]},
                public tags:string[],
                public category:string,
                public description:string,
                public interactivity:number,
                public totalRatings:number,
                public photos:string[],
                public paymentRequired:number,
                public deposit:number,
                public logo:string) {}
}