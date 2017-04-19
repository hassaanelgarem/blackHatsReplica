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
  private exists=false;


  constructor(private adSlotsService: AdSlotsService) { }

  ngOnInit() {
    this.adSlotsService.getAdSlots()
      .subscribe((adSlots: AdSlot[]) => {
        this.adSlots = adSlots;
    
        let count=0;
        for (let i = 0; i < this.adSlots.length && count<3; i++) {
          
          this.adSlotsService.getBookedSlots(adSlots[i].adSlotId)
            .subscribe((bookingSlot: BookingSlot[]) => {
              if(bookingSlot.length>0 && bookingSlot[0].adSlotId==adSlots[i].adSlotId){
              this.bookingSlots.push(bookingSlot[0]);
              this.exists=true;
              count++;
              }
            });

        }
      });
  }

}
