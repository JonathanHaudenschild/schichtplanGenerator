import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http';
import { HttpResponse } from '@capacitor/core';
import { Observable, from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Group } from '../store/schedule/schedule.model';
import { AuthManagementService } from './auth-management.service';
import { getData } from './service-helpers';

@Injectable({
  providedIn: 'root'
})
export class GroupApiService {
  private groupURL = environment.api_url + '/groups';

  constructor(private authService: AuthManagementService) { }

  getGroups(): Observable<HttpResponse> {
    const options = {
      url: this.groupURL,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'x-auth-token': this.authService.getToken()
      }
    };
    return from(getData(Http.get(options)));
  }

  createGroup(groupData: Group): Observable<HttpResponse> {
    const options = {
      url: this.groupURL,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'x-auth-token': this.authService.getToken()
      },
      data: groupData,
    };
    return from(getData(Http.post(options)));
  }

  getGroupById(groupId: number): Observable<HttpResponse> {
    const options = {
      url: this.groupURL + `/${groupId}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'x-auth-token': this.authService.getToken()
      }
    };
    return from(getData(Http.get(options)));
  }

  updateGroup(groupId: number, groupData: Group): Observable<HttpResponse> {
    const options = {
      url: this.groupURL + `/${groupId}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'x-auth-token': this.authService.getToken()
      },
      data: groupData,
    };
    return from(getData(Http.put(options)));
  }

  deleteGroup(groupId: number): Observable<HttpResponse> {
    const options = {
      url: this.groupURL + `/${groupId}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'x-auth-token': this.authService.getToken()
      }
    };
    return from(getData(Http.del(options)));
  }

  generateShifts(groupId: number): Observable<HttpResponse> {
    const options = {
      url: this.groupURL + `/${groupId}/generateShifts`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'x-auth-token': this.authService.getToken()
      }
    };
    return from(getData(Http.post(options)));
  }
}