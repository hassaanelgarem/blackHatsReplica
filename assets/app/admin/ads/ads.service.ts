import { AdSlot } from './ads.model';
import { Http, Response, Headers } from "@angular/http";
import { Injectable } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";


@Injectable()
export class AdsService {
    private alertMsg: string;
    constructor(private http: Http) { }

    getSlots() {
        return this.http.get('http://localhost:8080/api/advertisement/getAdvSlots')
            //map method to transform the response
            .map((response: Response) => {
                const slots = response.json().data;
                let transformedSlots: AdSlot[] = [];
                for (let slot of slots) {
                    transformedSlots.push(new AdSlot(
                        slot._id,
                        slot.name, slot.price, slot.length, slot.width
                    ));
                }
                return transformedSlots;
            }).catch((error: Response) => Observable.throw(error.json()));
    }

    addSlot(name: string, price: number, length: number, width: number) {
        return this.http.post('http://localhost:8080/api/admin/advertisement/addAdvSlots', {
            name,
            price,
            length,
            width
        })
            //map method to transform the response
            .map((response: Response) => {
                this.alertMsg = response.json().msg;
                return this.alertMsg;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    deleteSlot(slotId: string){
        return this.http.delete('http://localhost:8080/api/admin/advertisement/deleteAdvSlot/'+slotId)
            //map method to transform the response
            .map((response: Response) => {
                this.alertMsg = response.json().msg;
                return this.alertMsg;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }
}
