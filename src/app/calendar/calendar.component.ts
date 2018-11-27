import { Component, OnInit } from '@angular/core';
import { environment } from "../../environments/environment";
import { APIResult } from "../APIResults/APIResults";
import { HttpClient } from "@angular/common/http";
import {ChannelService} from "../channel.service";
import {UserService} from "../user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-stats-scene',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  calendar_halfday: string[];
  calendar_fullday: string[];
  error_text: string = undefined;

  constructor(
    private http: HttpClient,
    private channelService: ChannelService,
    private userService: UserService,
    private router: Router
  ) {
    this.channelService.channelChanged.subscribe(channel => {
      if (!this.userService.hasScope(channel, 'calendar')) {
        this.router.navigate(['/index']);
      } else {
        this.refreshUI();
      }
    });
  }

  ngOnInit() {
    this.refreshUI();
  }

  rebuildCalendar() {
    let payload = {
      'channel': this.channelService.channel
    };
    this.http.post<APIResult>(environment.baseUrl + '/api/calendar/generate', payload).subscribe(json => {
      if (json.success === 'yes') {
        this.error_text = undefined;
        this.refreshUI();
      } else {
        this.error_text = json['error']
      }
    });
  }

  refreshUI() {
    let cache_busting = '?m=' + Math.floor((Math.random()*100000)).toString();
    this.calendar_halfday = [
      environment.baseUrl + '/api/calendar/img/calendar_' + this.channelService.channel + '_current_10h2h.png' + cache_busting,
      environment.baseUrl + '/api/calendar/img/calendar_' + this.channelService.channel + '_next_10h2h.png' + cache_busting
    ];
    this.calendar_fullday = [
      environment.baseUrl + '/api/calendar/img/calendar_' + this.channelService.channel + '_current_0h0h.png' + cache_busting,
      environment.baseUrl + '/api/calendar/img/calendar_' + this.channelService.channel + '_next_0h0h.png' + cache_busting
    ];
  }

}
