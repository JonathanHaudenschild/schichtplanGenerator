import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http';
import { HttpResponse } from '@capacitor/core';
import { from, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { getData } from './service-helpers';

@Injectable({
    providedIn: 'root'
})
export class AuthManagementService {
    public token = '';

    private userURL = environment.api_url + '/users';
    public setToken(token: string) {
        this.token = token;
    }

    constructor() {

    }


    signUp(username: string, email: string, password: string): Observable<HttpResponse> {
        const options = {
            url: this.userURL + '/register',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
            },
            data: {
                username,
                email,
                password
            },
        };
        return from(getData(Http.post(options)))
    }


    signIn(email: string, password: string): Observable<HttpResponse> {
        const options = {
            url: this.userURL + '/login',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
            },
            data: {
                email,
                password,
            },
        };
        return from(getData(Http.post(options))) 
    }
}
