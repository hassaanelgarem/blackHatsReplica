import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Activity } from '../businessEdit/activities/activity.model';
import { Slot } from '../businessEdit/activities/slot.model';
import {BusinessPageService} from './businessPage.service';
import {BusinessService} from '../businessEdit/business.service';
import { AppService } from "../app.service"


@Component({
    selector: 'activity-page',
    templateUrl: './activityPage.component.html'
})
export class ActivityPageComponent implements OnInit {

    activity: Activity;
    slots: Slot[];
    gotActivity = false;
    path: String = "http://54.213.175.206:8080/api/";
    chosenDate: Date;
    dateChosen: Boolean = false;
    loggedIn = true;
    noPhotos = false;
    noSlots = false;
    validDate = true;

    constructor(
        private activatedRoute: ActivatedRoute,
        private businessPageService: BusinessPageService,
        private businessService: BusinessService,
        private router: Router,
        private appService: AppService
    ) { }


    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            let id = params['activityId'];
            this.businessService.getActivity(id).subscribe(
                (data) => {
                    this.activity = new Activity(
                        data.data.name,
                        data.data.price,
                        data.data.description,
                        data.data.bookingsPerSlot,
                        data.data.business,
                        data.data.photos,
                        data.data.slots,
                        data.data.bookings,
                        data.data._id
                    );
                    if (this.activity.photos.length == 0) {
                        this.noPhotos = true;
                    }
                    this.appService.getCurrentUser().subscribe(res => {
                        if (res.success && res.user) {
                            this.loggedIn = true;
                        }
                        else {
                            this.loggedIn = false;
                        }
                        this.gotActivity = true;
                    });

                },
                (err) => {
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
                }
            );
        });
    }

    updateSlots(event: Date) {
        let now = new Date();
        now.setHours(12);
        now.setMinutes(0);
        now.setSeconds(0);
        event.setHours(12);
        event.setMinutes(0);
        event.setSeconds(0);
        if (event < now) {
            this.validDate = false;
        }
        else {
            this.validDate = true;
        }
        this.businessPageService.getAvailableSlots(this.activity.id, event).subscribe(
            (data) => {
                this.dateChosen = false;
                this.noSlots = false;
                this.slots = [];
                for (let slot of data.data) {
                    this.slots.push(new Slot(
                        slot.startTime,
                        slot.endTime
                    )
                    );
                }
                if (this.slots.length == 0) {
                    this.noSlots = true;
                }
                this.dateChosen = true;

            },
            (err) => {
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
            }
        );
    }

    bookSlot(index) {
        var handler = (<any>window).StripeCheckout.configure({
            key: 'pk_test_9AEHvD0gXViwtKYQDpQcLXlY',
            locale: 'auto',
            token: token => this.gotToken(token, index)
        });

        handler.open({
            name: 'Book Activity',
            description: this.activity.name,
            amount: this.activity.price * 100
        });
    }

    gotToken(token, index) {

        this.appService.charge(token).subscribe(res => {
            this.businessPageService.bookActivity(this.slots[index], this.activity.id, this.chosenDate).subscribe(
                (data) => {
                    bootbox.alert(data.msg);
                },
                (err) => {
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
                }
            );
        });
    }

    onBack() {
        this.router.navigate(["/business/" + this.activity.business]);
    }
}
