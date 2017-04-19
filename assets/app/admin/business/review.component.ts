import { Business } from './business.model';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { BusinessService } from './business.service';


@Component({
  selector: 'app-admin-business-review',
  templateUrl: './review.component.html'
})


export class ReviewComponent implements OnInit {
  private businesses: Business[] = [];
  private loading: boolean = false;

  constructor(private businessService: BusinessService) { }
  ngOnInit() {
    this.businessService.getBusinesses().subscribe(businesses => {
      this.businesses = businesses
    });
  }

  isLoading() {
    return this.loading;
  }

  deleteBusiness(businessId: string) {
    bootbox.confirm({
      title: "Delete Business?",
      message: "Are you sure you want to delete this business? This cannot be undone.",
      buttons: {
        cancel: {
          label: '<i class="fa fa-times"></i> Cancel'
        },
        confirm: {
          label: '<i class="fa fa-check"></i> Delete'
        }
      },
      callback: (result) => {
        if (result) {
          this.loading = true;
          this.businessService.deleteBusiness(businessId).subscribe(msg => {
            bootbox.alert(msg, () => {
              location.reload();
            });
          });
        }
      }
    });
  }

  viewBusiness(businessId: string) {
    //To be adjusted for the user profile route.
    bootbox.alert('To be redirected to profile');
    // this.router.navigate(['admin', userId]);
  }
};
