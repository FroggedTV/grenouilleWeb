import { Injectable } from '@angular/core';
import {APIResult, APIResultUserMeDetails} from "./APIResults/APIResults";
import {environment} from "../environments/environment";
import {TokensService} from "./tokens.service";
import {HttpClient} from "@angular/common/http";
import {ChannelService} from "./channel.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  steam_id: string = undefined;
  scopes: { [id: string]: string[] } = undefined;

  constructor(
    private tokenService: TokensService,
    private http: HttpClient,
    private channelService: ChannelService
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
      }
    });
  }

  hasScopeInCurrentChannel(scope: string) {
    return (this.scopes != undefined &&
            this.scopes[this.channelService.channel] != undefined &&
            this.scopes[this.channelService.channel].includes(scope))
  }

  hasScope(channel: string, scope: string) {
    return (this.scopes != undefined &&
      this.scopes[channel] != undefined &&
      this.scopes[channel].includes(scope))
  }
}
