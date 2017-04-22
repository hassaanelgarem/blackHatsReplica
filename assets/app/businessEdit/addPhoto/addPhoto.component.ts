import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Router } from '@angular/router';
import { Http, Headers } from '@angular/http';
import { EditProfileService } from "../editProfile/editProfile.service";
import { AddPhotoService } from "./addPhoto.service";

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
        private addPhotoService: AddPhotoService,
        private router: Router,
        private http: Http) { }

    ngOnInit() {
        this.showPhotos();
    }

    showPhotos() {
        this.editProfileService.getBusinessProfile(this.businessId).subscribe(
          (data) => {
            this.photos = data.data.photos;

            this.uploader = new FileUploader({ url: 'http://localhost:8080/api/business/addPhoto', itemAlias: "myfile" });
            this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
              switch (status) {
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
                this.showPhotos();
            };
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

    onUpload() {
        this.uploader.uploadAll();
    }

    deletePhoto(index) {
        this.addPhotoService.deletePhoto(this.photos[index]).subscribe(
            (data) => {
                this.showPhotos();
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
            }

        );

    }
}
