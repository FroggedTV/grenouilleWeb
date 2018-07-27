import { Injectable } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";


import { APIResult, APIResultAuthTokenGet } from "./APIResults/APIResults";
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokensService {

  refreshToken: string = undefined;
  authToken: string = undefined;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  loadRefreshToken(){
    // Load token from storage
    let localRefreshToken = localStorage.getItem('refreshToken');
    if (localRefreshToken != undefined)
      this.refreshToken = localRefreshToken;
  }

  updateAuthToken(): Observable<APIResult> {
    return this.http.get<APIResult>(environment.baseUrl + '/api/auth/token', this.getRefreshTokenHeader()).pipe(
      tap(json => {
          if (json.success === 'yes') {
            this.authToken = (<APIResultAuthTokenGet> json.payload).token;
          } else {
            this.clean_tokens();
          }
        }
      )
    );
  }

  getRefreshTokenHeader() {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.refreshToken })
    };
  }

  getAuthTokenHeader() {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authToken })
    };
  }

  clean_tokens() {
    this.refreshToken = undefined;
    this.authToken = undefined;
    localStorage.removeItem('refreshToken');
  }

}
