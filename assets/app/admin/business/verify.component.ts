import { Business } from './business.model';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { BusinessService } from './business.service';


@Component({
  selector: 'app-admin-business-verify',
  templateUrl: './verify.component.html'
})


export class VerifyComponent implements OnInit {
  private businesses: Business[] = [];
  constructor(private businessService: BusinessService) { }
  ngOnInit() {
    this.businessService.getUnverifiedBusinesses().subscribe(businesses => {
      this.businesses = businesses
    });
  }

  verifyBusiness(businessId: string) {
    this.businessService.verifyBusiness(businessId).subscribe(msg => {
      alert(msg);
      location.reload();
    });
  }
};
