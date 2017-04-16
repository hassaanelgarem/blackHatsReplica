import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { EditProfileService} from "./editProfile.service"
import { Router } from '@angular/router';
import {Http, Headers } from '@angular/http';
//import { Business } from "../../../api/data/business.model";
import 'rxjs/add/operator/map';


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
    tags: String[];
    businessId: String = "58e8eb94b0283d09afa30176";

    constructor(
        private editProfileService: EditProfileService,
        private router: Router,
        private http: Http) { }

    ngOnInit() {
      this.initialise();
    }
      initialise() {
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
                this.deposit = data.data.deposit;
                this.phoneNumbers = data.data.phoneNumbers;
                this.tags = data.data.tags;
                if (data.data.logo != null) {
                    this.logo = data.data.logo;
                }
                else {
                    this.logo = "http://localhost:8080/api/image/businessLogos/defaultBLogo.jpg";
                }
                this.uploader = new FileUploader({ url: 'http://localhost:8080/api/business/addLogo', itemAlias: "myfile" });
                this.uploader.onCompleteItem = (item: any, response: any, headers: any) => {
                  this.initialise();
                };
              }
            });
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
        this.phoneNumbers.push("");
    }

    removePhoneNumber() {
        this.phoneNumbers.splice(this.phoneNumbers.indexOf(this.phoneNumbers[this.phoneNumbers.length - 1], 1));
    }

    addTag() {
        this.tags.push("");
    }

    removeTag() {
        this.tags.splice(this.tags.indexOf(this.tags[this.tags.length - 1], 1));
    }

    onUpload() {
        this.uploader.uploadAll();
    }

}
