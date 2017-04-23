import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { AdSlot } from "../adSlots.model";
import { BookingSlot } from "../bookingSlot.model";


@Injectable()
export class AdSlotsService {
    private adSlots: AdSlot[] = [];
    private bookingSlots: BookingSlot[] = [];

    constructor(private http: Http) { }

    getAdSlots() {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
        return this.http.get('http://localhost:8080/api/advertisement/getAdvSlots', {headers: headers})
            //map method to transform the response
            .map((response: Response) => {
                const adSlots = response.json().data;
                let transformedAdSlots: AdSlot[] = [];
                for (let adSlot of adSlots) {
                    transformedAdSlots.push(new AdSlot(adSlot._id,adSlot.name));
                }
                this.adSlots = transformedAdSlots;
                // console.log(this.adSlots);
                return transformedAdSlots;
            }).catch((error: Response) => Observable.throw(error.json()));
    }

    getBookedSlots(advertismentId : string) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
        return this.http.get('http://localhost:8080/api/advertisement/getCurrentBookings/' + advertismentId, {headers: headers})
            //map method to transform the response
            .map((response: Response) => {
                const bookingSlots = response.json().data;
                let transformedBookingSlots: BookingSlot[] = [];
                for (let bookingSlot of bookingSlots) {
                    transformedBookingSlots.push(new BookingSlot(bookingSlot.business,bookingSlot.advSlot,bookingSlot.image));
                }
                this.bookingSlots = transformedBookingSlots;
                // console.log(this.adSlots);
                return transformedBookingSlots;
            }).catch((error: Response) => Observable.throw(error.json()));
    }

}
