import { Component, OnInit } from '@angular/core';

import { AdSlotsService } from './adSlots.service';
import { AdSlot } from '../adSlots.model';
import { BookingSlot } from "../bookingSlot.model";


@Component({
  selector: 'homepage-adSlots',
  templateUrl: './adSlots.component.html',
  styleUrls : ['adSlots.component.css']
})
export class AdSlotsComponent implements OnInit {
  private adSlots: AdSlot[] = [];;
  private bookingSlots: BookingSlot[] = [];


  constructor(private adSlotsService: AdSlotsService) { }

  ngOnInit() {
    this.adSlotsService.getAdSlots()
      .subscribe((adSlots: AdSlot[]) => {
        this.adSlots = adSlots;
        // console.log(this.adSlots)

        for (let i = 0; i < this.adSlots.length; i++) {
          this.adSlotsService.getBookedSlots(adSlots[i].adSlotId)
            .subscribe((bookingSlot: BookingSlot[]) => {
                      // console.log(bookingSlot);
              if(bookingSlot.length>0 && bookingSlot[0].adSlotId==adSlots[i].adSlotId){
              this.bookingSlots.push(bookingSlot[0]);
              }
            });

        }
        // console.log(this.bookingSlots);
      });
  }

}
