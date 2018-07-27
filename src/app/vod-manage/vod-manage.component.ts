import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {TokensService} from "../tokens.service";
import {APIResult, APIResultVODFileList} from "../APIResults/APIResults";
import {environment} from "../../environments/environment";
import {NestedTreeControl} from "@angular/cdk/tree";
import {MatTreeNestedDataSource} from "@angular/material";
import {of} from "rxjs/internal/observable/of";
import {UserService} from "../user.service";

class FileNode {
  children: FileNode[];
  filename: string;
  full_path: string;
  type: any;
  size: number;

  constructor(filename, type, size, full_path) {
    this.filename = filename;
    this.type = type;
    this.size = size;
    this.children = [];
    this.full_path = full_path;
  }

  add_child(node: FileNode) {
    this.children.push(node);
  }

  add_child_from_json(filename, type, size, full_path) {
    if (filename.indexOf('/') >= 0) {
      let root = filename.slice(0, filename.indexOf('/'));
      let file_remaining = filename.slice(filename.indexOf('/') + 1, filename.length);

      let root_node = undefined;
      for (let child in this.children) {
        if (this.children[child].filename === root) {
          root_node = this.children[child];
          continue;
        }
      }
      if (root_node === undefined) {
        root_node = new FileNode(root, 'dir', undefined, full_path.slice(0, full_path.length-file_remaining.length));
        this.add_child(root_node);
      }
      root_node.add_child_from_json(file_remaining, type, size, full_path);
    } else {
      this.add_child(new FileNode(filename, type, size, full_path));
    }
  }

}

@Component({
  selector: 'app-vod-manage',
  templateUrl: './vod-manage.component.html',
  styleUrls: ['./vod-manage.component.css']
})
export class VodManageComponent implements OnInit {
  treeControl: NestedTreeControl<FileNode>;
  treeData: MatTreeNestedDataSource<FileNode>;

  error_text = undefined;
  file_selected = undefined;
  deleteConfirmation = undefined;
  moveSelection = undefined;
  editSelection = undefined;
  editNewName = undefined;
  newDirectoryName = undefined;

  constructor(
    private router: Router,
    private http: HttpClient,
    private tokenService: TokensService,
    public userService: UserService
  ) {
    this.treeControl = new NestedTreeControl<FileNode>(this._getChildren);
    this.treeData = new MatTreeNestedDataSource();
  }

  hasNestedChild = (_: number, nodeData: FileNode) => nodeData.type === 'dir';
  private _getChildren = (node: FileNode) => of(node.children);

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
    let options = {
      params: {data: JSON.stringify({})},
      headers: this.tokenService.getAuthTokenHeader().headers
    };
    this.http.get<APIResult>(environment.baseUrl + '/api/vod/file/list', options ).subscribe(json => {
      if (json.success === 'yes') {
        this.error_text = undefined;
        let result = <APIResultVODFileList> json.payload;
        this.treeData.data = this.build_tree(result);
      } else {
        this.error_text = json.error;
      }
    });
  }

  build_tree(json_data: APIResultVODFileList) {
    let node_root = new FileNode('/', 'dir', 0, '');
    for (let entry in json_data.vod) {
      let file = json_data.vod[entry];
      node_root.add_child_from_json(file.filename, file.type, file.size, file.filename);
    }
    return node_root.children;
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
