import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Http, HttpResponse } from '@capacitor-community/http';
import { environment } from 'src/environments/environment';
import { AuthManagementService } from './auth-management.service';
import { getData } from './service-helpers';

@Injectable({
  providedIn: 'root'
})
export class ShiftApiService {

  private groupURL = environment.api_url + '/groups';
  constructor(private authService: AuthManagementService) { }

  getShifts(groupId: number): Observable<HttpResponse> {
    const options = {
      url: this.groupURL + '/' + groupId + '/shifts',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'x-auth-token': this.authService.getToken()
      }
    };
    return from(getData(Http.get(options)));
  }

  createShift(groupId: number, shiftData: any): Observable<HttpResponse> {
    const options = {
      url: this.groupURL + '/' + groupId + '/shifts',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'x-auth-token': this.authService.getToken()
      },
      data: shiftData
    };
    return from(getData(Http.post(options)));
  }

  getShiftById(groupId: number, shiftId: number): Observable<HttpResponse> {
    const options = {
      url: this.groupURL + '/' + groupId + '/shifts' + shiftId,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'x-auth-token': this.authService.getToken()
      }
    };
    return from(getData(Http.get(options)));
  }

  updateShift(groupId: number, shiftId: number, shiftData: any): Observable<HttpResponse> {
    const options = {
      url: this.groupURL + '/' + groupId + '/shifts' + shiftId,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'x-auth-token': this.authService.getToken()
      },
      data: shiftData
    };
    return from(getData(Http.put(options)));
  }

  deleteShift(groupId: number, shiftId: number): Observable<HttpResponse> {
    const options = {
      url: this.groupURL + '/' + groupId + '/shifts' + shiftId,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'x-auth-token': this.authService.getToken()
      }
    };
    return from(getData(Http.del(options)));
  }
}