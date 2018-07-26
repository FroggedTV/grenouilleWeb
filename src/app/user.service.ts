import { Injectable } from '@angular/core';
import {APIResult, APIResultUserMeDetails} from "./APIResults/APIResults";
import {environment} from "../environments/environment";
import {TokensService} from "./tokens.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  steam_id: string = undefined;
  scopes: string[] = undefined;

  constructor(
    private tokenService: TokensService,
    private http: HttpClient
  ) { }

  isLogged() {
    return (this.steam_id != undefined);
  }

  updateUserMeGet() {
    this.http.get<APIResult>(environment.baseUrl + '/api/user/me/details').subscribe(json => {
      if (json.success === 'yes') {
        let result = <APIResultUserMeDetails> json.payload;
        this.steam_id = result.steam_id;
        this.scopes = result.scopes;
      } else {
        console.log(json);
      }
    });
  }

  hasScope(scope: string) {
    return (this.scopes != undefined && this.scopes.includes(scope))
  }

}
