import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Activity } from './activity.model';
import { Slot } from './slot.model';
import {BusinessService} from '../business.service';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import {EventEmitter} from "@angular/common/src/facade/async";

@Component({
    selector: 'activity-edit',
    templateUrl: './editActivity.component.html',
    styleUrls: ['./businessActivities.component.css']
})
export class EditActivityComponent implements OnInit {

    newStart: Date;
    newEnd: Date;
    activity: Activity;
    gotActivity = false;
    path: String = "http://54.213.175.206:8080/api/";
    public config: DropzoneConfigInterface;
    public myFocusTriggeringEventEmitterOne = new EventEmitter<boolean>();
    public myFocusTriggeringEventEmitterTwo = new EventEmitter<boolean>();

    //Input fields
    name: String;
    description: String;
    price: number;
    perSlot: number;
    fakeVaribaleOne: String;
    fakeVaribaleTwo: String;
    showFakeInput = false;

    //warning

    addSlotWarning = false;
    warningMessage = "";

    constructor(
        private activatedRoute: ActivatedRoute,
        private businessService: BusinessService,
        private router: Router
    ) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe(
            (params: Params) => {
                let id = params['activityId'];
                this.config = {
                    server: 'http://54.213.175.206:8080/api/activity/' + id + '/addPhoto',
                    paramName: 'myfile'
                };
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
                        this.gotActivity = true;
                        this.name = this.activity.name;
                        this.description = this.activity.description;
                        this.price = this.activity.price;
                        this.perSlot = this.activity.bookingsPerSlot;


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

    onSave() {
        this.activity.name = this.name;
        this.activity.description = this.description;
        this.activity.price = this.price;
        this.activity.bookingsPerSlot = this.perSlot;
        this.businessService.editActivity(this.activity).subscribe(
            (data) => {
                this.router.navigate(["/businessEdit"]);
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

    onDelete() {
        var _this = this;
        bootbox.confirm({
            title: "Delete activity",
            message: "Are you sure you want to delete this activity?",
            buttons: {
                cancel: {
                    label: '<i class="fa fa-times"></i> Cancel'
                },
                confirm: {
                    label: '<i class="fa fa-check"></i> Confirm'
                }
            },
            callback: function(result) {
                if (result) {
                    _this.businessService.deleteActivity(_this.activity).subscribe(
                        (data) => {
                            _this.router.navigate(["/businessEdit"]);
                        },
                        (err) => {
                            switch (err.status) {
                                case 404:
                                    _this.router.navigateByUrl('/404-error');
                                    break;
                                case 401:
                                    _this.router.navigateByUrl('/notAuthorized-error');
                                    break;
                                default:
                                    _this.router.navigateByUrl('/500-error');
                                    break;
                            }
                        }
                    );
                }

            }
        });

    }

    onCancel() {
        this.router.navigate(["/businessEdit"]);
    }

    deleteSlot(index) {
        var _this = this;
        bootbox.confirm({
            title: "Delete slot",
            message: "Are you sure you want to delete this slot?",
            buttons: {
                cancel: {
                    label: '<i class="fa fa-times"></i> Cancel'
                },
                confirm: {
                    label: '<i class="fa fa-check"></i> Confirm'
                }
            },
            callback: function(result) {
                if (result) {
                    _this.businessService.deleteSlot(_this.activity.slots[index], _this.activity).subscribe(
                        (data) => {
                            _this.activity.slots.splice(index, 1);
                        },
                        (err) => {
                            switch (err.status) {
                                case 404:
                                    _this.router.navigateByUrl('/404-error');
                                    break;
                                case 401:
                                    _this.router.navigateByUrl('/notAuthorized-error');
                                    break;
                                default:
                                    _this.router.navigateByUrl('/500-error');
                                    break;
                            }
                        }
                    );
                }

            }
        });

    }

    hideSlotWarning() {
        this.addSlotWarning = false;
    }

    addSlot() {
        if (this.newStart && this.newEnd) {
            let newSlot = new Slot(
                this.newStart,
                this.newEnd
            )
            this.businessService.addSlot(newSlot, this.activity).subscribe(
                (data) => {
                    this.activity.slots.push(newSlot);
                    this.activity.slots.sort(function(a, b) {
                        var one = b.startTime;
                        var two = a.startTime;
                        one.setDate(12);
                        one.setMonth(12);
                        one.setFullYear(2012);
                        two.setDate(12);
                        two.setMonth(12);
                        two.setFullYear(2012);
                        return this.two - this.one;
                    });
                    this.newStart = null;
                    this.newEnd = null;
                    this.addSlotWarning = false;
                },
                (err) => {
                    switch (err.status) {
                        case 405:
                            this.warningMessage = "This slot overlaps another slot";
                            this.addSlotWarning = true;
                            break;
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
        else {
            this.warningMessage = "Please choose a start and end time";
            this.addSlotWarning = true;
        }
    }

    onUploadError(args: any) {
    }

    onUploadSuccess(event) {
        this.activity.photos.push(event[1].data);
        this.myFocusTriggeringEventEmitterOne.emit(true);
        this.myFocusTriggeringEventEmitterTwo.emit(true);

    }

    deletePhoto(index) {
        var _this = this;
        bootbox.confirm({
            title: "Delete Phot",
            message: "Are you sure you want to delete this photo?",
            buttons: {
                cancel: {
                    label: '<i class="fa fa-times"></i> Cancel'
                },
                confirm: {
                    label: '<i class="fa fa-check"></i> Confirm'
                }
            },
            callback: function(result) {
                if (result) {
                    _this.businessService.deleteActivityPhoto(_this.activity.photos[index], _this.activity).subscribe(
                        (date) => {
                            _this.activity.photos.splice(index, 1);
                        },
                        (err) => {
                            switch (err.status) {
                                case 404:
                                    _this.router.navigateByUrl('/404-error');
                                    break;
                                case 401:
                                    _this.router.navigateByUrl('/notAuthorized-error');
                                    break;
                                default:
                                    _this.router.navigateByUrl('/500-error');
                                    break;
                            }
                        }
                    );
                }

            }
        });
    }

}
