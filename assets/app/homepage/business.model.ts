export class Business {
  constructor(public businessId: string,
    public name: string,
    public logo: string,
    public reviews: string[],
    public email?: string,
    public phoneNumbers?: string[],
    public workingDays?: string[],
    public workingHours?: { "from": string, "to": string },
    public location?: { "address": string, "city": string, "coordinates": number[] },
    public tags?: string[],
    public category?: string,
    public description?: string,
    public interactivity?: number,
    public totalRatings?: number,
    public photos?: string[],
    public paymentRequired?: number,
    public deposit?: number,
    public averageRating?: number
  ) { }
}
