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
    business: Object;
    path: String = "http://localhost:8080/api/";
    currentIndex = 0;
    showEdit = false;
    addDone = false;
    editDone = false;


    //warning Flags

    addNameWarning = false;
    addDescriptionWarning = false;
    addPriceWarning = false;
    addPerSlotWarning = false;

    editNameWarning = false;
    editDescriptionWarning = false;
    editPriceWarning = false;
    editPerSlotWarning = false;


    //Add attributes

    addName: String;
    addDescription: String;
    addPrice: Number;
    addPerSlot: Number;
    //Edit attributes

    editName: String;
    editDescription: String;
    editPrice: Number;
    editPerSlot: Number;

    constructor(
        private activatedRoute: ActivatedRoute,
        private businessService: BusinessService,
        private router: Router
    ) { }

    ngOnInit() {
        this.businessService.getCurrentUser().subscribe(
            (res) => {
                this.business = res.business;
                this.businessService.getActivities(this.business._id).subscribe(
                    (acts: Activity[]) => {
                        this.activities = acts;
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
        this.router.navigate(["/businessEdit/activity/" + this.activities[index].id]);

    }

    onDelete() {
        this.businessService.deleteActivity(this.activities[this.currentIndex]).subscribe(
            (data) => {
                this.activities.splice(this.currentIndex, 1);
                this.currentIndex = 0;
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

    onAddSubmit() {
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

    hideEditNameWarning() {
        this.editNameWarning = false;
    }

    hideEditDescriptionWarning() {
        this.editDescriptionWarning = false;
    }

    hideEditPriceWarning() {
        this.editPriceWarning = false;
    }

    hideEditPerSlotWarning() {
        this.editPerSlotWarning = false;
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
        this.addDone = false;
        this.addNameWarning = false;
        this.addDescriptionWarning = false;
        this.addPriceWarning = false;
        this.addPerSlotWarning = false;
    }

    onSave() {
        this.editDone = true;
    }

    onSaveDone() {

    }

    onEditCancel() {
        this.editDone = false;
        this.showEdit = false;
    }

}
