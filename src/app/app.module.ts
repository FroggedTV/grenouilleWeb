import {BrowserModule} from '@angular/platform-browser';
import {NgModule, Injector} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import {MyMaterialsModule} from "./my-materials.module";
import {DndModule} from 'ng2-dnd';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './/app-routing.module';
import { TokensInterceptor } from './tokens.interceptor';
import {IndexComponent} from './index/index.component';
import {ObsControlComponent} from './obs-control/obs-control.component';
import {VodManageComponent} from './vod-manage/vod-manage.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {UserControlComponent} from './user-control/user-control.component';
import {StatsCsvComponent} from "./stats-csv/stats-csv.component";
import {StatsGlobalComponent} from "./stats-global/stats-global.component";
import {StatsSceneComponent} from "./stats-scene/stats-scene.component";

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    ObsControlComponent,
    VodManageComponent,
    SidebarComponent,
    UserControlComponent,
    StatsCsvComponent,
    StatsGlobalComponent,
    StatsSceneComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MyMaterialsModule,
    DndModule.forRoot()
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokensInterceptor,
    multi: true,
    deps: [Injector, Router]
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
