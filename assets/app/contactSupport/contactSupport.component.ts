import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { ContactSupportService } from './contactSupport.service';

@Component({
    selector: 'my-app-contactSupport',
    templateUrl: './contactSupport.component.html'
})

export class ContactSupportComponent {
    constructor(private contactService: ContactSupportService, private router: Router) { }

    submitForm(title: string, contactEmail: string, contactPhoneNumber: string, accountType: string, registeredEmail: string, description: string) {
        this.contactService.submitRequest(title, contactEmail, contactPhoneNumber, accountType, registeredEmail, description).subscribe(
            (data) => {
                bootbox.alert(data.msg, () => {
                    location.reload();
                });
            },
            (err) => {
                if (err.msg)
                    bootbox.alert(err.msg);
                else {
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
            });
    }

    preventDefault(event: Event): void {
        event.preventDefault();
    }
}
