import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Router } from '@angular/router';
import {Http, Headers } from '@angular/http';
import { EditProfileService } from "../editProfile/editProfile.service";

@Component({
  selector: 'app-addPhoto',
  templateUrl: './addPhoto.component.html',
  styleUrls: ['./addPhoto.component.css']
})
export class AddPhotoComponent implements OnInit {
  photos: String[];
  path: String = "http://localhost:8080/api/";
  public uploader: FileUploader = new FileUploader({ url: 'http://localhost:8080/api/business/addPhoto', itemAlias: "myfile" });
  businessId: String = "58e8d68ce4a2cf7c06cff89a";

  constructor(
    private editProfileService: EditProfileService,
    private router: Router,
    private http: Http) { }

  ngOnInit() {
    this.showPhotos();
  }

  showPhotos(){
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

  onUpload() {
      this.uploader.uploadAll();
  }
}
