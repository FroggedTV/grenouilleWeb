import { Component, OnInit } from '@angular/core';
import {TokensService} from "../tokens.service";
import {UserService} from "../user.service";
import {Router} from "@angular/router";
import {APIResult, APIResultOBSPlaylistGet, APIResultStatsCSVGet} from "../APIResults/APIResults";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-stats-csv',
  templateUrl: './stats-csv.component.html',
  styleUrls: ['./stats-csv.component.css']
})
export class StatsCsvComponent implements OnInit {

  selectedTabIndex: number = 0;
  csvSave: string = undefined;
  csvContent: string[] = ['', '', '', ''];
  csvKeys: string[] = ['preti8_teams', 'preti8_players', 'ti8_group_a', 'ti8_group_b'];
  dataTrees: Object[][] = [[], [], [], []];
  error_text: string = '';
  imageCacheBusting: string = '';
  selectedTeam: string = '15';
  selectedPlayer: string = '86745912';
  generatingImage: boolean = false;

  baseUrl: string = '';

  constructor(
    private tokenService: TokensService,
    private userService: UserService,
    private router: Router,
    private http: HttpClient
  ) {
    this.baseUrl = environment.baseUrl;
  }

  ngOnInit() {
    this.refreshUI();
  }

  resetUI() {
    this.csvSave = undefined;
    this.csvContent = ['', '', '', '', ''];
    this.dataTrees = [[], [], [], [], []];
    this.imageCacheBusting = Math.floor((Math.random()*1000)).toString();
  }

  refreshUI() {
    this.resetUI();

    for (let i in this.csvKeys) {
      let options = {
        params: {data: JSON.stringify({'key': this.csvKeys[i]})},
        headers: this.tokenService.getAuthTokenHeader().headers
      };
      this.http.get<APIResult>(environment.baseUrl + '/api/stats/csv/get', options).subscribe(json => {
        if (json.success === 'yes') {
          this.error_text = undefined;
          let payload = (<APIResultStatsCSVGet> json.payload);
          this.csvContent[i] = payload.csv;
          this.buildDataTree(i);
        } else {
          this.error_text = json.error;
        }
      });
    }
  }

  buildDataTree(i) {
    this.dataTrees[i] = this.CSVtoArray(this.csvContent[i]);
  }

  CSVtoArray(csv) {
    let objPattern = new RegExp((
      // Delimiters.
      "(\\" + "," + "|\\r?\\n|\\r|^)" +
      // Quoted fields.
      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
      // Standard fields.
      "([^\"\\" + "," + "\\r\\n]*))"), "gi");
    let arrData = [[]];
    var arrMatches = null;
    while (arrMatches = objPattern.exec(csv)) {
      var strMatchedDelimiter = arrMatches[1];
      if (strMatchedDelimiter.length && (strMatchedDelimiter != ",")) {
        arrData.push([]);
      }
      if (arrMatches[2]) {
        let strMatchedValue = arrMatches[2].replace(
          new RegExp("\"\"", "g"), "\"");
      } else {
        var strMatchedValue = arrMatches[3];
      }
      arrData[arrData.length - 1].push(strMatchedValue);
    }
    if (arrData[arrData.length-1].length == 0) {
      arrData.splice(arrData.length-1, 1);
    }
    return arrData;
  }

  tabChanged(event) {
    if (this.csvSave != undefined) {
      this.csvContent[this.selectedTabIndex] = this.csvSave;
      this.csvSave = undefined;
    }
    this.selectedTabIndex = event;
  }

  editCSV() {
    this.csvSave = this.csvContent[this.selectedTabIndex];
  }

  validateEdit() {
    let payload = {'key': this.csvKeys[this.selectedTabIndex], 'value': this.csvContent[this.selectedTabIndex]};
    this.http.post<APIResult>(environment.baseUrl + '/api/stats/csv/update', payload , this.tokenService.getAuthTokenHeader()).subscribe(json => {
      if (json.success === 'yes') {
        this.error_text = undefined;
        this.csvSave = undefined;
        this.buildDataTree(this.selectedTabIndex);
      } else {
        this.error_text = json.error;
      }
    });
  }

  cancelEdit() {
    this.csvContent[this.selectedTabIndex] = this.csvSave;
    this.csvSave = undefined;
  }

  generateImages() {
    this.generatingImage = true;
    let payload = {'key': this.csvKeys[this.selectedTabIndex]};
    this.http.post<APIResult>(environment.baseUrl + '/api/stats/csv/img/generate', payload , this.tokenService.getAuthTokenHeader()).subscribe(json => {
      if (json.success === 'yes') {
        this.error_text = undefined;
        this.generatingImage = false;
        this.refreshUI();
      } else {
        this.error_text = json.error;
      }
    });
  }
}
