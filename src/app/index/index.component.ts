import { Component, OnInit } from '@angular/core';

import { TokensService } from "../tokens.service";
import {environment} from "../../environments/environment";
import {UserService} from "../user.service";
import {ChannelService} from "../channel.service";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  authToken: string = '';

  constructor(
    public tokenService: TokensService,
    public userService: UserService,
    public channelService: ChannelService
  ) { }

  ngOnInit() {}

  logout() {
    this.tokenService.clean_tokens();
    location.href = environment.baseWeb;
  }

  login() {
    location.href = environment.baseUrl + '/api/auth/login/steam';
  }

}
