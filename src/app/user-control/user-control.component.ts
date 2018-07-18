import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {TokensService} from "../tokens.service";
import {APIResult, APIResultUserScopeList} from "../APIResults/APIResults";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-user-control',
  templateUrl: './user-control.component.html',
  styleUrls: ['./user-control.component.css']
})
export class UserControlComponent implements OnInit {

  displayColumn = ['id', 'user_scope', 'obs_control', 'vod_manage'];
  usersData = [];
  totalDisplay: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;

  error_text: string = undefined;

  constructor(
    private router: Router,
      private http: HttpClient,
      private tokenService: TokensService
  ) { }

  ngOnInit() {
    if (this.tokenService.refreshToken == undefined) {
      this.router.navigate(['/index']);
      return;
    }
    if (this.tokenService.authToken != undefined)
      this.refreshUI();
    this.tokenService.newAuthToken.subscribe(isValid => {
      if (isValid) {
        this.refreshUI();
      } else {
        this.resetUI();
      }
    });
  }

  resetUI() {
    this.usersData = [];
    this.totalDisplay = 0;
    this.pageSize = 10;
    this.pageIndex = 0;
  }

  refreshUI() {
    let options = {
      params: {data: JSON.stringify({limit: this.pageSize, offset: this.pageIndex*this.pageSize})},
      headers: this.tokenService.getAuthTokenHeader().headers
    };
    this.http.get<APIResult>(environment.baseUrl + '/api/auth/user/scope/list', options ).subscribe(json => {
      if (json.success === 'yes') {
        this.error_text = undefined;
        let result = (<APIResultUserScopeList>json.payload);
        this.totalDisplay = result.total;
        let new_data = [];
        for (let user of result.users) {
          let user_data = {
            id: user.id,
            user_scope: user.scopes.indexOf('user_scope') >= 0,
            obs_control: user.scopes.indexOf('obs_control') >= 0,
            vod_manage: user.scopes.indexOf('vod_manage') >= 0
          };
          new_data.push(user_data);
        }
        this.usersData = new_data;
      } else {
        this.error_text = json.error;
      }
    });
  }

  onPage(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.refreshUI();
  }

  onCheck(event, id, scope) {
    let url = 'remove';
    if (event.checked)
      url = 'add';

    let payload = {
      id: id,
      scopes: [scope]
    };

    this.http.post<APIResult>(environment.baseUrl + '/api/auth/user/scope/' + url, payload, this.tokenService.getAuthTokenHeader() ).subscribe(json => {
      console.log(json);
      if (json.success === 'no') {
        event.source.checked = !event.source.checked;
        this.error_text = json.error;
      }
    });
    console.log(id);
    console.log(scope);
  }
}
