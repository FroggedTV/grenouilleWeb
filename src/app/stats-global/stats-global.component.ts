import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {TokensService} from "../tokens.service";
import {UserService} from "../user.service";

@Component({
  selector: 'app-stats-global',
  templateUrl: './stats-global.component.html',
  styleUrls: ['./stats-global.component.css']
})
export class StatsGlobalComponent implements OnInit {

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
