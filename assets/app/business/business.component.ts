import { Component, OnInit } from '@angular/core';
import { BusinessService } from './business.service';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css']
})
export class BusinessComponent implements OnInit {

  constructor(private businessService: BusinessService) { }

  ngOnInit() {
  }

  openCheckout(){
    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_9AEHvD0gXViwtKYQDpQcLXlY',
      locale: 'auto',
      token: token => this.gotToken(token)
    });

    handler.open({
      name: 'Demo Site',
      description: '2 widgets',
      amount: 2000
    });
  }

  gotToken(token){

    this.businessService.charge(token).subscribe(res => {
      console.log(res);
    });
  }

}
