import { UserService } from './user.service';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ChannelService} from "./channel.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  twitch_channel: String = 'froggedtv';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private channelService: ChannelService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['token'] != undefined) {
        localStorage.setItem('refreshToken', params['token']);
        this.router.navigate(['.'], { relativeTo: this.activatedRoute, queryParams: { }, queryParamsHandling: "merge", replaceUrl: true });
        this.userService.updateUserMeGet();
      }
    });

    this.userService.updateUserMeGet();
  }

  channelChanged($event) {
    this.channelService.channelChanged.emit($event.value);
  }

}
