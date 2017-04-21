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
    path: String = "http://localhost:8080/api/";
    public config: DropzoneConfigInterface;
    public myFocusTriggeringEventEmitterOne = new EventEmitter<boolean>();
    public myFocusTriggeringEventEmitterTwo = new EventEmitter<boolean>();

    //Input fields
    name: String;
    description: String;
    price: Number;
    perSlot: Number;
    fakeVaribaleOne: String;
    fakeVaribaleTwo: String;
    showFakeInput = false;

    constructor(
      private activatedRoute: ActivatedRoute,
      private businessService: BusinessService,
      private router: Router
    ) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            let id = params['activityId'];
            this.config = {
                server: 'http://localhost:8080/api/activity/' + id + '/addPhoto',
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
                            console.log("404 not found");
                            break;
                        case 401:
                            console.log("Unauthorized");
                            break;
                        default:
                            console.log("Oops somethings went wrong");
                            break;
                    }
                }
            );
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
                  console.log("404 not found");
                  break;
              case 401:
                  console.log("Unauthorized");
                  break;
              default:
                  console.log("Oops somethings went wrong");
                  break;
          }
        }
      );
    }

    onDelete() {
        this.businessService.deleteActivity(this.activity).subscribe(
          (data) => {
            this.router.navigate(["/businessEdit"]);
          },
          (err) => {
            switch (err.status) {
                case 404:
                    console.log("404 not found");
                    break;
                case 401:
                    console.log("Unauthorized");
                    break;
                default:
                    console.log("Oops somethings went wrong");
                    break;
            }
          }
        );
    }

    onCancel() {
        this.router.navigate(["/businessEdit"]);
    }

    deleteSlot(index) {
        this.businessService.deleteSlot(this.activity.slots[index], this.activity).subscribe(
            (data) => {
                this.activity.slots.splice(index, 1);
            },
            (err) => {
                switch (err.status) {
                    case 404:
                        console.log("404 not found");
                        break;
                    case 401:
                        console.log("Unauthorized");
                        break;
                    default:
                        console.log("Oops somethings went wrong");
                        break;
                }
            }
        );
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
                        var one = new Date(b.startTime);
                        var two = new Date(a.startTime);
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
                },
                (err) => {
                    switch (err.status) {
                        case 404:
                            console.log("404 not found");
                            break;
                        case 401:
                            console.log("Unauthorized");
                            break;
                        default:
                            console.log("Oops somethings went wrong");
                            break;
                    }
                }
            );
        }
        else {
            console.log("Please choose a start and end");
        }
    }

    onUploadError(args: any) {
        console.log('Show error message');
    }

    onUploadSuccess(event) {
        this.activity.photos.push(event[1].data);
        this.myFocusTriggeringEventEmitterOne.emit(true);
        this.myFocusTriggeringEventEmitterTwo.emit(true);

    }

    deletePhoto(index) {
        this.businessService.deleteActivityPhoto(this.activity.photos[index], this.activity).subscribe(
            (date) => {
                this.activity.photos.splice(index, 1);
            },
            (err) => {
                switch (err.status) {
                    case 404:
                        console.log("404 not found");
                        break;
                    case 401:
                        console.log("Unauthorized");
                        break;
                    default:
                        console.log("Oops somethings went wrong");
                        break;
                }
            }
        );
    }

}
