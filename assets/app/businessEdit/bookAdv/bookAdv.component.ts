import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { BookAdvService } from "./bookAdv.service"
import { AppService } from "../../app.service"
import { Router } from '@angular/router';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
    selector: 'app-bookAdv',
    templateUrl: './bookAdv.component.html',
    styleUrls: ['./bookAdv.component.css']
})
export class BookAdvComponent implements OnInit {
    advertisements: any[];
    availableSlots: Date[] = [];
    date: Date;
    noOfDays: number[] = [];
    public uploader: FileUploader = new FileUploader({ url: 'http://localhost:8080/api/advertisement/addAdvPhoto', itemAlias: "myfile" });;
    startTime: Date = new Date();
    endTime: Date = new Date();
    startTimeValue: Date = new Date();
    endTimeValue: Date = new Date();
    path: String;
    advPicture: String;

    private advNoOfDaysWarning: boolean = false;
    private advImgWarning: boolean = false;
    private successfulBooking: boolean = false;

    constructor(
        private bookAdvService: BookAdvService,
        private router: Router,
        private http: Http,
        private appService: AppService
    ) { }

    ngOnInit() {
        this.advPicture = "http://localhost:8080/api/image/businessAds/defaultAPic.jpg";
        this.showAdvSlots();
    }

    showAdvSlots() {
        this.bookAdvService.getAdvSlots().subscribe(
            (data) => {
                this.advertisements = data.data;
                let i = 0;
                for (let advertisement of this.advertisements) {
                    this.getFreeSlot(data.data[i]._id);
                    i++;
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

    getFreeSlot(index) {
        this.bookAdvService.getFreeSlot(index).subscribe(
            (data) => {
                this.availableSlots.push(data.data);
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

    uploadAdvPicture() {
        this.uploader.uploadAll();
        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            switch (status) {
                case 404:
                    this.router.navigateByUrl('/404-error');
                    break;
                case 401:
                    this.router.navigateByUrl('/notAuthorized-error');
                    break;
                case 200:
                    break;
                default:
                    this.router.navigateByUrl('/500-error');
                    break;
            }
            this.advPicture = JSON.parse(response).data;
            this.path = "http://localhost:8080/api/image/businessAds/";
        }
    }




    bookAdv(advId, index) {
        if (!this.noOfDays || this.noOfDays.length == 0) {
            this.advNoOfDaysWarning = true;
        }
        else {
            this.advNoOfDaysWarning = false;
        }
        if (!this.advPicture || this.advPicture.length == 0 || this.advPicture === "http://localhost:8080/api/image/businessAds/defaultAPic.jpg") {
            this.advImgWarning = true;
        }
        else {
            this.advImgWarning = false;
        }
        if (!this.advImgWarning && !this.advNoOfDaysWarning) {
            this.startTimeValue = new Date(this.availableSlots[index]);
            this.endTimeValue = new Date();
            this.endTimeValue.setDate(this.startTimeValue.getDate() + this.noOfDays[index]);

            var handler = (<any>window).StripeCheckout.configure({
                key: 'pk_test_9AEHvD0gXViwtKYQDpQcLXlY',
                locale: 'auto',
                currency: 'egp',
                token: token => this.gotToken(token, advId)
            });

            handler.open({
                name: 'Book Advertisement',
                description: this.advertisements[index].name,
                amount: this.advertisements[index].price * 100
            });
        }
        else {
            $("#back-to-top").click();
        }
    }

    gotToken(token, advId) {

        this.appService.charge(token).subscribe(res => {
            this.bookAdvService.bookAdvSlot(this.startTimeValue, this.endTimeValue, this.advPicture, advId).subscribe(
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

    hideAdvImgWarning() {
        this.advImgWarning = false;
    }

    hideNoOfDaysWarning() {
        this.advNoOfDaysWarning = false;
    }
}
