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
  constructor(private businessService: BusinessService) { }
  ngOnInit() {
    this.businessService.getBusinesses().subscribe(businesses => {
      this.businesses = businesses
    });
  }

  deleteBusiness(businessId: string) {
    this.businessService.deleteBusiness(businessId).subscribe(msg => {
      alert(msg);
      location.reload();
    });
  }

  viewBusiness(businessId: string) {
    //To be adjusted for the user profile route.
    alert('To be redirected to profile');
    // this.router.navigate(['admin', userId]);
  }
};
