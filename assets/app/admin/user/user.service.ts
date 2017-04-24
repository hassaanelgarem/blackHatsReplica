import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { User } from './user.model';


@Injectable()
export class UserService {
    private alertMsg: string;
    private apiPath: string = "http://54.213.175.206:8080/api/";
    constructor(private http: Http) { }

    getUsers() {
        return this.http.get(this.apiPath + 'admin/user/getVerified')
            //map method to transform the response
            .map((response: Response) => {
                const users = response.json().data;
                let transformedUsers: User[] = [];
                for (let user of users) {
                    transformedUsers.push(new User(
                        user._id,
                        user.firstName, user.lastName, user.email, user.username,
                        user.birthDate, user.admin, user.createdAt, true
                    ));
                }
                return transformedUsers;
            }).catch((error: Response) => Observable.throw(error.json()));
    }

    getUnverifiedUsers() {
        return this.http.get(this.apiPath + 'admin/user/getUnVerified')
            //map method to transform the response
            .map((response: Response) => {
                const users = response.json().data;
                let transformedUsers: User[] = [];
                for (let user of users) {
                    transformedUsers.push(new User(
                        user._id,
                        user.firstName, user.lastName, user.email, user.username,
                        user.birthDate, user.admin, user.createdAt, false
                    ));
                }
                return transformedUsers;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }


    getAdmins() {
        return this.http.get(this.apiPath + 'admin/user/getAdmins')
            //map method to transform the response
            .map((response: Response) => {
                const admins = response.json().data;
                let transformedUsers: User[] = [];
                for (let admin of admins) {
                    transformedUsers.push(new User(
                        admin._id,
                        admin.firstName, admin.lastName, admin.email, admin.username,
                        admin.birthDate, admin.admin, admin.createdAt,
                        true
                    ));
                }
                return transformedUsers;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    getNonAdmins() {
        return this.http.get(this.apiPath + 'admin/user/getNonAdmins')
            //map method to transform the response
            .map((response: Response) => {
                const nonAdmins = response.json().data;
                let transformedUsers: User[] = [];
                for (let nonAdmin of nonAdmins) {
                    transformedUsers.push(new User(
                        nonAdmin._id,
                        nonAdmin.firstName, nonAdmin.lastName, nonAdmin.email, nonAdmin.username,
                        nonAdmin.birthDate, nonAdmin.admin, nonAdmin.createdAt,
                        true
                    ));
                }
                return transformedUsers;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    deleteUser(userId: string, verified: boolean) {
        if (verified) {
            return this.http.delete(this.apiPath + 'admin/user/delete/' + userId)
                //map method to transform the response
                .map((response: Response) => {
                    this.alertMsg = response.json().msg;
                    return this.alertMsg;
                })
                .catch((error: Response) => Observable.throw(error.json()));
        }
        else {
            return this.http.delete(this.apiPath + 'admin/user/deleteTemp/' + userId)
                //map method to transform the response
                .map((response: Response) => {
                    this.alertMsg = response.json().msg;
                    return this.alertMsg;
                })
                .catch((error: Response) => Observable.throw(error.json()));
        }
    }


    assignAdmin(userId: string) {
        var body = {
            admin: true
        }
        return this.http.put(this.apiPath + 'admin/makeAdmin/' + userId, body)
            //map method to transform the response
            .map((response: Response) => {
                this.alertMsg = response.json().msg;
                return this.alertMsg;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    unAssignAdmin(userId: string) {
        var body = {
            admin: false
        }
        return this.http.put(this.apiPath + 'admin/removeAdmin/' + userId, body)
            //map method to transform the response
            .map((response: Response) => {
                this.alertMsg = response.json().msg;
                return this.alertMsg;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }
}
