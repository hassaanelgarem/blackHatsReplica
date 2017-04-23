import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Router } from '@angular/router';
import { Http, Headers } from '@angular/http';
import { EditProfileService } from "../editProfile/editProfile.service";
import { AddPhotoService } from "./addPhoto.service";
import { AppService } from '../../app.service';

@Component({
  selector: 'app-addPhoto',
  templateUrl: './addPhoto.component.html',
  styleUrls: ['./addPhoto.component.css']
})
export class AddPhotoComponent implements OnInit {
  photos: String[];
  path: String = "http://localhost:8080/api/";
  public uploader: FileUploader = new FileUploader({ url: 'http://localhost:8080/api/business/addPhoto', itemAlias: "myfile" });
  businessId: String;

  constructor(
    private editProfileService: EditProfileService,
    private addPhotoService: AddPhotoService,
    private router: Router,
    private appService: AppService,
    private http: Http) { }

  ngOnInit() {
    this.showPhotos();
  }

  showPhotos(){
    this.appService.getCurrentUser().subscribe(
      (data) => {
        if(data.success){
            this.businessId = data.business._id;

            this.editProfileService.getBusinessProfile(this.businessId).subscribe(data => {
              if (data.err) {
                console.error(data.msg);
              }
              else {
                this.photos = data.data.photos;
              }
              this.uploader = new FileUploader({ url: 'http://localhost:8080/api/business/addPhoto', itemAlias: "myfile" });
              this.uploader.onCompleteItem = (item: any, response: any, headers: any) => {
                  this.showPhotos();
              };
            });
        }
  });
}

  onUpload() {
      this.uploader.uploadAll();
  }

  deletePhoto(index){
    var _this = this;
    bootbox.confirm({
        title: "Delete Photo",
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
          if(result){
            _this.addPhotoService.deletePhoto(_this.photos[index]).subscribe(data => {
              _this.showPhotos();
            });
          }

        }
    });


  }
}
