import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from "../user.service";
import { FileUploader } from 'ng2-file-upload';
import { EditUserProfileService} from "./editProfile.service";
import { AppService } from '../../app.service';
import {Http, Headers } from '@angular/http';


import 'rxjs/add/operator/map';


@Component({
    selector: 'app-editUserProfile',
    templateUrl: './editProfile.component.html',
    styleUrls: ['./editProfile.component.css']
})

export class EditUserProfileComponent implements OnInit {
    public uploader: FileUploader = new FileUploader({ url: 'http://localhost:8080/api/user/profile/uploadProfilePicture', itemAlias: "myfile" });
    private profilePicture: String;
    private loggedin: Boolean;
    private isUser: Boolean;
    private user: Object;
    firstName: String;
    lastName: String;
    birthDate: Date;
    @Output() pictureChanged = new EventEmitter<string>();



    path: String = "";
    userId: String = ""; //58f252bd9037f62725ddf62c";

    constructor(
        private activatedRoute: ActivatedRoute,
        private appService: AppService,
        private editProfileService: EditUserProfileService,
        private router: Router,
        private http: Http) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.userId = params['userId'];
        });
        /*this.appService.getCurrentUser().subscribe(data => {
            if(data.success){
                if(data.user){
                this.user = data.user;
                this.isUser = true;
                this.userId = data.user._id;

                }
                else{
                //business
                }
                this.loggedin = true;
            }
            else{
                this.loggedin = false;
            }
        });
        */
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
                this.uploader.onCompleteItem = (item: any, response, headers: any) => {
                    this.initialise();
                    let res = JSON.parse(response);
                    this.pictureChanged.emit(res.data.imagePath);
                    this.profilePicture = res.data.imagePath;

                };
            }
        });
    }

    updateProfile() {

        this.editProfileService.editUserProfile(this.firstName, this.lastName, this.birthDate).subscribe(
            (data) => {
              location.reload();
            }
        );

        //refresh

    }


    onUpload() {
        this.uploader.uploadAll();
    }

    deleteAccount() {

      var _this = this;
      bootbox.confirm({
          title: "Delete Account",
          message: "Are you sure you want to delete your account? This cannot be undone!",
          buttons: {
              cancel: {
                  label: '<i class="fa fa-times"></i> Cancel'
              },
              confirm: {
                  label: '<i class="fa fa-check"></i> Confirm'
              }
          },
          callback: function(result) {
            if(result){
              _this.editProfileService.deleteAccount().subscribe(
                  (data) => {
                      _this.router.navigateByUrl('/');
                  },
                  (err) => {
                      //TODO:
                      //handle and redirect
                  }
              );
            }

          }
      });
    }

}
