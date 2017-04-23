import { Component, OnInit, NgModule } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { EditProfileService} from "./editProfile.service";
import { Router } from '@angular/router';
import {Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { BrowserModule } from '@angular/platform-browser';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { AppService } from '../../app.service';


@Component({
    selector: 'app-editProfile',
    templateUrl: './editProfile.component.html',
    styleUrls: ['./editProfile.component.css']
})

export class EditProfileComponent implements OnInit {
    public uploader: FileUploader = new FileUploader({ url: 'http://localhost:8080/api/business/addLogo', itemAlias: "myfile" });
    private logo: String;
    name: String;
    workingFrom: String;
    workingTo: String;
    category: String;
    description: String;
    paymentRequired: Number;
    deposit: Number;
    depositFlag: boolean = false;
    phoneNumbers: String[];
    workingDays: String[];
    tags: String[];
    extraNumber: String = "";
    extraTag: String = "";
    extraDay: String = "";
    path: String = "";
    businessId: String;
    lat: number = 51.678418;
    lng: number = 7.809007;


    constructor(
        private editProfileService: EditProfileService,
        private router: Router,
        private appService: AppService,
        private http: Http) { }

    ngOnInit() {
        this.initialise();
    }
    initialise() {
      this.appService.getCurrentUser().subscribe(
        (data) => {
          if(data.success){
            this.businessId = data.business._id;

            this.editProfileService.getBusinessProfile(this.businessId).subscribe(data => {
                if (data.err) {
                    console.error(data.msg);
                }
                else {
                    this.name = data.data.name;
                    if (data.data.workingHours != null) {
                        this.workingFrom = data.data.workingHours.from;
                        this.workingTo = data.data.workingHours.to;
                    }
                    this.category = data.data.category;
                    this.description = data.data.description;
                    this.paymentRequired = data.data.paymentRequired;
                    if(data.data.paymentRequired == 2){
                      this.depositFlag = true;
                    }
                    else{
                      this.depositFlag = false;
                    }
                    this.deposit = data.data.deposit;
                    this.phoneNumbers = data.data.phoneNumbers;
                    this.tags = data.data.tags;
                    this.workingDays = data.data.workingDays;
                    if(data.data.location != null){
                      this.lng = data.data.location.coordinates[0];
                      this.lat = data.data.location.coordinates[1];
                    }
                    if (data.data.logo != null) {
                        this.path = "http://localhost:8080/api/image/businessLogos/";
                        this.logo = data.data.logo;
                    }
                    else {
                        this.path = "";
                        this.logo = "http://localhost:8080/api/image/businessLogos/defaultBLogo.jpg";
                    }
                    this.uploader = new FileUploader({ url: 'http://localhost:8080/api/business/addLogo', itemAlias: "myfile" });
                    this.uploader.onCompleteItem = (item: any, response: any, headers: any) => {
                        this.initialise();
                    };
                }
            });
          }
        })

    }

    updateProfile() {
        let workingHours = {
            from: this.workingFrom,
            to: this.workingTo
        };
        let location = {
          coordinates: [this.lng, this.lat]
        }
        this.editProfileService.editBusinessProfile(this.name, workingHours, this.workingDays, this.category, location, this.description, this.phoneNumbers, this.tags, this.paymentRequired, this.deposit).subscribe(data => {
            if (data.err) {
                console.error(data.msg);
            }
        });
    }

    cancel(){
      this.initialise();
    }

    showDeposit(value) {
        if (value == 2) {
            this.depositFlag = true;
        }
        else {
            this.depositFlag = false;
        }
    }

    addPhoneNumber() {
        if (this.extraNumber != "") {
            this.tags.push(this.extraNumber);
            this.extraNumber = "";
        }
    }

    removePhoneNumber(index) {
        this.phoneNumbers.splice(index, 1);
    }

    addTag() {
        if (this.extraTag != "") {
            this.tags.push(this.extraTag);
            this.extraTag = "";
        }
    }

    removeTag(index) {
        this.tags.splice(index, 1);
    }

    addWorkingDay() {
        if (this.extraDay != "") {
            this.workingDays.push(this.extraDay);
            this.extraDay = "";
        }
    }

    removeWorkingDay(index) {
        this.workingDays.splice(index, 1);
    }

    onUpload() {
        this.uploader.uploadAll();
    }

    markerDragEnd($event){
      this.lat = $event.coords.lat;
      this.lng = $event.coords.lng;
    }

    mapClicked($event){
      this.lat = $event.coords.lat;
      this.lng = $event.coords.lng;
    }

}
