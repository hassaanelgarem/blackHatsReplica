import { Component, OnInit } from '@angular/core';
import {BusinessService} from '../business.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Slot } from './slot.model';
import { Activity } from './activity.model';
import 'rxjs/add/operator/map';


@Component({
    selector: 'app-businessEdit-activities',
    templateUrl: './businessActivities.component.html',
    styleUrls: ['./businessActivities.component.css']
})

export class BusinessActivitiesComponent implements OnInit {

    activities: Activity[] = [];
    businessId: String = "58ee4577fa669f51b6abf3ae";
    path: String = "http://localhost:8080/api/";
    currentIndex = 0;
    showEdit = false;
    hideModal = false;
    addDone = false;


    //warning Flags

    addNameWarning = false;
    addDescriptionWarning = false;
    addPriceWarning = false;
    addPerSlotWarning = false;

    //Add attributes

    addName: String;
    addDescription: String;
    addPrice: Number;
    addPerSlot: Number;

    constructor(
        private activatedRoute: ActivatedRoute,
        private businessService: BusinessService
    ) { }

    ngOnInit() {
        this.businessService.getActivities(this.businessId).subscribe((acts: Activity[]) => {
            this.activities = acts;
        });
    }

    truncate(text) {
        if (text.length > 100) {
            let newText = text.slice(0, 90);
            newText += "...";
            return newText;
        }
        return text;
    }

    onEdit(index) {
        this.currentIndex = index;
        this.showEdit = true;
    }

    onDelete() {
        this.businessService.deleteActivity(this.activities[this.currentIndex]).subscribe(
            (data) => {
                console.log("tamaam");
                this.activities.splice(this.currentIndex, 1);
                this.currentIndex = 0;
            },
            (err) => {
                console.log("msh tamaam")
                //console.log(err);
            }
        );
    }

    onAddSubmit() {
        console.log("TRYING")
        if (!this.addName || this.addName.length == 0) {
            this.addNameWarning = true;
        }
        else {
            this.addNameWarning = false;
        }
        if (!this.addDescription || this.addDescription.length == 0) {
            this.addDescriptionWarning = true;
        }
        else {
            this.addDescriptionWarning = false;
        }
        if (!this.addPrice || this.addPrice == 0) {
            this.addPriceWarning = true;
        }
        else {
            this.addPriceWarning = false;
        }
        if (!this.addPerSlot || this.addPerSlot == 0) {
            this.addPerSlotWarning = true;
        }
        else {
            this.addPerSlotWarning = false;
        }

        if (!this.addNameWarning && !this.addDescriptionWarning && !this.addPriceWarning && !this.addPerSlotWarning) {
            const newActivity = new Activity(
                this.addName,
                this.addPrice,
                this.addDescription,
                this.addPerSlot
            );
            this.addName = null;
            this.addDescription = null;
            this.addPrice = null;
            this.addPerSlot = null;
            this.businessService.addActivity(newActivity).subscribe(
                (data) => {

                    this.addDone = true;
                    console.log("Data:")
                    console.log(data.data);
                    this.activities.push(new Activity(
                        data.data.name,
                        data.data.price,
                        data.data.description,
                        data.data.bookingsPerSlot,
                        data.data.business,
                        data.data.photos,
                        data.data.slots,
                        data.data.bookings,
                        data.data._id
                      )
                    )
                },
                (err) => {
                    console.log(err);
                }

            );

        }
    }

    hideNameWarning() {
        this.addNameWarning = false;
    }

    hideDescriptionWarning() {
        this.addDescriptionWarning = false;
    }

    hidePriceWarning() {
        this.addPriceWarning = false;
    }

    hidePerSlotWarning() {
        this.addPerSlotWarning = false;
    }

    onAddDone() {
        setTimeout(() => {
            this.addDone = false;
        }, 10);

    }
    onAddCancel() {
        this.addName = null;
        this.addDescription = null;
        this.addPrice = null;
        this.addPerSlot = null;
    }

}
