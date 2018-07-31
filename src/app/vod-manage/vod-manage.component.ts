import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {TokensService} from "../tokens.service";
import {APIResult, APIResultVODFileList} from "../APIResults/APIResults";
import {environment} from "../../environments/environment";
import {UserService} from "../user.service";
import { AbstractFileTreeComponent } from '../shared/file-tree/abstract-file-tree.component'

@Component({
  selector: 'app-vod-manage',
  templateUrl: './vod-manage.component.html',
  styleUrls: ['./vod-manage.component.css', '../shared/file-tree/file-tree.css']
})
export class VodManageComponent extends AbstractFileTreeComponent implements OnInit {

  file_selected = undefined;
  deleteConfirmation = undefined;
  moveSelection = undefined;
  editSelection = undefined;
  editNewName = undefined;
  newDirectoryName = undefined;

  constructor(
    private router: Router,
    http: HttpClient,
    private tokenService: TokensService,
    public userService: UserService
  ) {
    super(http);
  }

  ngOnInit() {
    this.refreshUI();
  }

  resetUI() {
    this.treeData.data = [];
    this.file_selected = undefined;
    this.deleteConfirmation = undefined;
    this.moveSelection = undefined;
    this.editSelection = undefined;
    this.editNewName = undefined;
    this.newDirectoryName = undefined;
  }

  refreshUI() {
    super.refreshFileList('/api/vod/file/list', payload => (<APIResultVODFileList><any> payload).vod);
  }

  selectNode(node) {
    this.file_selected = node;
    this.deleteConfirmation = undefined;
    this.editSelection = undefined;
    this.editNewName = undefined;
    this.newDirectoryName = undefined;
  }

  deleteSelection() {
    this.deleteConfirmation = this.file_selected;
  }

  validateDelete() {
    let payload = {'filename': this.deleteConfirmation.full_path};
    this.http.post<APIResult>(environment.baseUrl + '/api/vod/file/delete', payload).subscribe(json => {
      if (json.success === 'yes') {
        this.error_text = undefined;
        this.resetUI();
        this.refreshUI()
      } else {
        this.error_text = json.error;
      }
    });
  }

  cancelDelete() {
    this.deleteConfirmation = undefined;
  }

  moveSelect() {
    this.moveSelection = this.file_selected;
  }

  moveDrop() {
    let payload = {'source': this.moveSelection.full_path, 'destination': this.file_selected.full_path + '/' + this.moveSelection.filename};
    this.http.post<APIResult>(environment.baseUrl + '/api/vod/file/move', payload ).subscribe(json => {
      if (json.success === 'yes') {
        this.error_text = undefined;
        this.resetUI();
        this.refreshUI()
      } else {
        this.error_text = json.error;
      }
    });
  }

  editSelect() {
    this.editSelection = this.file_selected;
    this.editNewName = this.editSelection.filename;
  }

  validateEdit() {
    if (this.editNewName.length === 0)
      return;
    let destination = this.editSelection.full_path.slice(0, this.editSelection.full_path.length - this.editSelection.filename.length) + '/' + this.editNewName;
    let payload = {'source': this.editSelection.full_path, 'destination': destination};
    this.http.post<APIResult>(environment.baseUrl + '/api/vod/file/move', payload ).subscribe(json => {
      if (json.success === 'yes') {
        this.error_text = undefined;
        this.resetUI();
        this.refreshUI()
      } else {
        this.error_text = json.error;
      }
    });
  }

  cancelEdit() {
    this.editSelection = undefined;
  }

  createNewDirectory() {
    this.newDirectoryName = ''
  }

  validateNewDirectory() {
    if (this.newDirectoryName.length === 0) {
      return;
    }
    let payload = {'dir': this.file_selected.full_path + '/' + this.newDirectoryName};
    this.http.post<APIResult>(environment.baseUrl + '/api/vod/dir/create', payload ).subscribe(json => {
      if (json.success === 'yes') {
        this.error_text = undefined;
        this.resetUI();
        this.refreshUI()
      } else {
        this.error_text = json.error;
      }
    });

  }

  cancelNewDirectory() {
    this.newDirectoryName = undefined;
  }
}
