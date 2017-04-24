import { Business } from './business.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { BusinessService } from './business.service';


@Component({
  selector: 'app-admin-business-review',
  templateUrl: './review.component.html'
})


export class ReviewComponent implements OnInit {
  private businesses: Business[] = [];
  private loading: boolean = false;

  constructor(private businessService: BusinessService, private router: Router) { }
  ngOnInit() {
    this.businessService.getBusinesses().subscribe(businesses => {
      this.businesses = businesses
    },
      err => {
        bootbox.alert(err.msg);
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
          },
            err => {
              bootbox.alert(err.msg);
              location.reload();
            });
        }
      }
    });
  }

  viewBusiness(businessId: string) {
    this.router.navigate(['/business', businessId]);
  }
};
