import { Observable, from } from 'rxjs';
import { Http, HttpResponse } from '@capacitor-community/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Participant } from '../store/schedule/schedule.model';
import { AuthManagementService } from './auth-management.service';
import { getData } from './service-helpers';

@Injectable({
  providedIn: 'root'
})
export class ParticipantApiService {

  private groupURL = environment.api_url + '/groups';
  constructor(private authService: AuthManagementService) { }

  getParticipants(groupId: number): Observable<HttpResponse> {
    const options = {
      url: this.groupURL + '/' + groupId + '/participants',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'x-auth-token': this.authService.getToken()
      }
    };
    return from(getData(Http.get(options)));
  }

  createParticipant(groupId: number, participantData: Participant): Observable<HttpResponse> {
    const options = {
      url: this.groupURL + '/' + groupId + '/participants',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'x-auth-token': this.authService.getToken()
      },
      data: participantData
    };
    console.log(participantData)
    return from(getData(Http.post(options)));
  }

  getParticipantById(groupId: number, participantId: number): Observable<HttpResponse> {
    const options = {
      url: this.groupURL + '/' + groupId + '/participants/' + participantId,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'x-auth-token': this.authService.getToken()
      }
    };
    return from(getData(Http.get(options)));
  }

  updateParticipant(groupId: number, participantId: number, participantData: Participant): Observable<HttpResponse> {
    const options = {
      url: this.groupURL + '/' + groupId + '/participants/' + participantId,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'x-auth-token': this.authService.getToken()
      },
      data: participantData
    };
    return from(getData(Http.put(options)));
  }

  deleteParticipant(groupId: number, participantId: number): Observable<HttpResponse> {
    const options = {
      url: this.groupURL + '/' + groupId + '/participants/' + participantId,
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
