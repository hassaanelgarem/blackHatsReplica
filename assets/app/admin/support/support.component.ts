import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { SupportRequest } from './support.model';
import { SupportService } from './support.service';

@Component({
  selector: 'app-admin-support',
  templateUrl: './support.component.html'
})


export class SupportComponent implements OnInit {
  private requests: SupportRequest[] = [];
  private loading: boolean = false;

  constructor(private supportService: SupportService) { }
  ngOnInit() {
    this.supportService.getRequests().subscribe(requests => {
      this.requests = requests;
    },
      err => {
        bootbox.alert(err.msg);
      });
  }

  isLoading() {
    return this.loading;
  }

  recoverAccount(requestId: string, accountFlag: string) {
    bootbox.confirm({
      title: "Recover Account?",
      message: "Are you sure you want to allow this person access to his account with a temprary password? This cannot be undone.",
      buttons: {
        cancel: {
          label: '<i class="fa fa-times"></i> Cancel'
        },
        confirm: {
          label: '<i class="fa fa-check"></i> Allow'
        }
      },
      callback: (result) => {
        if (result) {
          this.loading = true;
          this.supportService.recoverAccount(requestId, accountFlag).subscribe(msg => {
            bootbox.alert(msg, () => {
              location.reload();
            });
          },
            err => {
              bootbox.alert(err.msg, () => {
                location.reload();
              });
            });
        }
      }
    });
  }

  rejectRequest(requestId: string) {
    bootbox.confirm({
      title: "Reject Request?",
      message: "Are you sure you want to delete this request? This cannot be undone.",
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
          this.supportService.rejectRequest(requestId).subscribe(msg => {
            bootbox.alert(msg, () => {
              location.reload();
            });
          },
            err => {
              bootbox.alert(err.msg, () => {
                location.reload();
              });
            });
        }
      }
    });
  }
};
