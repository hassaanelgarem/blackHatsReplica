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
    public uploader: FileUploader = new FileUploader({ url: 'http://localhost:8080/api/user/profile/uploadProfilePicture', itemAlias: "myfile" });
    private profilePicture: String;
    firstName: String;
    lastName: String;
    birthDate: Date;

    path: String = "";
    userId: String = "58f2524179efae7640c1c949";

    constructor(
        private editProfileService: EditProfileService,
        private router: Router,
        private http: Http) { }

    ngOnInit() {
        this.initialise();
    }
    initialise() {
        this.editProfileService.getOneUser(this.userId).subscribe(data => {
            if (data.err) {
                console.error(data.msg);
            }
            else {
                this.firstName = data.data.firstName;
                this.lastName = data.data.lastName;
                this.birthDate = data.data.birthDate;

                if (data.data.profilePicture != null) {
                    this.path = "http://localhost:8080/api/image/profilePictures/";
                    this.profilePicture = data.data.profilePicture;
                }
                else {
                    this.path = "";
                    this.profilePicture = "http://localhost:8080/api/image/profilePictures/defaultpp.jpg";
                }
                this.uploader = new FileUploader({ url: 'http://localhost:8080/api/user/profile/uploadProfilePicture', itemAlias: "myfile" });
                this.uploader.onCompleteItem = (item: any, response: any, headers: any) => {
                    this.initialise();
                };
            }
        });
    }

    updateProfile() {

        this.editProfileService.editUserProfile(this.firstName, this.lastName, this.birthDate).subscribe(data => {
            if (data.err) {
                
                console.error(data.msg);
            }
        });

        //this.router.navigateByUrl('dummy');
        //this.router.navigateByUrl('user');
    }

    /*
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
    */

    onUpload() {
        this.uploader.uploadAll();
    }

}
