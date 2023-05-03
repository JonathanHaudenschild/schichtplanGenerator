import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Http, HttpResponse } from '@capacitor-community/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParticipantAuthApiService {
  private participantAuthURL = environment.api_url + '/participants';
  constructor() { }

  signIn(participantToken: string): Observable<HttpResponse> {
    const options = {
      url: this.participantAuthURL + '/signin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      data: {
        participantToken
      }
    };
    return from(Http.post(options));
  }

  updateProfile(participantToken: string, updateData: any): Observable<HttpResponse> {
    const options = {
      url: this.participantAuthURL + `/${participantToken}/profile`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      data: updateData
    };
    return from(Http.put(options));
  }
}
