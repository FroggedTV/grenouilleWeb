import {Component, OnInit} from '@angular/core';
import {TokensService} from "../tokens.service";
import {HttpClient} from "@angular/common/http";

import {
  APIResult,
  APIResultOBSPlaylistGet,
  APIResultOBSSceneList,
  APIResultOBSStatus,
  APIResultVODFileList
} from "../APIResults/APIResults";
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";
import {UserService} from "../user.service";
import { AbstractFileTreeComponent } from '../shared/file-tree/abstract-file-tree.component'

@Component({
  selector: 'app-obs-control',
  templateUrl: './obs-control.component.html',
  styleUrls: ['./obs-control.component.css', '../shared/file-tree/file-tree.css']
})
export class ObsControlComponent extends AbstractFileTreeComponent implements OnInit {

  statusStreaming: boolean = false;
  statusRecording: boolean = false;
  scenes: string[] = [];
  activeScene: string = '';

  statusStreamingUI: boolean = false;
  statusRecordingUI: boolean = false;
  activeSceneUI: string = '';
  obs_playlist: string[] = [];
  removedFromPlaylist: string[] = [];

  constructor(
    private router: Router,
    http: HttpClient,
    private tokenService: TokensService,
    private userService: UserService
  ) {
    super(http);
  }
  
  ngOnInit() {
    this.refreshUI();
  }

  resetUI() {
    this.treeData.data = [];
    this.statusStreaming = false;
    this.statusRecording = false;
    this.scenes = [];
    this.activeScene = '';
    this.statusStreamingUI = false;
    this.statusRecordingUI = false;
    this.activeSceneUI = '';
    this.obs_playlist = [];
    this.error_text = undefined;
  }

  refreshUI() {
    this.error_text = undefined;
    this.updateSceneList();
    this.updateOBSStatus();
    this.updateOBSPlaylist();
  }

  updateSceneList() {
    this.http.get<APIResult>(environment.baseUrl + '/api/obs/scene/list').subscribe(json => {
      if (json.success === 'yes') {
        this.error_text = undefined;
        let payload = (<APIResultOBSSceneList> json.payload);
        this.activeScene = payload.active_scene;
        this.activeSceneUI = payload.active_scene;
        this.scenes = payload.scenes;
      } else {
        this.error_text = json.error;
      }
    });
  }

  changeScene() {
    let payload = { 'scene': this.activeSceneUI };
    this.http.post<APIResult>(environment.baseUrl + '/api/obs/scene/update', payload).subscribe(json => {
      if (json.success === 'yes') {
        this.error_text = undefined;
        this.activeScene = this.activeSceneUI;
      } else {
        this.activeSceneUI = this.activeScene;
        this.error_text = json.error;
      }
    });
  }

  updateOBSStatus() {
    this.http.get<APIResult>(environment.baseUrl + '/api/obs/status').subscribe(json => {
      if (json.success === 'yes') {
        this.error_text = undefined;
        let payload = (<APIResultOBSStatus> json.payload);
        this.statusRecordingUI = payload.recording;
        this.statusRecording = payload.recording;
        this.statusStreamingUI = payload.streaming;
        this.statusStreaming = payload.streaming;
      } else {
        this.error_text = json.error;
      }
    });
  }

  changeStreaming() {
    let url = 'stop';
    if (this.statusStreamingUI)
      url = 'start';

    let payload = {};
    this.http.post<APIResult>(environment.baseUrl + '/api/obs/stream/' + url, payload).subscribe(json => {
      if (json.success === 'yes') {
        this.error_text = undefined;
        this.statusStreaming = this.statusStreamingUI;
      } else {
        this.statusStreamingUI = this.statusStreaming;
        this.error_text = json.error;
      }
    });
  }

  changeRecording() {
    let url = 'stop';
    if (this.statusRecordingUI)
      url = 'start';

    let payload = {};
    this.http.post<APIResult>(environment.baseUrl + '/api/obs/record/' + url, payload).subscribe(json => {
      if (json.success === 'yes') {
        this.error_text = undefined;
        this.statusRecording = this.statusRecordingUI;
      } else {
        this.statusRecordingUI = this.statusRecording;
        this.error_text = json.error;
      }
    });
  }

  restartRTMP() {
    let payload = {};
    this.http.post<APIResult>(environment.baseUrl + '/api/obs/rtmp/restart', payload).subscribe(json => {
      if (json.success === 'yes') {
        this.error_text = undefined;
      } else {
        this.error_text = json.error;
      }
    });
  }

  updateOBSPlaylist() {
    this.http.get<APIResult>(environment.baseUrl + '/api/obs/playlist/get').subscribe(json => {
      if (json.success === 'yes') {
        this.error_text = undefined;
        let payload = (<APIResultOBSPlaylistGet> json.payload);
        this.obs_playlist = payload.files;
      } else {
        this.error_text = json.error;
      }
    });
    super.refreshFileList('/api/vod/file/list', payload => (<APIResultVODFileList><any> payload).vod);
  }

  pushNewOBSPlaylist() {
    let payload = {'files': this.obs_playlist};
    this.http.post<APIResult>(environment.baseUrl + '/api/obs/playlist/update', payload).subscribe(json => {
      if (json.success === 'yes') {
        this.error_text = undefined;
      } else {
        this.error_text = json.error;
      }
    });
  }

  addToPlaylist(node) {
    this.obs_playlist.push(node.full_path);
  }

}
