import { UserService } from './user.service';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService
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

}
