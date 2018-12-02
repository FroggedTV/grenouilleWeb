import { Component, OnInit } from '@angular/core';
import { environment } from "../../environments/environment";
import { APIResult } from "../APIResults/APIResults";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-stats-scene',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  froggedCurrentWeek: string;
  froggedNextWeek: string;
  artifactCurrentWeek: string;
  artifactNextWeek: string;
  error_text: string = undefined;

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.froggedCurrentWeek = environment.baseUrl + '/api/stats/img/calendar_frogged_now';
    this.froggedNextWeek = environment.baseUrl + '/api/stats/img/calendar_frogged_next';
    this.artifactCurrentWeek = environment.baseUrl + '/api/stats/img/calendar_artifact_fr_now';
    this.artifactNextWeek = environment.baseUrl + '/api/stats/img/calendar_artifact_fr_next';
    this.error_text = undefined;

    this.imageGenerationUpdate();
  }

  rebuildCalendar() {
    this.error_text = undefined;
    this.http.post<APIResult>(environment.baseUrl + '/api/calendar/generate', {}).subscribe(json => {
      if (json.success === 'yes') {
        this.imageGenerationUpdate();
      } else {
        this.error_text = json['error']
      }
    });
  }

  imageGenerationUpdate() {
    let cache_busting = '?m=' + Math.floor((Math.random()*100000)).toString();
    this.froggedCurrentWeek = environment.baseUrl + '/api/stats/img/calendar_froggedtv_now' + cache_busting;
    this.froggedNextWeek = environment.baseUrl + '/api/stats/img/calendar_froggedtv_next' + cache_busting;
    this.artifactCurrentWeek = environment.baseUrl + '/api/stats/img/calendar_artifact_fr_now' + cache_busting;
    this.artifactNextWeek = environment.baseUrl + '/api/stats/img/calendar_artifact_fr_next' + cache_busting;
  }

}
