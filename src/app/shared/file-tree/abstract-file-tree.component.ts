import { HttpClient } from "@angular/common/http";
import {NestedTreeControl} from "@angular/cdk/tree";
import {MatTreeNestedDataSource} from "@angular/material";

import {environment} from "../../../environments/environment";
import {of} from "rxjs/internal/observable/of";

import { APIResult, SimpleFile } from "../../APIResults/APIResults";


export abstract class AbstractFileTreeComponent {

  treeControl: NestedTreeControl<FileNode>;
  treeData: MatTreeNestedDataSource<FileNode>;
  error_text = '';

  constructor(protected http: HttpClient) {
    this.treeControl = new NestedTreeControl<FileNode>(this._getChildren);
    this.treeData = new MatTreeNestedDataSource();
  }
  
  hasNestedChild = (_: number, nodeData: FileNode) => nodeData.type === 'dir';
  protected _getChildren = (node: FileNode) => of(node.children);
  
 /**
  * Generic, so any result which could be mapped to a SimpleFile[] can be used (atm only VODs, but who knows...).
  * 
  * @param urlContext the context of the backend to call
  * @param mapToSimpleFileArray a mapper which maps the result of the backend to a SimpleFile[]
  */
  refreshFileList(urlContext: string, mapToSimpleFileArray: <T>(t: T) => SimpleFile[]) {
    this.http.get<APIResult>(environment.baseUrl + urlContext).subscribe(json => {
      if (json.success === 'yes') {
        this.error_text = undefined;
        this.treeData.data = this.buildFileTree(mapToSimpleFileArray(json.payload));
        this.treeControl.dataNodes = this.treeData.data;
        // Open the first level of folders
        for (let node of this.treeData.data) {
          this.treeControl.expand(node);
        }
      } else {
        this.error_text = json.error;
      }
    });
  }

  /**
   * Builds a hierarchy tree from an array of SimpleFile.
   * 
   * @param files a list of SimpleFile[] which will be reflected in a tree
   * @returns an array of the first level nodes, each one containing its children
   */
  buildFileTree(files: SimpleFile[]): FileNode[] {
    let node_root = new FileNode('/', 'dir', 0, '');
    for (let file of files) {
      node_root.add_child_from_json(file.filename, file.type, file.size, file.filename);
    }
    return node_root.children;
  }
  
}


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
