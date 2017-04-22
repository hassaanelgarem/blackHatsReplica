import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdSlotsService } from './adSlots.service';
import { AdSlot } from '../adSlots.model';
import { BookingSlot } from "../bookingSlot.model";


@Component({
    selector: 'homepage-adSlots',
    templateUrl: './adSlots.component.html',
    styleUrls: ['adSlots.component.css']
})
export class AdSlotsComponent implements OnInit {
    private adSlots: AdSlot[] = [];;
    private bookingSlots: BookingSlot[] = [];
    private exists = false;


    constructor(
      private router: Router,
      private adSlotsService: AdSlotsService) { }

    ngOnInit() {
        this.adSlotsService.getAdSlots()
            .subscribe(
            (adSlots: AdSlot[]) => {
                this.adSlots = adSlots;

                let count = 0;
                for (let i = 0; i < this.adSlots.length && count < 3; i++) {

                    this.adSlotsService.getBookedSlots(adSlots[i].adSlotId)
                        .subscribe(
                          (bookingSlot: BookingSlot[]) => {
                            if (bookingSlot.length > 0 && bookingSlot[0].adSlotId == adSlots[i].adSlotId) {
                                this.bookingSlots.push(bookingSlot[0]);
                                this.exists = true;
                                count++;
                            }
                        }, (err) => {
                          switch (err.status) {
                              case 404:
                                  this.router.navigateByUrl('/404-error');
                                  break;
                              case 401:
                                  this.router.navigateByUrl('/notAuthorized-error');
                                  break;
                              default:
                                  this.router.navigateByUrl('/500-error');
                                  break;
                          }
                        });
                }
            }, (err) => {
              switch (err.status) {
                  case 404:
                      this.router.navigateByUrl('/404-error');
                      break;
                  case 401:
                      this.router.navigateByUrl('/notAuthorized-error');
                      break;
                  default:
                      this.router.navigateByUrl('/500-error');
                      break;
              }
            });
    }

}
