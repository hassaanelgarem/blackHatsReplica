import { Slot } from './slot.model';

export class Activity {
  id: String;
  name: String;
  price: Number;
  description: String;
  photos: [String];
  bookingsPerSlot: Number;
  slots: Slot[];
  business: String;
  bookings: [String];

    constructor(
      name: String,
      price: Number,
      description: String,
      bookingsPerSlot: Number,
      business?: String,
      photos?: [String],
      slots?: Slot[],
      bookings?: [String],
      id?: String
    ) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.description = description;
        this.bookingsPerSlot = bookingsPerSlot;
        this.business = business;
        this.photos = photos;
        this.slots = slots;
        this.bookings = bookings;
    }
}
