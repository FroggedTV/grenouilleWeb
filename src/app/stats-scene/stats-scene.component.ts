import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {TokensService} from "../tokens.service";
import {UserService} from "../user.service";

@Component({
  selector: 'app-stats-scene',
  templateUrl: './stats-scene.component.html',
  styleUrls: ['./stats-scene.component.css']
})
export class StatsSceneComponent implements OnInit {

  constructor(
    private tokenService: TokensService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.refreshUI();
  }

  resetUI() {

  }

  refreshUI() {

  }

}
